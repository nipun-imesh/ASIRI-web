// controllers/quizController.js
const { db } = require('../config/firebase');
const { collection, addDoc, getDocs, query, where, orderBy } = require('firebase/firestore');
const { sendHealthScoreEmail } = require('../services/emailService');

const submitQuiz = async (req, res) => {
    try {
        const { name, totalScore, scores, percentage, email } = req.body;

        // If email is directly provided in the request, use it
        let userEmail = email;

        // If email is not provided, try to find it from users collection
        if (!userEmail) {
            try {
                // Extract name without title
                const userName = name.replace(/^(Mr\.|Mrs\.|Miss\.|Ms\.)\s+/i, '');

                const usersQuery = query(
                    collection(db, 'users'),
                    where('name', '==', userName)
                );

                const usersSnapshot = await getDocs(usersQuery);

                if (!usersSnapshot.empty) {
                    userEmail = usersSnapshot.docs[0].data().email;
                    console.log('📧 Found user email:', userEmail);
                }
            } catch (lookupError) {
                console.log('ℹ️ Could not find user email, continuing without email...');
            }
        }

        const quizResult = {
            name,
            totalScore,
            scores,
            percentage,
            userEmail: userEmail || 'Not provided',
            submittedAt: new Date()
        };

        // Save to Firestore
        const docRef = await addDoc(collection(db, 'quizResults'), quizResult);

        // Send email if email is available
        let emailSent = false;
        if (userEmail) {
            try {
                await sendHealthScoreEmail(userEmail, name, quizResult);
                emailSent = true;
                console.log('✅ Health score email sent to:', userEmail);
            } catch (emailError) {
                console.error('❌ Failed to send email:', emailError);
                // Continue even if email fails
            }
        }

        res.status(201).json({
            id: docRef.id,
            message: 'Quiz submitted successfully',
            emailSent: emailSent,
            emailAddress: userEmail || 'No email provided'
        });

    } catch (error) {
        console.error('Quiz submission error:', error);
        res.status(500).json({ error: 'Quiz submission failed: ' + error.message });
    }
};

const getQuizResults = async (req, res) => {
    try {
        const q = query(collection(db, 'quizResults'), orderBy('submittedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const results = [];
        querySnapshot.forEach((doc) => {
            results.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json(results);
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
};

module.exports = { submitQuiz, getQuizResults };