import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken } from '../middleware/auth';
import { getProfile, login, signup } from '../controllers/authController';

const router = Router();

// Public routes
router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));

// Protected routes
router.get('/profile', authenticateToken, asyncHandler(getProfile));

export default router;
