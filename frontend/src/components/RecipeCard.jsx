import { Link } from 'react-router-dom';
import { Clock, Users, Star, Heart } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';

const RecipeCard = ({ recipe, onBookmark, onLike, onRate }) => {
  const { toggleLike, toggleBookmark } = useRecipeStore();
  const { isAuthenticated } = useAuthStore();

  // Star renderer for recipe cards - updated to show green for user's rating
  const renderStars = (rating) => 
    Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      
      // If user has rated this recipe, show their rating in green
      const isUserRated = recipe.myRating && i < recipe.myRating;
      
      // Use green for user's own rating, yellow for average rating
      const fillColor = filled
        ? isUserRated
          ? 'text-green-primary fill-current' // Green for user's rating
          : 'text-yellow-400 fill-current'    // Yellow for average rating
        : 'text-gray-300';                    // Gray for unfilled stars
      
      return (
        <Star 
          key={i} 
          className={`w-4 h-4 ${fillColor}`} 
        />
      );
    });

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleLike(recipe._id);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleBookmark(recipe._id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <Link to={`/recipe/${recipe._id}`} className="block">
        <div className="relative aspect-[4/3]">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full backdrop-blur-sm ${
                recipe.isBookmarked
                  ? 'bg-green-primary text-white'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={recipe.isBookmarked ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/recipe/${recipe._id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {recipe.title}
          </h3>
        </Link>
        
        {/* Author Information */}
        {recipe.author && (
          <Link 
            to={`/profile/${recipe.author._id || recipe.author}`} 
            className="flex items-center space-x-2 mb-2 hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={recipe.author.avatar || 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png'} 
              alt={recipe.author.name || 'Author'}
              className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              by {recipe.author.name || 'Unknown'}
            </span>
          </Link>
        )}
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Clock size={16} />
            <span className="text-sm">{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Users size={16} />
            <span className="text-sm">{recipe.servings} servings</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            <div className="flex">
              {/* Show user's rating in green if available, otherwise show average rating */}
              {recipe.myRating ? renderStars(recipe.myRating) : renderStars(recipe.averageRating || 0)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({recipe.reviewCount || 0})
            </span>
          </div>
          
          <button 
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-500"
          >
            <Heart 
              size={16} 
              className={recipe.isLiked ? "fill-red-500 text-red-500" : ""} 
            />
            <span className="text-sm">
              {recipe.likes?.length || 0}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;