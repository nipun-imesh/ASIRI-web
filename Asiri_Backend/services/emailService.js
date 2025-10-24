const nodemailer = require('nodemailer');

console.log('📧 Email configuration check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set ✅' : 'Not Set ❌');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set ✅' : 'Not Set ❌');

// Create transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email configuration
const testEmailConfig = async () => {
    try {
        console.log('🔧 Testing email configuration...');

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email credentials are missing in environment variables');
        }

        await transporter.verify();
        console.log('✅ Email transporter is ready');
        return transporter;
    } catch (error) {
        console.error('❌ Email configuration error:', error.message);
        throw error;
    }
};

const sendHealthScoreEmail = async (userEmail, userName, quizResult) => {
    try {
        console.log(`📨 Attempting to send email to: ${userEmail}`);

        const transporter = await testEmailConfig();

        const { totalScore, percentage, scores } = quizResult;

        const getHealthMessage = () => {
            if (percentage >= 80) return 'Excellent! Keep it up! 🌟';
            if (percentage >= 60) return 'Good job! 👍';
            if (percentage >= 40) return 'Fair 💪';
            return 'Needs work 🎯';
        };

        const healthMessage = getHealthMessage();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Your Health Score Results - ${percentage}%`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1591cb, #57bef6); padding: 20px; color: white; text-align: center;">
                    <h1>Health Score Results</h1>
                    <p>Hello ${userName}, here are your health assessment results</p>
                </div>
                
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; font-weight: bold; color: #07294b;">${percentage}%</div>
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3>${healthMessage}</h3>
                        <p>Total Score: ${totalScore}/400</p>
                    </div>
                </div>

                <div style="margin: 20px 0;">
                    <h3>Score Breakdown:</h3>
                    ${scores.map((score, index) => `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Question ${index + 1}:</span>
                            <span><strong>${score} points</strong></span>
                        </div>
                    `).join('')}
                </div>

                <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                    <p>Thank you for using Asiri Health App</p>
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
            `
        };

        console.log('✉️ Sending email...');
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully to:', userEmail);
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};

module.exports = { sendHealthScoreEmail };