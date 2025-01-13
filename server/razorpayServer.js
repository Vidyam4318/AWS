// razorpayServer.js
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB setup
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/razorpayOrders';
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Schema for Razorpay order details
const orderSchema = new mongoose.Schema({
    order_id: String,
    amount: Number,
    currency: String,
    receipt: String,
    status: { type: String, default: "created" },
    email: String,  // Store the email here
    selectedNodes: [Number],
    uploaded_files: [String],
    payment_details: {
        method: String,
        payment_id: String,
        payment_date: Date,
    },
    created_at: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

// Razorpay instance setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_yZLR0HdMtSX5Hk",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "63z6wLMBLp1vAbsjpc7q5Rzk",
});

// Razorpay order creation API
app.post("/api/orders/create", async (req, res) => {
    const { amount, currency, receipt, email } = req.body;  // Receiving email from the frontend

    try {
        const options = {
            amount: amount * 100, // Amount in the smallest currency unit (paise)
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);

        const newOrder = new Order({
            order_id: order.id,
            amount: options.amount,
            currency: options.currency,
            receipt: options.receipt,
            email, // Store the email received from the frontend here
        });

        await newOrder.save();
        res.json({ order, newOrder });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ message: "Failed to create Razorpay order." });
    }
});

// Razorpay payment success route
app.post("/api/orders/success", async (req, res) => {
    const { order_id, payment_id, payment_date, method } = req.body;

    try {
        if (!payment_id) {
            return res.status(400).json({ message: "Payment ID is missing." });
        }

        const payment = await razorpay.payments.fetch(payment_id);

        if (!payment || payment.status !== 'captured') {
            return res.status(400).json({ message: "Payment failed or payment status not captured." });
        }

        const order = await Order.findOne({ order_id });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        order.status = "paid";
        order.payment_details = { method, payment_id, payment_date };
        await order.save();

        console.log(`Payment successful for order ${order_id}.`);
        res.json({ message: "Payment successful.", order });
    } catch (error) {
        console.error("Payment success error:", error);
        res.status(500).json({ message: "Failed to process payment success." });
    }
});

// Get orders
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).send("Error fetching orders: " + error.message);
    }
});

// Start the server on port 5001
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Razorpay Server running on port ${PORT}`);
});
