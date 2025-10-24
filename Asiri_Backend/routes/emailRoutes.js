const express = require('express');
const router = express.Router();
const { sendHealthScoreEmail } = require('../services/emailService');

router.post('/send-health-score', async (req, res) => {
    try {
        const { userEmail, userName, quizResult } = req.body;

        if (!userEmail || !userName || !quizResult) {
            return res.status(400).json({
                error: 'userEmail, userName, and quizResult are required'
            });
        }

        const result = await sendHealthScoreEmail(userEmail, userName, quizResult);

        res.json({
            success: true,
            message: 'Health score email sent successfully',
            result
        });
    } catch (error) {
        console.error('Error sending health score email:', error);
        res.status(500).json({
            error: 'Failed to send health score email'
        });
    }
});

module.exports = router;