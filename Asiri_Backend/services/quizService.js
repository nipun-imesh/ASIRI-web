const { db } = require('../config/firebase');
const { collection, addDoc, getDocs, query, orderBy } = require('firebase/firestore');

const submitQuiz = async (quizResult) => {
    try {
        const docRef = await addDoc(collection(db, 'quizResults'), {
            ...quizResult,
            submittedAt: new Date()
        });

        console.log('Quiz results saved with ID:', docRef.id);

        return {
            id: docRef.id,
            ...quizResult
        };
    } catch (error) {
        console.error('Error submitting quiz:', error);
        throw error;
    }
};

const getQuizResults = async () => {
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

        return results;
    } catch (error) {
        console.error('Error getting quiz results:', error);
        throw error;
    }
};

module.exports = { submitQuiz, getQuizResults };