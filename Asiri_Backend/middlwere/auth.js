// auth.js
const cors = require('cors');
const express = require('express');

const configureAuth = (app) => {
    // CORS middleware
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));

    // JSON parsing middleware
    app.use(express.json());

    console.log('✅ Middleware configured successfully');
};

module.exports = { configureAuth };