import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './authContext';
import io from 'socket.io-client';

// Component imports
import Overview from './Overview';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import Header from './Header';
import Footer from './Footer';
import Hero from './Hero';
import FAQs from './FAQs';
import Termsandcondition from './Termsandcondition';
import Login from './Login';
import AutoInstallationPage from './AutoInstallationPage';
import OrderPage from './OrderPage';
import Categories from './Categories';
import Features from './Features';
import ShortTerm from './ShortTerm';
import LongTerm from './LongTerm';
import ForgotPassword from './ForgotPassword';
import CartPage from './CartPage';
import Help from './Help';
import LinkedInCallback from './LinkedInCallback';
import Registration from './Registration';
import AccountRenewal from './AccountRenewal';
import RazorpayOrders from './RazorpayOrders';
import RegisterForm from './RegisterForm';
// Socket.io setup
const socket = io('http://localhost:5000');

// Google OAuth Client ID
const clientId = "652020141620-gcakic12f28m138ucqilbegb16i1583n.apps.googleusercontent.com";

const App = () => {
    const [cart, setCart] = useState([]);
    const [responseId, setResponseId] = useState("");
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [tickets, setTickets] = useState([]);

    // Fetch tickets and set up real-time updates
    useEffect(() => {
        fetch("http://localhost:5000/tickets")
            .then((response) => response.json())
            .then((data) => setTickets(data))
            .catch((error) => console.error("Error fetching tickets:", error));

        socket.on("new-ticket", (ticket) => {
            setTickets((prevTickets) => [ticket, ...prevTickets]);
        });

        socket.on("update-ticket", (updatedTicket) => {
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket._id === updatedTicket._id ? updatedTicket : ticket
                )
            );
        });

        socket.on("delete-ticket", (deletedId) => {
            setTickets((prevTickets) =>
                prevTickets.filter((ticket) => ticket._id !== deletedId)
            );
        });

        return () => {
            socket.off("new-ticket");
            socket.off("update-ticket");
            socket.off("delete-ticket");
        };
    }, []);

    // Firebase authentication and user role
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchUserRole(user);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchUserRole = async (user) => {
        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/get-user-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ email: user.email }),
            });

            if (!response.ok) throw new Error('Failed to fetch user role');
            const data = await response.json();
            setRole(data.role || null);
        } catch (error) {
            console.error("Error fetching user role:", error);
            setRole(null);
        }
    };

    const handleAdminLogin = () => setIsAdminLoggedIn(true);
    const handleAdminLogout = () => setIsAdminLoggedIn(false);

    const ProtectedRoute = ({ element }) => {
        if (loading) return <p>Loading...</p>;
        return role === 'admin' ? element : <Navigate to="/order" />;
    };

    const AdminRoute = ({ element }) => {
        if (loading) return <p>Loading...</p>;
        return user?.email === 'admin@example.com' ? element : <Navigate to="/AutoInstallation" />;
    };

    const addItemToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
        alert("Item added to cart!");
    };

    const handleRemoveItem = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    const handlePaymentSuccess = (id) => setResponseId(id);

    return (
        <AuthProvider>
            <GoogleOAuthProvider clientId={clientId}>
                <Router>
                    <Header />
                    <div className="content-container">
                        {isAdminLoggedIn ? (
                            <>
                                <AdminDashboard tickets={tickets} />
                                <button onClick={handleAdminLogout}>Logout</button>
                            </>
                        ) : (
                            <Routes>
                                <Route path="/" element={<Hero />} />
                                <Route path="/overview" element={<Overview />} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/features" element={<Features />} />
                                <Route path="/faqs" element={<FAQs />} />
                                <Route path="/terms" element={<Termsandcondition />} />
                                <Route path="/help" element={<Help />} />
                                <Route path="/login" element={<Login />} />
                               
                                    <Route path="/AutoInstallation" element={<AutoInstallationPage />} />
                                    <Route path="/registerForm" element={<RegisterForm />} />
                                <Route path="/registration" element={<Registration />} />
                                <Route path="/short-term" element={<ShortTerm />} />
                                <Route path="/long-term" element={<LongTerm />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/linkedIn/callback" element={<LinkedInCallback />} />
                                <Route path="/order" element={<OrderPage onAddToCart={addItemToCart} />} />
                                <Route path="/cart" element={<CartPage cart={cart} onRemoveItem={handleRemoveItem} />} />
                                <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
                                <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
                                <Route path="/renew-account" element={<AccountRenewal />} />
                                <Route path="/admin/orders" element={<RazorpayOrders />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        )}
                        {responseId && <p>Payment ID: {responseId}</p>}
                    </div>
                    <Footer />
                </Router>
            </GoogleOAuthProvider>
        </AuthProvider>
    );
};

export default App;
