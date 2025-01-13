// CartPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';

function CartPage({ cart, onRemoveItem }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const participantName = location.state?.participantName || 'Test User';

    const totalAmount = cart.reduce((sum, item) => sum + (item.amount || 0), 0);

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (amount, itemParticipantName) => {
        try {
            setLoading(true);
            await loadRazorpayScript();

            const response = await axios.post('http://localhost:5000/orders', {
                amount: amount,
                currency: 'INR',
                duration: 30,
                start_date: new Date().toISOString(),
                participant_name: itemParticipantName,
                quantity: 1,
            });

            const { order_id, amount: orderAmount, currency } = response.data;

            const options = {
                key: 'rzp_test_1BkbvUiG6Er2NL',
                amount: orderAmount,
                currency: currency,
                order_id: order_id,
                handler: function (response) {
                    alert("Payment successful!");
                    navigate('/Jupyterputty');
                },
                prefill: {
                    name: itemParticipantName,
                    email: 'test@example.com',
                    contact: '1234567890'
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            alert("Error creating order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleProceedToPayment = () => {
        if (totalAmount > 0) {
            handlePayment(totalAmount, participantName);
        } else {
            alert("Your cart is empty.");
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="cart-container">
            <h2>Cart</h2>
            <ul className="cart-list">
                {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                        <span>Amount: ?{item.amount} for {item.days} Days</span>
                        <div className="button-group">
                            <button onClick={() => onRemoveItem(index)}>Remove</button>
                            <button
                                onClick={() => handlePayment(item.amount, item.participantName)}
                                className="payment-button"
                            >
                                Pay Now
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {cart.length > 0 && (
                <div className="cart-summary">
                    <div className="total-amount">Total: ?{totalAmount}</div>
                    <button onClick={handleProceedToPayment} className="payment-button">Proceed to Payment</button>
                </div>
            )}
            <button onClick={handleGoBack} className="back-button">Back</button>
        </div>
    );
}

export default CartPage;