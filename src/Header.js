import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom and useNavigate for navigation
import './Header.css'; // Import CSS file for styling
import { FaSignInAlt } from 'react-icons/fa'; // Importing the Sign In icon from react-icons

const Header = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    // Handle Sign In button click to navigate to the login page
    const handleSignInClick = () => {
        navigate('/login'); // Navigate to the login page
    };

    // Handle Create Account button click to navigate to the signup page
    const handleSignUpClick = () => {
        navigate('/signup'); // Navigate to the signup page
    };

    // Handle Help button click to navigate directly to the Request Tracker tool
    const handleHelpClick = () => {
        window.location.href = "https://try.requesttracker.io/mitasjage_71491/"; // Direct redirect to RT tool
    };

    return (
        <header className="header">
            <div className="header-top">
                <div className="logo">Computing Resource Reservation Platform</div>
                <ul className="auth-links">
                    <li>
                        <button onClick={handleSignInClick}>
                            <FaSignInAlt style={{ marginRight: '8px' }} />
                            Sign In
                        </button>
                    </li>
                    <li>
                        <button className="signup-button" onClick={handleSignUpClick}>
                            Create an Account
                        </button>
                    </li>
                    <li>
                        <button onClick={handleHelpClick}>Help</button> {/* Help Button */}
                    </li>
                </ul>
            </div>

            {/* Navigation links */}
            <nav className="navbar">
                <ul className="nav-links">
                    <li><Link to="/overview">Overview</Link></li>
                    <li><Link to="/categories">Categories</Link></li>
                    <li><Link to="/features">Features</Link></li>
                    <li><Link to="/faqs">FAQs</Link></li>
                    <li><Link to="/terms">Terms and Conditions</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
