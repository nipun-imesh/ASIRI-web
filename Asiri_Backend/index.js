// index.js
const express = require('express');
require('dotenv').config();
const { configureAuth } = require('./middlwere/auth');  // Fixed: middleware/auth.js path
const cors = require('cors');

const app = express();

// Middleware configure
configureAuth(app);

// Routes (match frontend apiClient.ts)
app.use('/api/users', require('./routes/userRoutes'));  // Fixed: /api/users to match frontend "/users/register"
app.use('/api/quiz', require('./routes/quizRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Asiri Health API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
    console.log(`🌐 CORS enabled for: http://localhost:5173`);
});