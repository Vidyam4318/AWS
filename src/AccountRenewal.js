import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCqImlWVCgBzm9NmWLO_PTX0a-XLAe-efQ',
    authDomain: 'fir-project-605f6.firebaseapp.com',
    projectId: 'fir-project-605f6',
    storageBucket: 'fir-project-605f6.firebasestorage.app',
    messagingSenderId: '574304064991',
    appId: '1:574304064991:web:1e14e123c2e6084daba06a',
    measurementId: 'G-J6JEL1V6BF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const AccountRenewal = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            axios
                .post("http://localhost:5000/api/reactivate-account", { token })
                .then((response) => {
                    setStatus("Account reactivated successfully. Please log in again.");
                })
                .catch((error) => {
                    setStatus("Failed to reactivate account: " + (error.response?.data || "Unknown error"));
                    console.error("Reactivation error:", error); // Log error details for debugging
                });
        } else {
            setStatus("Invalid or missing token.");
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth(app);

        if (!email || !password) {
            setLoginStatus("Email and Password are required.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoginStatus("Login successful.");
            navigate("/autoinstallation"); // Redirect to the Auto Installation page after login
        } catch (error) {
            console.error("Login error:", error);
            if (error.code === "auth/invalid-credential") {
                setLoginStatus("Invalid credentials. Please check your email and password.");
            } else if (error.code === "auth/user-not-found") {
                setLoginStatus("No user found with this email.");
            } else if (error.code === "auth/wrong-password") {
                setLoginStatus("Incorrect password.");
            } else if (error.code === "auth/account-exists-with-different-credential") {
                setLoginStatus("Account exists with a different credential.");
            } else {
                setLoginStatus("Login failed: " + error.message);
            }
        }
    };

    const handlePasswordReset = async () => {
        const auth = getAuth(app);

        if (!email) {
            setLoginStatus("Email is required to reset password.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setLoginStatus("Password reset email sent. Please check your inbox.");
        } catch (error) {
            console.error("Password reset error:", error);
            setLoginStatus("Failed to send password reset email: " + error.message);
        }
    };

    return (
        <div>
            <h2>Account Renewal</h2>
            <p>{status}</p>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
            </form>
            {loginStatus && <p>{loginStatus}</p>}
            <button onClick={handlePasswordReset}>Reset Password</button>
        </div>
    );
};

export default AccountRenewal;
