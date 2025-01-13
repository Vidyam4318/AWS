import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import linkedinLogo from "./assets/linkedin-logo.jpg";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqImlWVCgBzm9NmWLO_PTX0a-XLAe-efQ",
    authDomain: "fir-project-605f6.firebaseapp.com",
    projectId: "fir-project-605f6",
    storageBucket: "fir-project-605f6.firebasestorage.app",
    messagingSenderId: "574304064991",
    appId: "1:574304064991:web:1e14e123c2e6084daba06a",
    measurementId: "G-J6JEL1V6BF",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    // Handle email/password login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const creationDate = new Date(user.metadata.creationTime);
            const currentDate = new Date();
            const diffDays = Math.floor((currentDate - creationDate) / (1000 * 60 * 60 * 24));

            if (diffDays > 10) {
                setErrorMessage("Your account has expired. Please reset your password.");
                return;
            }

            setSuccessMessage("Login successful!");
            setTimeout(() => {
                navigate(email === "admin@example.com" ? "/admin/dashboard" : "/AutoInstallation");
            }, 1500);
        } catch (error) {
            if (error.code === "auth/user-disabled") {
                setErrorMessage("Your account is disabled. Please request account renewal.");
            } else {
                setErrorMessage("Login failed. Please try again.");
            }
        }
    };

    // Handle Google login success
    const handleGoogleSuccess = async (response) => {
        try {
            const credential = GoogleAuthProvider.credential(response.credential);
            const userCredential = await signInWithCredential(auth, credential);
            if (userCredential) {
                navigate(userCredential.user.email === "admin@example.com" ? "/admin/dashboard" : "/AutoInstallation");
            }
        } catch (error) {
            console.error("Google login failed:", error);
            setErrorMessage("Google login failed. Please try again.");
        }
    };

    // Handle Google login failure
    const handleGoogleFailure = (error) => {
        console.error("Google login failed: ", error);
        setErrorMessage("Google login failed. Please try again.");
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // Handle account renewal request
    const handleRequestRenewal = async () => {
        try {
            await axios.post("http://localhost:5000/api/account-renewal", { email });
            alert("Renewal email sent. Please check your inbox.");
        } catch (err) {
            alert("Error sending renewal email: " + err.response.data);
        }
    };

    return (
        <div className="login-container">
            <div className="left-section">
                <div className="text-overlay">
                    <p>
                        Param Supercomputing provided through this platform is mainly for academic purposes.
                        HPC Virtual Lab Access assists teaching parallel programming in practical learning environments.
                    </p>
                </div>
            </div>
            <div className="right-section">
                <div className="login-form">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={togglePasswordVisibility}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                    {errorMessage && (
                        <div>
                            <p style={{ color: "red" }}>{errorMessage}</p>
                            {errorMessage.includes("disabled") && (
                                <button onClick={handleRequestRenewal}>Request Account Renewal</button>
                            )}
                        </div>
                    )}
                    <p>
                        <a href="#" onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
                    </p>
                    <p>
                        Don't have an account? <a href="/register">Register here</a>
                    </p>
                    <button type="button" className="linkedin-button">
                        <img
                            src={linkedinLogo}
                            alt="LinkedIn Logo"
                            style={{ width: "24px", height: "24px", marginRight: "8px" }}
                        />
                        Login with LinkedIn
                    </button>
                    <div className="google-login">
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;