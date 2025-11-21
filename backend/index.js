const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

app.post('/api/users', async (req, res) => {
    try {
        const {firstname, lastname, email, password} = req.body;
        const newUser = new User({ firstname, lastname, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));