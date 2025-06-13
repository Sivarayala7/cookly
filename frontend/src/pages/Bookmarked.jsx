import { useState, useEffect } from 'react';
import { Heart, Search, Filter } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { useRecipeStore } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';

// Bookmarked recipes page for authenticated users
// Features filtering, search, and grid layout for saved recipes
// Provides easy access to user's favorite recipes with management options
const Bookmarked = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { bookmarkedRecipes, isLoading, fetchBookmarkedRecipes, toggleBookmark } = useRecipeStore();
  const { isAuthenticated } = useAuthStore();

  // Load bookmarked recipes on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarkedRecipes();
    }
  }, [isAuthenticated, fetchBookmarkedRecipes]);

  // Filter and sort bookmarked recipes based on user input
  const filteredRecipes = bookmarkedRecipes
    .filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Handle search input changes with real-time filtering
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort option changes
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heart className="mx-auto text-gray-300 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Please log in to view bookmarked recipes
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to save and access your favorite recipes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="text-green-primary" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bookmarked Recipes
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Your saved recipes collection - {bookmarkedRecipes.length} recipes
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search bookmarked recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-primary focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-primary focus:border-transparent text-gray-900 dark:text-white appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {searchQuery ? (
            <>Showing {filteredRecipes.length} of {bookmarkedRecipes.length} bookmarked recipes</>
          ) : (
            <>Showing all {bookmarkedRecipes.length} bookmarked recipes</>
          )}
        </div>
      </div>

      {/* Recipes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onBookmark={toggleBookmark}
            />
          ))}
        </div>
      ) : bookmarkedRecipes.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No bookmarks yet! 
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This page feels emptier than your fridge at midnight.
          </p>
          <a
            href="/"
            className="btn-primary rounded-full p-3 inline-flex items-center space-x-2"
          >
            <Search size={16} />
            <span>Explore Recipes</span>
          </a>
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No recipes match your search
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or clear the search to see all bookmarked recipes.
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookmarked;