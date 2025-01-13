// saveFirebaseUserToDB.js
const mongoose = require('mongoose');

// Define the schema for users
const userSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    email: { type: String, required: true },
    displayName: String,
    photoURL: String,
    creationTime: String,
});

// Create the model for users
const User = mongoose.model('User', userSchema);

// Function to save Firebase user to MongoDB
async function saveFirebaseUserToDB(user) {
    try {
        const newUser = new User(user);
        await newUser.save();  // Save the user to the database
        console.log('User saved to DB:', user);
    } catch (error) {
        console.error('Error saving user to DB:', error);
    }
}

module.exports = saveFirebaseUserToDB;
