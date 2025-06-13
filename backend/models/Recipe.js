/**
 * Recipe schema – supports likes, bookmarks, ratings & comments
 */

import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who rated
  value: { type: Number, min: 1, max: 5 },                    // star value
});

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },                   // name
    description: { type: String, required: true },             // short desc
    category: { type: String, default: 'main-course' },        // tag
    prepTime: Number,                                          // minutes
    cookTime: Number,                                          // minutes
    servings: Number,                                          // people
    difficulty: { type: String, default: 'medium' },           // easy/…
    image: String,                                             // URL
    ingredients: [String],                                     // list
    instructions: [String],                                    // steps
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // owner
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',default:[] }], // ❤️
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',default:[] }], // 🔖
    ratings: [ratingSchema],                                   // ⭐ array
  },
  { timestamps: true }
);

export default mongoose.model('Recipe', recipeSchema);
