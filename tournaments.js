const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Create Tournament
router.post('/', async (req, res) => {
    try {
        const { user_id, name } = req.body;
        console.log('Create Tournament:', { user_id, name });

        await req.db.execute(
            'INSERT INTO tournaments (user_id, name) VALUES (?, ?)',
            [user_id, name]
        );
        res.status(201).json({ message: 'Tournament created successfully' });
    } catch (err) {
        console.error('Create Tournament Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get All Tournaments
router.get('/', async (req, res) => {
    try {
        const [rows] = await req.db.execute('SELECT * FROM tournaments');
        console.log('Fetched Tournaments:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Get Tournaments Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = (db) => {
    router.db = db;
    return router;
};