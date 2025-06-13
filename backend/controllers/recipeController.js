import jwt from 'jsonwebtoken';
import Recipe from '../models/Recipe.js';

/*──────────────── helper – find caller's user-id ────────────────*/
const currentUserId = (req) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try {
    const token = h.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return id;                                         // valid token → uid
  } catch {                                            // bad / expired
    return null;
  }
};

/*──────────────── GET /api/recipes ──────────────────────────────*/
export const getRecipes = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'all') filter.category = category;

    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { title: re },
        { description: re },
        { ingredients: { $elemMatch: { $regex: re } } },
      ];
    }

    const uid = currentUserId(req);
    const docs = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .lean();

    const recipes = docs.map((r) => {
      const sum = r.ratings.reduce((s, rt) => s + rt.value, 0);
      r.averageRating = r.ratings.length ? sum / r.ratings.length : 0;
      r.reviewCount = r.ratings.length;
      r.isLiked = uid ? r.likes.some((u) => u.equals(uid)) : false;
      r.isBookmarked = uid ? r.bookmarks.some((u) => u.equals(uid)) : false;
      
      // Add user's own rating if they are authenticated
      if (uid) {
        const userRating = r.ratings.find(rating => String(rating.user) === uid);
        r.myRating = userRating ? userRating.value : null;
      }
      
      return r;
    });

    res.json(recipes);
  } catch (err) { next(err); }
};

/*──────────────── GET /api/recipes/:id ──────────────────────────*/
export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar')
      .lean();

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const uid = currentUserId(req);
    const sum = recipe.ratings.reduce((s, rt) => s + rt.value, 0);
    recipe.averageRating = recipe.ratings.length ? sum / recipe.ratings.length : 0;
    recipe.reviewCount = recipe.ratings.length;
    recipe.isLiked = uid ? recipe.likes.some((u) => u.equals(uid)) : false;
    recipe.isBookmarked = uid ? recipe.bookmarks.some((u) => u.equals(uid)) : false;
    
    // Add user's own rating if they are authenticated
    if (uid) {
      const userRating = recipe.ratings.find(rating => String(rating.user) === uid);
      recipe.myRating = userRating ? userRating.value : null;
    }

    res.json(recipe);
  } catch (err) { next(err); }
};

/*──────────────── POST /api/recipes ─────────────────────────────*/
export const createRecipe = async (req, res, next) => {
  try {
    const doc = await Recipe.create({ ...req.body, author: req.user._id });
    res.status(201).json(doc);
  } catch (err) { next(err); }
};


/*──────────────── DELETE /api/recipes/:id ───────────────────────*/
export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (!recipe.author.equals(req.user._id))
      return res.status(403).json({ message: 'Unauthorized' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) { next(err); }
};

/*──────────────── POST /api/recipes/:id/like ────────────────────*/
export const likeRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    const idx = recipe.likes.findIndex((u) => u.equals(req.user._id));
    idx === -1 ? recipe.likes.push(req.user._id)
               : recipe.likes.splice(idx, 1);
    await recipe.save();
    
    // Return both liked status and updated likes array
    res.json({ 
      liked: idx === -1,
      likesCount: recipe.likes.length
    });
  } catch (err) { next(err); }
};

/*──────────────── POST /api/recipes/:id/bookmark ────────────────*/
export const bookmarkRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    const idx = recipe.bookmarks.findIndex((u) => u.equals(req.user._id));
    idx === -1 ? recipe.bookmarks.push(req.user._id)
               : recipe.bookmarks.splice(idx, 1);
    await recipe.save();
    
    res.json({ bookmarked: idx === -1 });
  } catch (err) { next(err); }
};

/*──────────────── GET /api/recipes/bookmarked ───────────────────*/
export const getBookmarked = async (req, res, next) => {
  try {
    const docs = await Recipe.find({ bookmarks: req.user._id })
      .populate('author', 'name avatar')
      .lean();

    const recipes = docs.map((r) => {
      const sum = r.ratings.reduce((s, rt) => s + rt.value, 0);
      r.averageRating = r.ratings.length ? sum / r.ratings.length : 0;
      r.reviewCount = r.ratings.length;
      r.isLiked = r.likes.some((u) => u.equals(req.user._id));
      r.isBookmarked = true;
      
      // Add user's own rating
      const userRating = r.ratings.find(rating => 
        String(rating.user) === String(req.user._id));
      r.myRating = userRating ? userRating.value : null;
      
      return r;
    });

    res.json(recipes);
  } catch (err) { next(err); }
};

/*──────────────── GET /api/recipes/:id/rate ─────────────────────
 * Public helper: returns avg + count (+ the caller's own rating
 * if they are authenticated).
 */
export const getRecipeRating = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const sum = recipe.ratings.reduce((s, r) => s + r.value, 0);
    const avg = recipe.ratings.length ? sum / recipe.ratings.length : 0;
    const count = recipe.ratings.length;

    const uid = currentUserId(req);
    const myRating = uid
      ? recipe.ratings.find((r) => String(r.user) === uid)?.value
      : undefined;

    res.json({ avg, count, myRating });
  } catch (err) { next(err); }
};

/*──────────────── POST /api/recipes/:id/rate ────────────────────
 * body: { value : 1..5 }
 * Up-serts caller's rating → returns new avg/count.
 */
/*──────────────── POST /api/recipes/:id/rate ────────────────────*/
export const rateRecipe = async (req, res, next) => {
  try {
    const { value } = req.body;
    if (!value || value < 1 || value > 5)
      return res.status(400).json({ message: 'Rating must be 1-5' });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Check if user has already rated this recipe
    const existingIndex = recipe.ratings.findIndex(
      (r) => r.user && r.user.toString() === req.user._id.toString()
    );

    if (existingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingIndex].value = value;
    } else {
      // Add new rating
      recipe.ratings.push({ user: req.user._id, value });
    }

    // Tell Mongoose the array was modified
    recipe.markModified('ratings');
    await recipe.save();

    // Calculate new average
    const sum = recipe.ratings.reduce((s, r) => s + r.value, 0);
    const avg = sum / recipe.ratings.length;
    const count = recipe.ratings.length;

    res.json({ 
      avg, 
      count,
      myRating: value 
    });
  } catch (err) { next(err); }
};