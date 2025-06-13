import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { useRecipeStore } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';

// My Recipes page for authenticated users to manage their created recipes
// Streamlined interface focused on managing published recipes
const MyRecipes = () => {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const { userRecipes, isLoading, fetchUserRecipes, deleteRecipe } = useRecipeStore();
  const { bookmarkedRecipes, fetchBookmarkedRecipes, toggleBookmark } = useRecipeStore();
  const { user, isAuthenticated } = useAuthStore();

  // Load user's recipes on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserRecipes(user._id);
      fetchBookmarkedRecipes();
    }
  }, [isAuthenticated, user, fetchUserRecipes,fetchBookmarkedRecipes]);

  // Handle recipe deletion with confirmation
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      const result = await deleteRecipe(recipeId);
      if (result.success) {
        // Refresh the recipes list
        fetchUserRecipes(user._id);
      }
    }
  };

  // Handle bulk recipe selection for batch operations
  const handleRecipeSelection = (recipeId) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  // Handle bulk delete of selected recipes
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRecipes.length} recipes? This action cannot be undone.`)) {
      let success = true;
      
      for (const recipeId of selectedRecipes) {
        const result = await deleteRecipe(recipeId);
        if (!result.success) {
          success = false;
        }
      }
      
      if (success) {
        setSelectedRecipes([]);
        fetchUserRecipes(user._id);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Please log in to view your recipes
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to manage and view your created recipes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <BookOpen className="text-green-primary" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Recipes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your culinary creations
            </p>
          </div>
        </div>
        
        <Link
          to="/new-recipe"
          className="btn-primary p-2 flex items-center rounded-full space-x-2"
        >
          <Plus size={20} />
          <span>Create New Recipe</span>
        </Link>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-8">
        <div className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-600"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : userRecipes.length > 0 ? (
            <div className="space-y-6">
              {/* Recipe Management Actions */}
              {selectedRecipes.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 dark:text-green-200">
                      {selectedRecipes.length} recipe(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleBulkDelete}
                        className="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                      >
                        Delete Selected
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Recipes
                </h2>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {userRecipes.length} {userRecipes.length === 1 ? 'recipe' : 'recipes'}
                </span>
              </div>

              {/* Recipes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecipes.map((recipe) => (
                  <div key={recipe._id} className="relative group">
                    <RecipeCard
                    key={recipe._id}
              recipe={recipe}
              onBookmark={toggleBookmark}
                    />
                    
                    {/* Recipe Management Overlay */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="checkbox"
                        checked={selectedRecipes.includes(recipe._id)}
                        onChange={() => handleRecipeSelection(recipe._id)}
                        className="w-5 h-5 text-green-primary focus:ring-green-primary border-gray-300 rounded"
                      />
                    </div>

                    {/* Recipe Actions */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteRecipe(recipe._id)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No recipes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This plate is naked! Dress it up with your first recipe.
              </p>
              <Link
                to="/new-recipe"
                className="btn-primary rounded-full p-2 inline-flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Create Your First Recipe</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;