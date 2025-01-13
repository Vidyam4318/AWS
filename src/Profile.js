import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Profile.css';  // Importing the CSS for styling

const Profile = () => {
    const [user, setUser] = useState(null); // Store logged-in user details

    useEffect(() => {
        const auth = getAuth();

        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Set user details
            } else {
                setUser(null); // Clear user state if logged out
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    return (
        <div className="profile-container">
            <h1 className="profile-heading">Your Profile</h1>
            {user ? (
                <div className="profile-info">
                    <p className="welcome-message">Welcome, <strong>{user.email}</strong>!</p>
                    {/* You can add more profile info or edit options here */}
                </div>
            ) : (
                <p className="login-message">You are not logged in. Please log in to access your profile.</p>
            )}
        </div>
    );
};

export default Profile;
