import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

const ReportChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Register Chart.js components
        Chart.register(...registerables);

        // Data for the chart
        const data = {
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
                {
                    label: "Monthly Reports",
                    data: [10, 20, 30, 40, 50, 60],
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };

        // Options for the chart
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "category",
                },
                y: {
                    beginAtZero: true,
                },
            },
        };

        // Destroy the previous chart instance if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create a new chart instance
        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
            type: "bar",
            data,
            options,
        });

        // Cleanup function to destroy the chart
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return <canvas ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default ReportChart;
