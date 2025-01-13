const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const UserModel = require("./users"); // Existing user model
const RegisterUserModel = require("./registerUserModel"); // New user model
const razorpayServer = require("./razorpayServer");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection string
const mongoURI = "mongodb://localhost:27017/authentication";

// Connect to MongoDB
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(require("./firebase-admin-sdk.json")),
});

// Secret key for JWT
const JWT_SECRET = "YOUR_SECRET_KEY"; // Replace with your actual secret key

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "v5071634@gmail.com", // Replace with your email
        pass: "hnon nhuo yiuu qhha", // Replace with your Gmail App Password
    },
});

// Set up Multer for file handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Helper function to send email notifications
const sendStatusEmail = async (email, status) => {
    try {
        const mailOptions = {
            from: "v5071634@gmail.com",
            to: email,
            subject: `Account Status Updated: ${status}`,
            html: `
                <h2>Your account status has been updated</h2>
                <p>Your account status is now: <strong>${status}</strong>.</p>
                <p>If you have any questions, please contact support.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Status email sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Register User API with file upload
app.post("/register", upload.single("file"), async (req, res) => {
    const { firstName, lastName, designation, phoneNumber, email, educationalDetails, percentage, address } = req.body;
    const file = req.file ? req.file.filename : null; // Save the file name

    if (!file) {
        return res.status(400).send("No file uploaded");
    }

    // Determine the status based on the percentage
    let status = '';
    const userPercentage = parseFloat(percentage);

    if (userPercentage >= 75) {
        status = 'Approval';
    } else if (userPercentage >= 50 && userPercentage < 75) {
        status = 'Pending';
    } else {
        status = 'Rejected';
    }

    // Send status email notification
    sendStatusEmail(email, status);

    const newUser = new RegisterUserModel({
        firstName,
        lastName,
        designation,
        phoneNumber,
        email,
        educationalDetails,
        percentage,
        address,
        file,
        status
    });

    try {
        // Save the new user to the database
        await newUser.save();

        // Send email notification to the user after successful registration
        const mailOptions = {
            from: "v5071634@gmail.com", // Your email
            to: email,                  // User's email
            subject: "Registration Successful",
            html: `
                <h2>Welcome to our platform, ${firstName} ${lastName}!</h2>
                <p>Your registration was successful. We are excited to have you on board.</p>
                <p>Your details:</p>
                <ul>
                    <li><strong>Designation:</strong> ${designation}</li>
                    <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Educational Details:</strong> ${educationalDetails}</li>
                    <li><strong>Percentage:</strong> ${percentage}%</li>
                    <li><strong>Address:</strong> ${address}</li>
                </ul>
                <p>If you have any questions or need support, feel free to reach out to us.</p>
                <p>Best regards,</p>
                <p>Your Team</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Respond with success message
        return res.status(200).send("User registered successfully! An email has been sent to you.");
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send("Error registering user");
    }
});

// API to send email after updating user status
app.post("/sendStatusEmail", async (req, res) => {
    const { email, status } = req.body;

    try {
        await sendStatusEmail(email, status);  // Send email using your existing sendStatusEmail function
        res.status(200).send("Status email sent successfully.");
    } catch (error) {
        res.status(500).send("Error sending status email: " + error.message);
    }
});

// Sync Firebase Users to MongoDB and Disable Accounts After 10 Days
async function syncFirebaseUsersToDB() {
    try {
        const listUsersResult = await admin.auth().listUsers(1000);
        const now = new Date();

        for (const user of listUsersResult.users) {
            const createdAt = new Date(user.metadata.creationTime);
            const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
            const disabled = daysSinceCreation > 10;

            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                createdAt,
                disabled,
            };

            await UserModel.updateOne({ uid: user.uid }, { $set: userData }, { upsert: true });

            // Sync with Firebase
            if (disabled !== user.disabled) {
                await admin.auth().updateUser(user.uid, { disabled });

                // If user is re-enabled, send renewal email
                if (!disabled) {
                    const mailOptions = {
                        from: "v5071634@gmail.com",
                        to: user.email,
                        subject: "Account Renewal",
                        html: `
                            <h2>Your account has been re-enabled</h2>
                            <p>Your account was previously disabled due to inactivity. It's now active again. You can now log in using your email and password.</p>
                        `,
                    };

                    await transporter.sendMail(mailOptions);
                }
            }
        }

        console.log("Firebase users synchronized with MongoDB and account age checked.");
    } catch (error) {
        console.error("Error syncing users:", error);
    }
}

// API to request account renewal
app.post("/api/account-renewal", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await admin.auth().getUserByEmail(email);

        if (user.disabled) {
            const renewalToken = jwt.sign({ uid: user.uid }, JWT_SECRET, { expiresIn: "1h" });
            const renewalLink = `http://localhost:3000/renew-account?token=${renewalToken}`;

            // Send renewal email
            const mailOptions = {
                from: "v5071634@gmail.com",
                to: email,
                subject: "Account Renewal Request",
                html: `
                    <h2>Reactivate Your Account</h2>
                    <p>Your account has been disabled due to inactivity. Click the link below to reactivate:</p>
                    <a href="${renewalLink}">Reactivate My Account</a>
                `,
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).send("Renewal email sent successfully.");
        } else {
            return res.status(400).send("Account is already active.");
        }
    } catch (error) {
        return res.status(500).send("Error processing request: " + error.message);
    }
});

// API to reactivate account
app.post("/api/reactivate-account", async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { uid } = decoded;

        await admin.auth().updateUser(uid, { disabled: false });
        return res.status(200).send("Account reactivated successfully.");
    } catch (error) {
        return res.status(400).send("Invalid or expired token.");
    }
});

// Password Reset Endpoint
app.post("/users/:uid/reset-password", async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await admin.auth().getUser(uid);
        if (!user.email) {
            return res.status(400).send("User does not have an email associated.");
        }

        const resetLink = await admin.auth().generatePasswordResetLink(user.email);

        const mailOptions = {
            from: "v5071634@gmail.com",
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" target="_blank">Reset Password</a>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send("Password reset email sent successfully.");
    } catch (error) {
        res.status(500).send("Error resetting password: " + error.message);
    }
});

// Update user account status
app.patch("/users/:uid/status", async (req, res) => {
    const { uid } = req.params;
    const { disabled } = req.body;

    try {
        await admin.auth().updateUser(uid, { disabled });
        await UserModel.updateOne({ uid }, { $set: { disabled } });

        res.status(200).send(`User ${uid} ${disabled ? "disabled" : "enabled"} successfully.`);
    } catch (error) {
        res.status(500).send("Error updating user status: " + error.message);
    }
});

// Get users
app.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({}, { email: 1, uid: 1, createdAt: 1, disabled: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).send("Error fetching users: " + error.message);
    }
});

// Get registered users
app.get("/registered-users", async (req, res) => {
    try {
        const registeredUsers = await RegisterUserModel.find({}, { firstName: 1, lastName: 1, designation: 1, phoneNumber: 1, email: 1, percentage: 1, address: 1, file: 1 });
        res.json(registeredUsers);
    } catch (error) {
        res.status(500).send("Error fetching registered users: " + error.message);
    }
});

// Sync Firebase users on server start
syncFirebaseUsersToDB();

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
