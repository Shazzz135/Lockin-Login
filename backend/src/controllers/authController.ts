import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signup = async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, email, password, count } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstname, lastname, email, password: hashedPassword, count });
        await newUser.save();
        const token = jwt.sign({ email, firstname, lastname, count }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: 'User created successfully', token });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        res.status(500).json({ error: err.message || 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
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
        const token = jwt.sign({ email: user.email, firstname: user.firstname, lastname: user.lastname, count: user.count }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'Login successful', token, user: { firstname: user.firstname, lastname: user.lastname, email: user.email, count: user.count } });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Server error' });
    }
};
