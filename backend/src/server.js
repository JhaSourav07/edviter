import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { verifyFirebaseToken } from './middlewares/auth.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors());         
app.use(helmet());       
app.use(morgan('dev'));  
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/gigs', gigRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/jobs/:jobId/deliveries', deliveryRoutes);

// Public Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Protected Route Example
app.get('/api/v1/health/protected', verifyFirebaseToken, (req, res) => {
  res.status(200).json({ 
    status: 'You have accessed a protected route!',
    firebaseUid: req.user.uid,
    email: req.user.email
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});