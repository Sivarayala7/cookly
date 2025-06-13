import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, bio, location,avatar } = req.body;
  if (await User.findOne({ email })) throw new Error('User already exists');
  const user = await User.create({ name, email, password, bio, location,avatar:avatar||'/avatars/avatar1.png' });
  res.status(201).json({
    token: generateToken(user._id),
    user: { ...user.toObject(), password: undefined },
  });
});

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) throw new Error('Invalid credentials');
  res.json({ token: generateToken(user._id), user: { ...user.toObject(), password: undefined } });
});