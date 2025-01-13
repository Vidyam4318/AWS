const express = require('express');
const admin = require('./firebaseAdmin');
const router = express.Router();

router.use(express.json());

// List all users
router.get('/users', async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers(1000); // Fetch up to 1000 users
        res.status(200).json(listUsersResult.users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new user
router.post('/users', async (req, res) => {
    const { email, password, displayName } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
        });
        res.status(201).json(userRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an existing user
router.put('/users/:uid', async (req, res) => {
    const { uid } = req.params;
    const updates = req.body;
    try {
        const userRecord = await admin.auth().updateUser(uid, updates);
        res.status(200).json(userRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/users/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        await admin.auth().deleteUser(uid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
