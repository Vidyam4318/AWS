import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useAuth } from './authContext';  // Assuming you have an auth context or Firebase integration
import './OrderPage.css';


const OrderPage = ({ onAddToCart }) => {
    const [participantName, setParticipantName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedNodes, setSelectedNodes] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [labFacility, setLabFacility] = useState('');
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch logged-in user's email from context or Firebase (assuming a context or Firebase setup)
    const { user } = useAuth();
    const userEmail = user ? user.email : 'user@example.com';  // Fallback to a default email if not logged in

    const planDetails = {
        shortTermInitiative: { baseAmount: 1000, duration: 10 },
        longTermInitiative: { baseAmount: 5000, duration: 30 },
    };

    const libraryInfo = {
        OpenMP: 'OpenMP is a parallel programming model for shared memory systems.',
        MPI: 'MPI is a standard for parallel programming in distributed memory systems.',
        CUDA: 'CUDA is a parallel computing platform and programming model for Nvidia GPUs.',
        SYCL: 'SYCL is a C++ programming model for heterogeneous computing systems.'
    };

    useEffect(() => {
        if (selectedPlan) {
            const updatedEndDate = new Date(startDate);
            updatedEndDate.setDate(updatedEndDate.getDate() + planDetails[selectedPlan].duration * quantity);
            setEndDate(updatedEndDate);
        }
    }, [startDate, selectedPlan, quantity]);

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
        setSelectedNodes(null);
    };

    const handleNodeChange = (event) => {
        setSelectedNodes(Number(event.target.value));
    };

    const handleLibrarySelection = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedLibrary(value);
        } else {
            setSelectedLibrary(null);
        }
    };

    const calculateAmount = () => {
        if (selectedPlan && selectedNodes) {
            return planDetails[selectedPlan].baseAmount * selectedNodes * quantity;
        }
        return 0;
    };

    const handleAddToCart = () => {
        if (!participantName.trim() || !selectedPlan || !selectedNodes) {
            alert('Please fill all required fields.');
            return;
        }
        const item = {
            amount: calculateAmount(),
            duration: planDetails[selectedPlan].duration * quantity,
            participantName,
            quantity,
            selectedNodes,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            labFacility,
            selectedLibrary,
            file,
        };
        onAddToCart(item);
    };

    // Create Excel File Function
    const createExcelFile = (uploadedFile) => {
        const data = [[`Uploaded File: ${uploadedFile.name}`]];
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Files');
        XLSX.writeFile(workbook, 'UploadedFiles.xlsx');
    };

    // Handle File Upload and Add to Excel
    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setUploadedFiles((prevFiles) => [...prevFiles, uploadedFile.name]);
            createExcelFile(uploadedFile);
        }
    };

    // Load Razorpay script dynamically
    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!participantName.trim()) {
            alert('Please enter the participant name.');
            return;
        }

        try {
            setLoading(true);
            await loadRazorpayScript();

            const response = await axios.post('http://localhost:5001/api/orders/create', {
                amount: calculateAmount(),
                currency: 'INR',
                receipt: 'order_receipt',
                email: userEmail,  // Send the logged-in user's email to Razorpay
            });

            console.log('Order Response:', response); // Log the response from the backend
            const order = response.data.order;

            const options = {
                key: '',  // Add your Razorpay key here
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                handler: function (response) {
                    console.log('Payment Response:', response); // Log payment response
                    axios
                        .post('http://localhost:5001/api/orders/success', {
                            order_id: order.id,
                            payment_id: response.razorpay_payment_id,
                            participantName,
                        })
                        .then(() => {
                            alert('Payment successful!');
                            navigate('/AutoInstallation');
                        })
                        .catch((error) => {
                            console.error('Error during payment confirmation:', error);
                            alert('Payment failed.');
                        });
                },
                prefill: {
                    name: participantName,
                    email: userEmail,  // Use the logged-in user's email
                    contact: '1234567890',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error during payment:', error);
            alert('Error during payment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="orderpage-container">
            <h1>Compute HPC Lab Resources</h1>
            <div className="left-panel">
                {!selectedPlan ? (
                    <div className="pricing-section">
                        <h2>Pricing Models</h2>
                        <div className="pricing-cards">
                            <div
                                className="pricing-card"
                                onClick={() => handlePlanSelection('shortTermInitiative')}
                            >
                                <h3>Short Term Initiative</h3>
                            </div>
                            <div
                                className="pricing-card"
                                onClick={() => handlePlanSelection('longTermInitiative')}
                            >
                                <h3>Long Term Initiative</h3>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="selected-plan-details">
                        <h2>
                            {selectedPlan === 'shortTermInitiative' ? 'Short Term Initiative' : 'Long Term Initiative'}
                        </h2>
                        <button className="change-plan" onClick={() => setSelectedPlan(null)}>
                            Change Plan
                        </button>
                    </div>
                )}
            </div>

            {selectedPlan && (
                <div className="order-details">
                    <div className="card">
                        <h3>Select Nodes</h3>
                        <div className="node-selection">
                            <label>
                                <input
                                    type="radio"
                                    value={2}
                                    checked={selectedNodes === 2}
                                    onChange={handleNodeChange}
                                />
                                2 Nodes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value={4}
                                    checked={selectedNodes === 4}
                                    onChange={handleNodeChange}
                                />
                                4 Nodes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value={6}
                                    checked={selectedNodes === 6}
                                    onChange={handleNodeChange}
                                />
                                6 Nodes
                            </label>
                        </div>
                    </div>

                    <div className="card">
                        <h3>Participant Details</h3>
                        <input
                            type="text"
                            placeholder="Enter Participant Name"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter lab facility details"
                            value={labFacility}
                            onChange={(e) => setLabFacility(e.target.value)}
                        />
                        <input type="file" onChange={handleFileUpload} />
                    </div>

                    <div className="card">
                        <h3>Select Libraries</h3>
                        <div className="libraries">
                            <label>
                                <input
                                    type="checkbox"
                                    value="OpenMP"
                                    onChange={handleLibrarySelection}
                                />
                                OpenMP
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="MPI"
                                    onChange={handleLibrarySelection}
                                />
                                MPI
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="CUDA"
                                    onChange={handleLibrarySelection}
                                />
                                CUDA
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="SYCL"
                                    onChange={handleLibrarySelection}
                                />
                                SYCL
                            </label>
                        </div>
                        <div className="library-info">
                            {selectedLibrary && (
                                <div className="info-item">
                                    <h4>{selectedLibrary}</h4>
                                    <p>{libraryInfo[selectedLibrary]}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card summary">
                        <p>Amount: ₹{calculateAmount()}</p>
                        <p>Duration: {selectedPlan ? planDetails[selectedPlan].duration * quantity : 0} days</p>
                        <p>Start Date: {startDate.toISOString().split('T')[0]}</p>
                        <p>End Date: {endDate.toISOString().split('T')[0]}</p>
                    </div>

                    <button
                        className="pay-button"
                        onClick={handlePayment}
                        disabled={loading || !participantName || !selectedNodes}
                    >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
