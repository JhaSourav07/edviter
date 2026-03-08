import express from 'express';
import { syncUser } from '../controllers/authController.js';
import { verifyFirebaseToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/v1/auth/sync
// This route is protected. It requires a valid Firebase token in the headers.
router.post('/sync', verifyFirebaseToken, syncUser);

export default router;