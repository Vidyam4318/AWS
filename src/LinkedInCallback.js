import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed and imported

const LinkedInCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLinkedInLogin = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code'); // Retrieve LinkedIn authorization code

            if (code) {
                try {
                    // Make a POST request to exchange code for an access token
                    const response = await axios.post('http://localhost:5000/auth/linkedin', { code });

                    const { user, email } = response.data; // Extract user data from response
                    console.log('User:', user);
                    console.log('Email:', email);

                    // Navigate to the welcome page with the user's email
                    navigate(`/welcome/${email}`);
                } catch (error) {
                    console.error('Error during LinkedIn login:', error);

                    // Navigate back to login page on error
                    navigate('/');
                }
            }
        };

        handleLinkedInLogin(); // Call the function
    }, [navigate]); // Dependency array to prevent re-runs

    return (
        <div>
            <h2>Processing LinkedIn Login...</h2>
        </div>
    );
};

export default LinkedInCallback;
