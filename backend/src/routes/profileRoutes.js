import express from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/profileController.js';
import { verifyFirebaseToken } from '../middlewares/auth.js';

const router = express.Router();

// All profile routes require authentication
router.use(verifyFirebaseToken);

router.route('/me')
  .get(getMyProfile)
  .put(updateMyProfile);

export default router;