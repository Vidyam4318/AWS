import React from 'react';
import './Categories.css'; // Add styles for the box layout

const Categories = () => {
    return (
        <div className="categories-page">
            <h2>Choose a Category</h2>
            <div className="category-container">
                <div className="category-box">
                    <h3>Short Term</h3>
                    <p>
                        Short-term access allows users to book computing resources for a limited period, perfect for small projects or testing scenarios. These bookings are typically for durations of a few hours to a few days.
                    </p>
                </div>
                <div className="category-box">
                    <h3>Long Term</h3>
                    <p>
                        Long-term access provides extended usage of computing resources, ideal for ongoing research, large-scale development, or enterprise-level projects. Bookings can span weeks to months.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Categories;
