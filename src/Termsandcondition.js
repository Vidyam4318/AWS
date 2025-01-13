import React from 'react';
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Termsandcondition.css';

const TermsAndConditions = () => {
    return (
        <div className="terms-container">
            <div className="terms-header">
                <h1>Terms and Conditions</h1>
            </div>

            <div className="terms-content">
                <h2 className="section-title">1. General Usage Guidelines</h2>
                <p>
                    The HPC Virtual Lab is intended for academic and research purposes only. All users must ensure the proper use of resources, in line with academic teaching and learning.
                </p>

                <h2 className="section-title">2. Usage Purpose</h2>
                <p>
                    The HPC resources provided are primarily for teaching parallel programming, AI, and other computational science courses. Any commercial use of these resources is strictly prohibited.
                </p>

                <h2 className="section-title">3. Access Rights</h2>
                <p>
                    Access to the HPC Virtual Lab is granted on a temporary basis and is subject to availability. Requests will be processed in the order they are received, and access may be denied based on resource constraints.
                </p>

                <h2 className="section-title">4. Reservation Process</h2>
                <p>
                    To reserve the HPC Virtual Lab resources, users must submit a request containing details such as the scope of teaching, required resources, lab date, and course information. All required fields must be filled in the submission form.
                </p>

                <h2 className="section-title">5. Pricing and Billing</h2>
                <p>
                    Pricing is based on the duration of the lab session, the number of students, and the computational resources required. Payment is due upon confirmation of the reservation.
                </p>

                <h2 className="section-title">6. Resource Availability</h2>
                <p>
                    HPC resources are available based on the availability of the Param Supercomputing system. Requests will be processed based on available resources at the time of submission.
                </p>

                <h2 className="section-title">7. Liability</h2>
                <p>
                    The HPC Virtual Lab is provided "as is." The platform is not liable for any damages or losses arising from the use of the computing resources, including data loss or system failures.
                </p>

                <h2 className="section-title">8. Compliance</h2>
                <p>
                    Users must comply with all local laws and regulations, as well as the specific terms of use outlined here. Violations of these terms may result in suspension or revocation of access.
                </p>
            </div>

            {/* Footer Section with Social Media Icons */}
            <footer className="footer">
                <div className="footer-section">
                    <h4>Learn About HPC</h4>
                    <ul>
                        <li><a href="#what-is-hpc">What is HPC?</a></li>
                        <li><a href="#hpc-in-education">HPC in Education</a></li>
                        <li><a href="#hpc-resources">HPC Resources</a></li>
                        <li><a href="#hpc-terms">HPC Terms</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Resources for HPC</h4>
                    <ul>
                        <li><a href="#hpc-docs">HPC Documentation</a></li>
                        <li><a href="#hpc-tutorials">HPC Tutorials</a></li>
                        <li><a href="#hpc-library">HPC Solution Library</a></li>
                        <li><a href="#hpc-faq">HPC FAQs</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Developers on HPC</h4>
                    <ul>
                        <li><a href="#hpc-dev-center">Developer Center</a></li>
                        <li><a href="#hpc-sdk-tools">SDKs & Tools</a></li>
                        <li><a href="#hpc-python">Python on HPC</a></li>
                        <li><a href="#hpc-parallel">Parallel Programming</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Help</h4>
                    <ul>
                        <li><a href="#hpc-contact">Contact Us</a></li>
                        <li><a href="#hpc-support">Get Support</a></li>
                        <li><a href="#hpc-legal">Legal Information</a></li>
                        <li><a href="#hpc-careers">HPC Careers</a></li>
                    </ul>
                </div>

                {/* Social Media Icons */}
                <div className="social-media">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <FaYoutube />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default TermsAndConditions;
