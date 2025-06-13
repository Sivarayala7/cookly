import express from 'express';
import { login, register } from '../controllers/authController.js';
const router = express.Router();
router.post('/register', register);  // signup
router.post('/login', login);        // signin
export default router;