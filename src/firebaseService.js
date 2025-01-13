import { auth, db, app } from "./firebaseConfig"; // Use named imports
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Register user and store their information in Firestore
export const registerUser = async (email, password) => {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            createdAt: new Date(),
        });

        console.log("User registered successfully and data saved in Firestore!");
        return user; // Return user details if needed
    } catch (error) {
        console.error("Error registering user: ", error.message);
        throw error; // Rethrow the error for handling in calling components
    }
};
