import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipe,
  likeRecipe,
  bookmarkRecipe,
  getBookmarked,
  getRecipeRating,
  rateRecipe,
} from '../controllers/recipeController.js';

import commentRoutes from './commentRoutes.js';

const router = express.Router();

/* ─────────── PUBLIC ─────────── */
router.get('/',               getRecipes);          // list
router.get('/bookmarked',     protect, getBookmarked);
router.get('/:id',            getRecipeById);       // single recipe
router.get('/:id/rate',       getRecipeRating);     // <-- NEW: fetch avg/count

/* ────────── PROTECTED ───────── */
router.post('/',              protect, createRecipe);
router.post('/:id/like',      protect, likeRecipe);
router.post('/:id/bookmark',  protect, bookmarkRecipe);
router.post('/:id/rate',      protect, rateRecipe); // ← save/update rating
router.delete('/:id',         protect, deleteRecipe);

/* threaded comments live under the same prefix */
router.use('/', commentRoutes);

export default router;
