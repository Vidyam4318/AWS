import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate

import './RegisterForm.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        designation: '',
        phoneNumber: '',
        email: '', // Added email field
        educationalDetails: '',
        percentage: '',
        address: '',
        file: null,
    });

    const navigate = useNavigate();  // Initializing navigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Determine the status based on the percentage
        let status = '';

        const percentage = parseFloat(formData.percentage);

        if (percentage >= 75) {
            status = 'Approval';
        } else if (percentage >= 50 && percentage < 75) {
            status = 'Pending';
        } else {
            status = 'Rejected';
        }

        // Create the FormData object and append the status
        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key]);
        });
        formDataObj.append('status', status); // Append the status to FormData

        try {
            await axios.post('http://localhost:5000/register', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("User registered successfully!");
            navigate('/login');  // Navigating to the login page after successful registration
        } catch (error) {
            alert("Error registering user");
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
            />
            <input
                type="email"  // Email input type for validation
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
            <textarea
                placeholder="Educational Details"
                value={formData.educationalDetails}
                onChange={(e) => setFormData({ ...formData, educationalDetails: e.target.value })}
                required
            ></textarea>
            <input
                type="number"
                placeholder="Percentage"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                required
            />
            <textarea
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
            ></textarea>
            <input type="file" onChange={handleFileChange} required />
            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterForm;
