import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', authRoutes);

export default app;
