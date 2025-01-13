import React from 'react';
import './Features.css';  // Make sure to include corresponding CSS for styling.

const Features = () => {
    return (
        <div className="features-container">
            <h2 className="features-title">HPC Virtual Lab Features</h2>
            <div className="features-grid">
                <div className="feature-card">
                    <h3>Academic Resource Access</h3>
                    <p>
                        Provide academic institutes and enthusiasts access to powerful HPC resources for training, parallel programming, and AI.
                    </p>
                </div>
                <div className="feature-card">
                    <h3>Parallel Programming Support</h3>
                    <p>
                        Support for teaching and learning parallel programming using advanced HPC systems for a hands-on experience.
                    </p>
                </div>
                <div className="feature-card">
                    <h3>AI & HPC Training</h3>
                    <p>
                        Promote the development of skills in AI and HPC through access to cutting-edge computational resources.
                    </p>
                </div>
                <div className="feature-card">
                    <h3>Param Supercomputers Integration</h3>
                    <p>
                        Utilize resources from Param Supercomputers for a robust, high-performance computing environment ideal for academic use.
                    </p>
                </div>
                <div className="feature-card">
                    <h3>Hands-on Learning Environment</h3>
                    <p>
                        Provide students with a practical, real-world environment for learning and experimenting with parallel computing.
                    </p>
                </div>
                <div className="feature-card">
                    <h3>Cloud-Based Virtual Lab</h3>
                    <p>
                        Seamless access to the virtual HPC lab via the cloud for easy resource allocation and management without the need for local infrastructure.
                    </p>
                </div>
                <div className="feature-card">
                    <h3>Course-Specific HPC Resources</h3>
                    <p>
                        Customize resources for specific courses, such as MPI programming, GPU, HPC, and AI, enhancing the learning experience.
                    </p>
                </div>
                <div className="feature-card">
                    <h3>Easy Resource Reservation</h3>
                    <p>
                        Simplify the process of reserving HPC resources for academic institutes to support teaching parallel programming and computational courses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Features;
