import express from 'express';
// I put all 3 controller functions in gigController in the previous step, 
// so we import acceptApplication from there.
import { acceptApplication } from '../controllers/gigController.js'; 
import { verifyFirebaseToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// @route   POST /api/v1/applications/:applicationId/accept
// @desc    Business accepts an application and creates a Job
// @access  Private (Business only)
router.post('/:applicationId/accept', verifyFirebaseToken, requireRole('business'), acceptApplication);

export default router;