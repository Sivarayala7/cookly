import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addComment,
  getComments,
  deleteComment            // <-- only these three now
} from '../controllers/commentController.js';

const router = express.Router({ mergeParams: true });

router
  .route('/:recipeId/comments')
  .post(protect, addComment)   // create comment / reply
  .get(getComments);           // list threaded comments

// DELETE specific comment (or reply)
router.delete(
  '/:recipeId/comments/:commentId',
  protect,
  deleteComment
);

export default router;
