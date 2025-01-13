import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentHandler = ({ onPaymentSuccess }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Create a Razorpay order on the backend
    const createRazorpayOrder = async (amount) => {
        try {
            const response = await fetch('http://localhost:5000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currency: 'INR' }),
            });

            if (!response.ok) {
                throw new Error('Failed to create Razorpay order');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            alert('Failed to create order. Please try again later.');
        }
    };

    // Load Razorpay SDK script
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => reject(false);
            document.body.appendChild(script);
        });
    };

    // Handle Razorpay payment flow
    const handleRazorpayScreen = async () => {
        setLoading(true); // Show loading state
        const amount = 50000; // Example amount in paise (INR)

        try {
            // Load Razorpay SDK
            const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            if (!scriptLoaded) {
                alert('Failed to load Razorpay SDK. Please refresh the page and try again.');
                return;
            }

            // Create Razorpay order from backend
            const order = await createRazorpayOrder(amount);
            if (!order) {
                alert('Failed to create Razorpay order. Please try again.');
                return;
            }

            // Razorpay options
            const options = {
                key: 'rzp_test_yZLR0HdMtSX5Hk', // Replace with your Razorpay Test API Key
                amount: order.amount, // Amount in paise
                currency: 'INR',
                name: 'Your Company Name',
                description: 'Payment for order',
                image: 'https://your-logo-url.com/logo.png', // Optional logo URL
                order_id: order.id, // Pass Razorpay order ID
                handler: (response) => {
                    // Handle successful payment
                    onPaymentSuccess(response.razorpay_payment_id); // Call parent callback
                    alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                    navigate('/jupyterputty'); // Navigate to the correct page
                },
                prefill: {
                    name: 'Your Name',
                    email: 'youremail@example.com',
                },
                theme: {
                    color: '#F4C430', // Custom color for payment modal
                },
            };

            // Open Razorpay payment modal
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Error during Razorpay payment process:', error);
            alert('An error occurred during payment. Please try again later.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            <h1>Payment Page</h1>
            <button onClick={handleRazorpayScreen} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default PaymentHandler;