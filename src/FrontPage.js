import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for routing and useNavigate for navigation
import Overview from './Overview'; // Import Overview component
import Login from './Login'; // Import Login component
import Categories from './Categories'; // Import Categories component
import './FrontPage.css'; // Import CSS for styling
import FAQs from './FAQs';
import Termsandcondition from './Termsandcondition';
import Dashboard from './Dashboard';



const FrontPage = () => {
    const [activePage, setActivePage] = useState(''); // Track active page state
    const navigate = useNavigate(); // Initialize navigate function

    // Handle navigation when a link is clicked
    const handleNavigation = (page, e) => {
        e.preventDefault(); // Prevent default scroll behavior
        setActivePage(page); // Set active page based on the clicked link
    };

    return (
        <div className="front-page">
            <header>
                <h1>Computing Resource Reservation Platfom</h1>
                <nav>
                    {/* Links to navigate to different sections */}
                    <Link to="/overview" onClick={(e) => handleNavigation('overview', e)}>Overview</Link>
                    <Link to="/categories" onClick={(e) => handleNavigation('categories', e)}>Categories</Link>
                    <Link to="/features" onClick={(e) => handleNavigation('features', e)}>Features</Link>
                    <Link to="/faqs" onClick={(e) => handleNavigation('faqs', e)}>FAQs</Link>
                    <Link to="/terms" onClick={(e) => handleNavigation('terms', e)}>TermsandConditions</Link>
                    <Link to="/dashboard" onClick={(e) => handleNavigation('dashboard', e)}>Dashboard</Link>
                </nav>
                <div className="buttons">
                    {/* Navigation to login and registration pages */}
                    <button onClick={() => navigate('/login')}>Sign In</button>
                    <button onClick={() => navigate('/register')}>Create an Account</button>
                </div>
            </header>

            {/* Dynamically render content based on activePage */}
            {activePage === 'overview' && <Overview />}
            {activePage === 'login' && <Login />}
            {activePage === 'categories' && <Categories />}
            {activePage === 'faqs' && <FAQs />}
            {activePage === 'Termsand condition' && <Termsandcondition />}
            {activePage === 'dashboard' && <Dashboard />}

            {/* You can add more sections dynamically like 'features', 'terms', etc., when necessary */}

            <footer>
                <p>
                    © 2024 Computing Resource Booking Platform. All rights reserved.
                    Empowering seamless access to cloud computing resources.
                </p>
                <p>Follow us on social media for updates!</p>
                <p>
                    <Link to="/terms">Terms</Link> | <Link to="/privacy">Privacy</Link>
                </p>
            </footer>
        </div>
    );
};

export default FrontPage;
