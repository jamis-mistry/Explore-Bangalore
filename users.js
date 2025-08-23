const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const upload = multer({ dest: './uploads/' });

const transporter = nodemailer.createTransport({
    service: 'gmail', // Update to host/port if not Gmail
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register User
router.post('/register', upload.single('profile_picture'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!req.file) throw new Error('Profile picture is required');
        const profile_picture = req.file.path;

        console.log('Register User:', { name, email, phone, profile_picture });

        const [result] = await req.db.execute(
            'INSERT INTO users (name, email, phone, profile_picture) VALUES (?, ?, ?, ?)',
            [name, email, phone, profile_picture]
        );

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Successful',
            html: `<h1>Welcome, ${name}!</h1><p>Your registration for the Tournament Creation App is successful.</p>`
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get All Users
router.get('/', async (req, res) => {
    try {
        const [rows] = await req.db.execute('SELECT * FROM users');
        console.log('Fetched Users:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Get Users Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update User
router.put('/:id', upload.single('profile_picture'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const profile_picture = req.file ? req.file.path : req.body.profile_picture;

        console.log('Update User:', { id: req.params.id, name, email, phone, profile_picture });

        await req.db.execute(
            'UPDATE users SET name = ?, email = ?, phone = ?, profile_picture = ? WHERE id = ?',
            [name, email, phone, profile_picture, req.params.id]
        );
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Update User Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        console.log('Delete User:', { id: req.params.id });
        await req.db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete User Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = (db) => {
    router.db = db;
    return router;
};