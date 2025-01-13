const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: { type: String, default: null },
    photoURL: { type: String, default: null },
    creationTime: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
