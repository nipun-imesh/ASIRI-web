const express = require('express');
const router = express.Router();
const { submitQuiz, getQuizResults } = require('../services/quizService');
const { sendHealthScoreEmail } = require('../services/emailService');

// Submit quiz result (updated to handle email)
router.post('/submit', async (req, res) => {
    try {
        const { name, totalScore, scores, percentage, email } = req.body;

        if (!name || totalScore === undefined || !scores) {
            return res.status(400).json({
                error: 'Name, totalScore, and scores are required'
            });
        }

        const quizResult = {
            name,
            totalScore,
            scores,
            percentage: percentage || Math.round((totalScore / 400) * 100),
            submittedAt: new Date()
        };

        // Save to database
        const result = await submitQuiz(quizResult);

        // Send email if email is provided
        let emailSent = false;
        if (email) {
            try {
                await sendHealthScoreEmail(email, name, quizResult);
                emailSent = true;
                console.log(`Health score email sent to: ${email}`);
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Continue even if email fails
            }
        }

        res.json({
            id: result.id,
            message: 'Quiz submitted successfully',
            emailSent: emailSent
        });

    } catch (error) {
        console.error('Quiz submission error:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// Get all quiz results
router.get('/results', async (req, res) => {
    try {
        const results = await getQuizResults();
        res.json(results);
    } catch (error) {
        console.error('Get quiz results error:', error);
        res.status(500).json({ error: 'Failed to fetch quiz results' });
    }
});

// Get quiz questions
router.get('/questions', async (req, res) => {
    try {
        // You can move your questions here if you want to manage them server-side
        const questions = [
            {
                title: 'Q1',
                question: 'How many liters of water do you drink daily?',
                options: [
                    { label: 'Less than 500 ml', score: 0 },
                    { label: '1 liter', score: 50 },
                    { label: '2 liters', score: 100 },
                    { label: 'More than 3 liters', score: 25 },
                ]
            },
            {
                title: 'Q2',
                question: 'Days with 10,000+ steps this week?',
                options: [
                    { label: '0 days', score: 0 },
                    { label: '2 days', score: 50 },
                    { label: '3 days', score: 75 },
                    { label: '5+ days', score: 100 },
                ]
            },
            {
                title: 'Q3',
                question: 'Days eating out this week?',
                subtext: '(restaurant, takeout, packaged meals)',
                options: [
                    { label: '1 day', score: 100 },
                    { label: '3 days', score: 75 },
                    { label: '5 days', score: 50 },
                    { label: '7 days', score: 0 },
                ]
            },
            {
                title: 'Q4',
                question: 'Your routine 1 hour before bedtime?',
                options: [
                    { label: 'Reading/Relaxation', score: 100 },
                    { label: 'Family time (no screens)', score: 100 },
                    { label: 'Watching TV/mobile', score: 0 },
                ]
            }
        ];

        res.json(questions);
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

module.exports = router;