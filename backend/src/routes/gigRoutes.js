import express from 'express';
import { createGig, applyToGig } from '../controllers/gigController.js';
import { verifyFirebaseToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// @route   POST /api/v1/gigs
// @desc    Create a new gig
// @access  Private (Business only)
router.post('/', verifyFirebaseToken, requireRole('business'), createGig);

// @route   POST /api/v1/gigs/:gigId/apply
// @desc    Editor applies to a specific gig
// @access  Private (Editor only)
router.post('/:gigId/apply', verifyFirebaseToken, requireRole('editor'), applyToGig);

export default router;