const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/authentication';

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if the connection fails
    }
};

// Export the connection function
module.exports = connectDB;
