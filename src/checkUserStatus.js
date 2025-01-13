// Import necessary Firestore and Firebase modules
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Initialize Firestore and Firebase Authentication
const auth = getAuth();
const db = getFirestore();

const checkUserStatus = async () => {
    const user = auth.currentUser;  // Get the current authenticated user

    if (user) {
        const userId = user.uid;  // Get the user's UID
        const userDocRef = doc(db, "admin", userId);  // Firestore reference to the user's document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const data = userDoc.data();

            if (data.disabled) {
                alert("Your account has been disabled. Please contact support.");
                return false;  // Prevent login if the account is disabled
            } else {
                return true;  // Allow login if the account is active
            }
        } else {
            console.log("User document not found!");
            return false;
        }
    } else {
        console.log("No user is signed in.");
        return false;
    }
};

// Example usage: Call this function when a user logs in
checkUserStatus();
