// useAuth.js
import { useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Import auth from firebaseConfig
import { onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // Set the user when authentication state changes
        });

        return unsubscribe; // Cleanup the listener when component unmounts
    }, []);

    return currentUser; // Return the current user or null
};
