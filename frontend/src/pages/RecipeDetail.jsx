import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock, Users, Star, Heart,
  Bookmark, ArrowLeft, Check,
} from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';
import CommentSection from '../components/CommentSection';
import toast from 'react-hot-toast';

const RecipeDetail = () => {
  const { id } = useParams();
  const [checkedSteps, setChecked] = useState(new Set());
  const [userRating, setUserRating] = useState(0); // 1-5
  const [hasRated, setHasRated] = useState(false);

  const {
    currentRecipe, isLoading,
    fetchRecipeById, rateRecipe, toggleBookmark, toggleLike,
  } = useRecipeStore();
  const { isAuthenticated } = useAuthStore();

  /* fetch recipe */
  useEffect(() => { 
    if (id) fetchRecipeById(id); 
  }, [id, fetchRecipeById]);

  /* reset steps + initialise rating whenever recipe changes */
  useEffect(() => {
    setChecked(new Set());

    if (!currentRecipe) return;
    
    // Check if user has already rated this recipe
    const userRatingValue = currentRecipe.myRating;
    if (userRatingValue) {
      setUserRating(userRatingValue);
      setHasRated(true);
    } else {
      setUserRating(0);
      setHasRated(false);
    }
  }, [currentRecipe]);

  /* step checklist */
  const toggleStep = (idx) =>
    setChecked(prev => {
      const copy = new Set(prev);
      copy.has(idx) ? copy.delete(idx) : copy.add(idx);
      return copy;
    });

  /* rating */
  const handleRating = async (value) => {
    if (!isAuthenticated || !currentRecipe) return;
    if(hasRated)
    {
      toast.error('You have already rated this recipe');
      return;
    }
    setUserRating(value);await
     rateRecipe(currentRecipe._id, value);
    setHasRated(true); // lock widget
  };

  /* star renderer */
  /* star renderer */
const renderStars = (rating, interactive = false, size = 'w-5 h-5') =>
  Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const isUserRating = interactive && hasRated;
    const isSavedUserRating = !interactive && currentRecipe?.myRating && i < currentRecipe.myRating;
    
    // Determine fill color based on different conditions
    const fillColor = filled
      ? (isUserRating || isSavedUserRating)
        ? 'text-green-primary fill-current' // Green for user's rating (current or saved)
        : 'text-yellow-400 fill-current'    // Yellow for average rating
      : 'text-gray-300';                    // Gray for unfilled stars

    return (
      <button
        key={i}
        onClick={interactive ? () => handleRating(i + 1) : undefined}
        disabled={!interactive || hasRated || !isAuthenticated}
        className={`${size} ${interactive ? hasRated ? '' : 'cursor-pointer' : ''} ${fillColor}`}
      >
        <Star className="w-full h-full" />
      </button>
    );
  });

  /* skeleton while loading */
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  /* missing recipe */
  if (!currentRecipe) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Recipe not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">It may have been deleted or made private.</p>
        <Link to="/" className="btn-primary mt-6 inline-block">Go back home</Link>
      </div>
    );
  }
  
  const recipe = currentRecipe;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* back link */}
      <Link to="/" className="inline-flex items-center space-x-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-green-primary">
        <ArrowLeft size={20} />
        <span>Back to recipes</span>
      </Link>

      {/* Header / Hero */}
     <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-8">
  {/* cover image + actions */}
  <div className="relative aspect-[16/9]">
    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
    <div className="absolute top-4 right-4 flex space-x-3">
      {/* Bookmark button */}
      <button
        onClick={() => toggleBookmark(recipe._id)}
        className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors shadow-sm ${
          recipe.isBookmarked
            ? 'bg-green-primary text-white'
            : 'bg-white/90 text-gray-700 hover:bg-white'
        }`}
        aria-label={recipe.isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <Bookmark size={18} className={`${recipe.isBookmarked ? 'fill-current' : ''}`} />
      </button>
      
      {/* Like button */}
      <button
        onClick={() => toggleLike(recipe._id)}
        className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors shadow-sm ${
          recipe.isLiked
            ? 'bg-red-500 text-white'
            : 'bg-white/90 text-gray-700 hover:bg-white'
        }`}
        aria-label={recipe.isLiked ? "Unlike" : "Like"}
      >
        <div className="flex items-center">
          <Heart size={18} className={recipe.isLiked ? 'fill-current' : ''} />
          <span className="ml-1 text-xs font-medium">{recipe.likes?.length || 0}</span>
        </div>
      </button>
    </div>
  </div>

        {/* meta */}
        <div className="p-8 lg:flex lg:justify-between">
          <div className="space-y-4 lg:flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{recipe.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{recipe.description}</p>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Clock size={18} /><span>{recipe.prepTime + recipe.cookTime} minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Users size={18} /><span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(recipe.averageRating || 0)}
                <span className="text-gray-600 dark:text-gray-400">
                  ({recipe.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
  {recipe.author.avatar ? (
    <img
      src={recipe.author.avatar}
      alt={recipe.author.name}
      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
    />
  ) : (
    <div className="w-12 h-12 bg-green-primary rounded-full flex items-center justify-center">
      <span className="text-white font-semibold">
        {recipe.author.name.charAt(0).toUpperCase()}
      </span>
    </div>
  )}
  <div>
    <Link
      to={`/profile/${recipe.author._id}`}
      className="font-medium text-gray-900 dark:text-white hover:text-green-primary"
    >
      {recipe.author.name}
    </Link>
    <p className="text-sm text-gray-600 dark:text-gray-400">Recipe author</p>
  </div>
</div>
          </div>

          {/* rate widget */}
          {isAuthenticated && (
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {hasRated ? 'Thanks for rating!' : 'Rate this recipe'}
                </h3>
                <div className="flex justify-center space-x-1 mb-3">
                  {renderStars(hasRated ? userRating : 5, !hasRated, 'w-8 h-8')}
                </div>
                {!hasRated && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click a star to rate
                  </p>
                )}
                {hasRated && (
                  <p className="text-sm text-green-primary">
                    You rated: {userRating} {userRating === 1 ? 'star' : 'stars'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients & Instructions */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* ingredients */}
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-primary rounded-full mt-2" />
                  <span className="text-gray-700 dark:text-gray-300">{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* steps + comments */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Instructions</h2>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex space-x-4">
                  <button
                    onClick={() => toggleStep(i)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      checkedSteps.has(i)
                        ? 'bg-green-primary border-green-primary text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-primary'
                    }`}
                  >
                    {checkedSteps.has(i) ? <Check size={16} /> : <span className="text-sm font-semibold">{i + 1}</span>}
                  </button>
                  <p className={`flex-1 text-gray-700 dark:text-gray-300 leading-relaxed ${
                    checkedSteps.has(i) ? 'line-through opacity-60' : ''
                  }`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* comments */}
          <CommentSection recipeId={recipe._id} />
        </section>
      </div>
    </div>
  );
};

export default RecipeDetail;