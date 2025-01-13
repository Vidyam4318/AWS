import React, { useState } from "react";

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === "admin@example.com" && password === "admin123") {
            onLogin();
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
