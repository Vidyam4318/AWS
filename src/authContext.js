import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Make sure to import your Firebase authentication setup

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
