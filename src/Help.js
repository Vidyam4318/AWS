import React from 'react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
    const navigate = useNavigate();

    const handleHelpRedirect = () => {
        // Replace with your RT tool URL
        window.location.href = "https://try.requesttracker.io/mitasjage_71491/"; // Or your own hosted RT URL
    };

    return (
        <div>
            <h2>Help Section</h2>
            <button onClick={handleHelpRedirect}>
                Go to Request Tracker
            </button>
        </div>
    );
};

export default Help;
