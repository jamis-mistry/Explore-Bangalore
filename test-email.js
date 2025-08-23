const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'test@example.com', // Replace with your personal email
    subject: 'Test Email',
    html: '<h1>Test</h1><p>This is a test email.</p>'
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('Error:', err);
    else console.log('Email sent:', info.response);
});