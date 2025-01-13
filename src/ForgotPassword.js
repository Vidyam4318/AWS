import React, { useState } from 'react';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleResetPassword = (e) => {
        e.preventDefault();
        // Handle password reset logic (send reset link to email)
        console.log('Password reset for:', email);
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <h1>Forgot Password</h1>
                <form onSubmit={handleResetPassword}>
                    <div className="input-group">
                        <label>Enter your email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <button type="submit" className="reset-btn">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
