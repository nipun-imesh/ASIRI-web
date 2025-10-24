// controllers/userController.js
const { db } = require('../config/firebase');
const { collection, addDoc } = require('firebase/firestore'); // Import Firestore functions

// controllers/userController.js
const registerUser = async (req, res) => {
    try {
        const { title, name, phone, email } = req.body;

        const userData = {
            title,
            name,
            phone,
            email, // Email එක save කරන්න
            createdAt: new Date()
        };

        const docRef = await addDoc(collection(db, 'users'), userData);

        res.status(201).json({
            id: docRef.id,
            message: 'User registered successfully',
            user: userData
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};
module.exports = { registerUser };