import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from './firebaseConfig'; // Import the custom hook to get auth state

const ProtectedRoute = ({ element, ...rest }) => {
    const currentUser = useAuth(); // Get current user from firebaseConfig

    // If the user is not authenticated, redirect to the login page
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // If the user is authenticated, render the protected route
    return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
