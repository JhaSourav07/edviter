import express from 'express';
import { generateUploadUrl } from '../controllers/deliveryController.js';
import { verifyFirebaseToken, requireRole } from '../middlewares/auth.js';

// We use mergeParams so we can access :jobId from the parent router if needed
const router = express.Router({ mergeParams: true }); 

// @route   POST /api/v1/jobs/:jobId/deliveries/upload-url
router.post('/upload-url', verifyFirebaseToken, requireRole('editor'), generateUploadUrl);

export default router;