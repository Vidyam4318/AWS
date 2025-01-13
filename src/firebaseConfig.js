// firebaseConfig.js
import { initializeApp } from 'firebase/app'; // Firebase initialization
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase Authentication
import { getFirestore } from 'firebase/firestore'; // Firebase Firestore

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

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Function to check auth state
const checkAuthState = (callback) => {
    onAuthStateChanged(auth, callback);  // This will pass the user object if logged in, or null if not
};

// Function to log out the user
const logout = () => {
    return signOut(auth); // Signs out the user
};

// Export Firebase instances and helper functions
export { auth, db, checkAuthState, logout };
