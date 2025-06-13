import Comment from '../models/Comment.js';
import Recipe  from '../models/Recipe.js';

/* ───────────── POST /api/recipes/:recipeId/comments ───────────── */
export const addComment = async (req, res, next) => {
  try {
    const { content, parentId } = req.body;
    if (!content) return res.status(400).json({ msg : 'Empty content' });

    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe)  return res.status(404).json({ msg : 'Recipe not found' });

    const newComment = await Comment.create({
      recipe : recipe._id,
      author : req.user._id,
      content,
      parent : parentId || null
    });

    // populate author so the FE has the name immediately
    await newComment.populate('author', 'name');

    res.status(201).json(newComment);
  } catch (err) { next(err); }
};

/* ───────────── GET /api/recipes/:recipeId/comments ─────────────── */
export const getComments = async (req, res, next) => {
  try {
    const all = await Comment.find({ recipe : req.params.recipeId })
      .populate('author', 'name')
      .sort({ createdAt : -1 })
      .lean();

    // build threaded tree
    const topLevel = all.filter(c => !c.parent);
    const threaded = topLevel.map(c => ({
      ...c,
      replies : all.filter(r => String(r.parent) === String(c._id))
    }));

    res.json(threaded);
  } catch (err) { next(err); }
};

/* ─────────── DELETE /api/recipes/:recipeId/comments/:commentId ──── */
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg : 'Comment not found' });

    const recipe = await Recipe.findById(comment.recipe);
    const allowed =
      comment.author.equals(req.user._id) ||
      (recipe && recipe.author.equals(req.user._id));

    if (!allowed) return res.status(403).json({ msg : 'Forbidden' });

    await Comment.deleteMany({ parent: comment._id });
    await Comment.findByIdAndDelete(comment._id);                    // ← mongoose v7

    res.json({ deleted : true });
  } catch (err) { next(err); }
};
