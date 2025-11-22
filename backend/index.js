/* Purpose of this file is to set up the Express server and define API routes */


const express = require('express');
const connectDB = require('./db');
const User = require('./users');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { count } = require('console');
require('dotenv').config();

const app = express();

// Enable CORS for all origins (including Vite)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

app.post('/api/signup', async (req, res) => {
    try {
        const {firstname, lastname, email, password, count} = req.body;
        const newUser = new User({ firstname, lastname, email, password, count, createdAt: new Date() });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user: { firstname: user.firstname, lastname: user.lastname, email: user.email, count: user.count } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));