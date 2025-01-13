import React from 'react';
import './AutoInstallationPage.css';
import { useNavigate } from 'react-router-dom';

const AutoInstallationPage = () => {
    const navigate = useNavigate();

    // Handle the download link click event
    const handleDownload = (url) => {
        window.location.href = url; // Redirects to the download URL
    };

    // Navigate to RegisterForm when Finish is clicked
    const handleFinish = () => {
        navigate('/RegisterForm');
    };

    return (
        <div className="auto-installation-container">
            <div className="installation-header">
                <h1>Python Releases for Windows</h1>
                <p>Latest Python 3 Release - <strong>Python 3.13.1</strong></p>
                <p><em>Stable Releases</em> - Python 3.12.8 - Dec. 3, 2024</p>
                <p><strong>Note:</strong> Python 3.12.8 cannot be used on Windows 7 or earlier.</p>
            </div>

            <div className="download-options">
                <div className="download-version">
                    <h2>Latest Python 3 Release</h2>
                    <div className="download-card">
                        <h3>Python 3.13.1</h3>
                        <button
                            onClick={() => handleDownload('https://www.python.org/ftp/python/3.13.1/python-3.13.1-amd64.exe')}
                            className="download-btn"
                        >
                            Download Windows Installer (64-bit)
                        </button>
                        <button
                            onClick={() => handleDownload('https://www.python.org/ftp/python/3.13.1/python-3.13.1.exe')}
                            className="download-btn"
                        >
                            Download Windows Installer (32-bit)
                        </button>
                        <button
                            onClick={() => handleDownload('https://www.python.org/ftp/python/3.13.1/python-3.13.1-arm64.exe')}
                            className="download-btn"
                        >
                            Download Windows Installer (ARM64)
                        </button>
                    </div>
                </div>

                <div className="download-version">
                    <h2>Stable Releases</h2>
                    <div className="download-card">
                        <h3>Python 3.12.8</h3>
                        <button
                            onClick={() => handleDownload('https://www.python.org/ftp/python/3.12.8/python-3.12.8-amd64.exe')}
                            className="download-btn"
                        >
                            Download Windows Installer (64-bit)
                        </button>
                        <button
                            onClick={() => handleDownload('https://www.python.org/ftp/python/3.12.8/python-3.12.8.exe')}
                            className="download-btn"
                        >
                            Download Windows Installer (32-bit)
                        </button>
                        <button
                            onClick={() => handleDownload('https://www.python.org/ftp/python/3.12.8/python-3.12.8-arm64.exe')}
                            className="download-btn"
                        >
                            Download Windows Installer (ARM64)
                        </button>
                    </div>
                </div>
            </div>

            <div className="footer">
                <button className="finish-btn" onClick={handleFinish}>Finish and Proceed</button>
            </div>
        </div>
    );
};

export default AutoInstallationPage;
