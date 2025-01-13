const User = require('./saveFirebaseUser'); // Import the User model
const admin = require('./firebaseAdmin'); // Firebase Admin SDK initialization

async function saveFirebaseUser(uid) {
    if (!uid || typeof uid !== 'string' || uid.length > 128) {
        console.error('Invalid UID provided:', uid);
        return;
    }

    try {
        const userRecord = await admin.auth().getUser(uid);

        // Check if the user already exists in MongoDB
        const existingUser = await User.findOne({ uid });
        if (existingUser) {
            console.log('User already exists in the database');
            return;
        }

        // Save the user data to MongoDB
        const newUser = new User({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || null,
            photoURL: userRecord.photoURL || null,
            creationTime: userRecord.metadata.creationTime,
        });

        await newUser.save();
        console.log('User data saved successfully:', newUser);
    } catch (error) {
        console.error('Error saving user data to MongoDB:', error);
    }
}

module.exports = saveFirebaseUser;
