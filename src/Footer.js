import React from 'react';
import './Features.css';

const features = [
    { title: 'HPC Resource Reservation', description: 'Easily reserve HPC computing resources for teaching parallel programming and AI courses.' },
    { title: 'Supercomputing Power for Education', description: 'Access Param Supercomputing resources to provide a high-performance computing environment for students.' },
    { title: 'AI and Parallel Programming Training', description: 'Offer academic institutions the necessary resources to train students in AI, parallel programming, and high-performance computing.' },
];

const Features = () => (
    <section className="features" id="features">
        <h2>HPC Virtual Lab Features</h2>
        <div className="features-grid">
            {features.map((feature, index) => (
                <div key={index} className="feature-card">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                </div>
            ))}
        </div>
    </section>
);

export default Features;