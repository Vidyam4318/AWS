import React, { useState } from 'react';
import './styles.css';

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: 'What is the HPC Virtual Lab?',
            answer: 'The HPC Virtual Lab provides academic institutes and enthusiasts with a package of HPC computing resources to train potential future users and students.'
        },
        {
            question: 'How can I request HPC Virtual Lab access?',
            answer: 'You can request HPC Virtual Lab access by submitting the necessary information including scope of teaching, amount of resources, and virtual lab date and duration.'
        },
        {
            question: 'What is the cost for using HPC resources?',
            answer: 'The indicative cost for one week lab resources is 1000/- for 100 students or 2000/- depending on the number of students or the subscription model per semester.'
        },
        {
            question: 'What software tools are available in the HPC Virtual Lab?',
            answer: 'The available software tools include MPI Programming, GPU and HPC, Parallel Programming with Python, Hybrid Programming in HPC, and more.'
        },
        {
            question: 'What courses are enabled in the HPC Virtual Lab?',
            answer: 'Courses include MPI Programming, GPU and HPC, Computational Fluid Dynamics, and other parallel programming courses.'
        },
        {
            question: 'Can I use the HPC Virtual Lab for other purposes?',
            answer: 'No, the HPC Virtual Lab is intended for academic teaching and learning purposes only.'
        },
        {
            question: 'How do I know if the HPC resources are available?',
            answer: 'You can submit your request via the platform, and access will be granted based on resource availability.'
        },
    ];

    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className={`faq-item ${openIndex === index ? 'open' : ''}`}
                >
                    <div className="faq-item-header" onClick={() => toggleFAQ(index)}>
                        {faq.question}
                    </div>
                    <div className="faq-item-content">
                        <p>{faq.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FAQs;
