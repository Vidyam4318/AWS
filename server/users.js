// backend/models/Users.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    uid: String,
    email: String,
    displayName: String,
    photoURL: String,
    emailVerified: Boolean,
    createdAt: Date,
});

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
