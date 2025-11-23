import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/tokenUtils';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token required.' });
        
        // Verify refresh token
        const decoded: any = verifyToken(refreshToken);
        if (!decoded || !decoded.email) return res.status(403).json({ message: 'Invalid refresh token.' });
        
        // Check if refresh token exists in database
        const user = await User.findOne({ email: decoded.email, refreshToken });
        if (!user) return res.status(403).json({ message: 'Refresh token not found.' });
        
        // Issue new access token with fresh data from DB
        const accessToken = jwt.sign({ email: user.email, firstname: user.firstname, lastname: user.lastname, count: user.count }, JWT_SECRET, { expiresIn: '15m' });
        
        res.status(200).json({ accessToken });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Server error' });
    }
};

export const updateCount = async (req: Request, res: Response) => {
    try {
        const { email, count } = req.body;
        
        // Validate inputs
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }
        if (typeof count !== 'number') {
            return res.status(400).json({ message: 'Count must be a number.' });
        }
        
        // Update the count field in the database
        const user = await User.findOneAndUpdate(
            { email },
            { $set: { count } },
            { new: true, fields: { count: 1, email: 1, firstname: 1, lastname: 1 } }
        );
        
        if (!user) return res.status(404).json({ message: 'User not found.' });
        return res.status(200).json({ message: 'Count updated.', count: user.count });
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, email, password, count } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstname, lastname, email, password: hashedPassword, count });
        await newUser.save();
        
        // Create access token (short-lived)
        const accessToken = jwt.sign({ email, firstname, lastname, count }, JWT_SECRET, { expiresIn: '15m' });
        
        // Create refresh token (long-lived)
        const refreshToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });
        
        // Store refresh token in database
        newUser.refreshToken = refreshToken;
        await newUser.save();
        
        res.status(201).json({ message: 'User created successfully', accessToken, refreshToken });
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
        
        // Always use fresh data from DB for token
        const freshUser = await User.findOne({ email });
        if (!freshUser) {
            return res.status(404).json({ message: 'User not found after login.' });
        }
        
        // Create access token (short-lived)
        const accessToken = jwt.sign({ email: freshUser.email, firstname: freshUser.firstname, lastname: freshUser.lastname, count: freshUser.count }, JWT_SECRET, { expiresIn: '15m' });
        
        // Create refresh token (long-lived)
        const refreshToken = jwt.sign({ email: freshUser.email }, JWT_SECRET, { expiresIn: '7d' });
        
        // Store refresh token in database
        freshUser.refreshToken = refreshToken;
        await freshUser.save();
        
        res.status(200).json({ message: 'Login successful', accessToken, refreshToken, user: { firstname: freshUser.firstname, lastname: freshUser.lastname, email: freshUser.email, count: freshUser.count } });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Server error' });
    }
};
