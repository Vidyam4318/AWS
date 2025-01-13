const mongoose = require("mongoose");

// Define the schema for registering a user
const registerUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    educationalDetails: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    file: {
        type: String, // This will store the filename of the uploaded file
        required: true
    }
}, { timestamps: true });

// Create a model from the schema
const RegisterUserModel = mongoose.model("RegisterUsers", registerUserSchema);

module.exports = RegisterUserModel;
