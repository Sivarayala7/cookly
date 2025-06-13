import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

/** 1) GET /api/users/me */
export const getMe = async (req, res, next) => {
  try {
    const me = await User.findById(req.user._id)
      .select('-password');
    if (!me) return res.status(404).json({ message: 'Not found' });
    res.json(me);
  } catch (err) {
    next(err);
  }
};

/** 2) GET /api/users/me/recipes */
export const getMyRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'name avatar');
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

/** 3) PUT /api/users/me */
export const updateMe = async (req, res, next) => {
  try {
    const allowed = ['name','bio','location','avatar'];
    const updates = {};
    allowed.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password ');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/** 4) GET /api/users/:id/recipes */
export const getUserRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ author: req.params.id })
      .populate('author', 'name avatar');
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

/** 5) GET /api/users/:id */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -followers -following');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};