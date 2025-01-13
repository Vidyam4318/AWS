import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { checkAuthState, logout } from "./firebaseConfig"; // Import the correct functions

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUsers, setShowUsers] = useState(false); // State to toggle user records
    const [orders, setOrders] = useState([]); // State for Razorpay orders
    const [showOrders, setShowOrders] = useState(false); // State to toggle Razorpay orders
    const [showRegisteredUsers, setShowRegisteredUsers] = useState(false); // State to toggle registered users
    const [registeredUsers, setRegisteredUsers] = useState([]); // State for registered users
    const [activeUser, setActiveUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        checkAuthState((user) => {
            if (user) {
                setActiveUser(user);
            } else {
                setActiveUser(null);
            }
        });
    }, []);

    const handleLogout = () => {
        logout()
            .then(() => {
                alert("You have been logged out.");
                setActiveUser(null);
                window.location.href = "/login";
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    const fetchRegisteredUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/registered-users");
            const data = await response.json();
            setRegisteredUsers(data);
        } catch (error) {
            console.error("Error fetching registered users:", error);
        }
    };

    const fetchRazorpayOrders = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/orders");
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching Razorpay orders:", error);
        }
    };

    const handleAccountStatus = async (uid, isDisabled) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${uid}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ disabled: isDisabled }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error updating account status:", error);
        }
    };

    const handleResetPassword = async (uid) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${uid}/reset-password`, {
                method: 'POST',
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error resetting password:", error);
        }
    };

    const sendEmail = async (email, status) => {
        try {
            const response = await fetch("http://localhost:5000/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    subject: "User Registration Status Update",
                    message: `Your registration status has been updated to: ${status}.`,
                }),
            });

            if (response.ok) {
                alert(`Email sent to ${email} regarding status: ${status}`);
            } else {
                alert("Failed to send email.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    const handleStatusChange = (user, status) => {
        sendEmail(user.email, status);
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h1>Admin Dashboard</h1>

            {activeUser ? (
                <div className="profile-info">
                    <p><strong>Logged in as:</strong> {activeUser.email}</p>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className="login-section">
                    <a href="/login" className="aws-login-btn">
                        Login to Admin Dashboard
                    </a>
                </div>
            )}

            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setShowUsers(!showUsers)}>
                    {showUsers ? "Hide User Records" : "Show User Records"}
                </button>
                <button
                    onClick={() => {
                        fetchRazorpayOrders();
                        setShowOrders(!showOrders);
                    }}
                >
                    {showOrders ? "Hide Razorpay Orders" : "Show Razorpay Orders"}
                </button>
                <button
                    onClick={() => {
                        fetchRegisteredUsers();
                        setShowRegisteredUsers(!showRegisteredUsers);
                    }}
                >
                    {showRegisteredUsers ? "Hide Registered Users" : "Show Registered Users"}
                </button>
            </div>

            {showRegisteredUsers && (
                <div>
                    <h3>Registered Users</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Designation</th>
                                <th>Phone Number</th>
                                <th>Percentage</th>
                                <th>Address</th>
                                <th>File</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registeredUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.designation}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.percentage}</td>
                                    <td>{user.address}</td>
                                    <td>
                                        {user.file ? (
                                            <a href={`/uploads/${user.file}`} target="_blank" rel="noopener noreferrer">View File</a>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => handleStatusChange(user, "Approval")}>Approval</button>
                                        <button onClick={() => handleStatusChange(user, "Pending")}>Pending</button>
                                        <button onClick={() => handleStatusChange(user, "Rejected")}>Rejected</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showUsers && (
                <table border="1">
                    <thead>
                        <tr>
                            <th>UID</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Status</th>
                            <th>Toggle Status</th>
                            <th>Reset Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.uid}>
                                <td>{user.uid}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleString()}</td>
                                <td>{user.disabled ? "Disabled" : "Enabled"}</td>
                                <td>
                                    <button
                                        onClick={() => handleAccountStatus(user.uid, !user.disabled)}
                                    >
                                        {user.disabled ? "Enable" : "Disable"}
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleResetPassword(user.uid)}>
                                        Reset Password
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showOrders && (
                <div>
                    <h3>Razorpay Orders</h3>
                    <table border="1">
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
                                <tr key={order.order_id}>
                                    <td>{order.order_id}</td>
                                    <td>{(order.amount / 100).toFixed(2)} {order.currency}</td>
                                    <td>{order.status}</td>
                                    <td>{order.email || "N/A"}</td>
                                    <td>{order.payment_details?.method || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
