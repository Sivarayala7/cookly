import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getMe,
  getMyRecipes,
  getProfile,
  updateMe,
  changePassword,
  getUserRecipes,
} from '../controllers/userController.js';

const router = express.Router();

// ── "Me" routes (static) ────────────────────────────────────────────────
// 1) GET  /api/users/me          → returns your own profile
// 2) PUT  /api/users/me          → update your own profile
// 3) PUT  /api/users/me/password → change password
// 4) GET  /api/users/me/recipes  → list your own recipes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/me/recipes', protect, getMyRecipes);

// ── Public user routes (dynamic) ───────────────────────────────────────
// 5) GET  /api/users/:id/recipes → list _that_ user's recipes
// 6) GET  /api/users/:id         → get _that_ user's public profile
router.get('/:id/recipes', getUserRecipes);
router.get('/:id', getProfile);

export default router;