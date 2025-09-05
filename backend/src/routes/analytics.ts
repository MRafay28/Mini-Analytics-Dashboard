import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { postsPerDay, topAuthors, topCommented } from '../controllers/analyticsController';

const router = Router();

// Authors ranked by number of posts
router.get('/top-authors', asyncHandler(topAuthors));

// Top 5 most commented posts
router.get('/top-commented', asyncHandler(topCommented));

// Number of posts created per day for the last 7 days
router.get('/posts-per-day', asyncHandler(postsPerDay));

export default router;


