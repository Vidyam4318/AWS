const admin = require('firebase-admin');
// Correct file path with forward slashes
const serviceAccount = require('C:/Users/cdac/aws/server/firebase-admin-sdk.json'); // Absolute path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
