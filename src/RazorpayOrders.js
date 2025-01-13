// src/components/RazorpayOrders.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RazorpayOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5001/api/orders')
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch orders');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Razorpay Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th>Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.order_id}</td>
                            <td>{order.amount / 100} {order.currency}</td>
                            <td>{order.status}</td>
                            <td>{order.email}</td>
                            <td>{order.payment_details.method}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RazorpayOrders;
