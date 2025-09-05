import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { addComment, createPost, listPosts } from '../controllers/postsController';

const router = Router();

// Create a new blog post with title, content, and author (requires auth)
router.post('/', authenticateToken, asyncHandler(createPost));

// Add a comment to a post with comment text and commenter (requires auth)
router.post('/:id/comments', authenticateToken, asyncHandler(addComment));

// Get all posts with comment count for each, with optional search/filter/pagination (public)
router.get('/', optionalAuth, asyncHandler(listPosts));

export default router;


