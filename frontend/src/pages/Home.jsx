import { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Award } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { useRecipeStore } from '../store/recipeStore';

// Enhanced home page component with improved filtering and sample data
// Features trending recipes, category filters, and search functionality
// Implements responsive grid layout and loading states for optimal UX
const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { recipes, isLoading, fetchRecipes, toggleBookmark } = useRecipeStore();

  // Enhanced category options for recipe filtering
  const categories = [
    { id: 'all', name: 'All Recipes', icon: Award },
    { id: 'breakfast', name: 'Breakfast', icon: Clock },
    { id: 'lunch', name: 'Lunch', icon: TrendingUp },
    { id: 'dinner', name: 'Dinner', icon: Award },
    { id: 'dessert', name: 'Dessert', icon: TrendingUp },
    { id: 'appetizer', name: 'Appetizer', icon: Clock },
    { id: 'vegetarian', name: 'Vegetarian', icon: Award },
  ];

  // Featured stats for the hero section with updated numbers
  const stats = [
    { label: 'Active Cooks', value: '12K+', color: 'text-green-primary' },
    { label: 'Recipes Shared', value: '8.5K', color: 'text-orange' },
    { label: 'Success Rate', value: '94%', color: 'text-yellow' }
  ];
  
  // Load recipes on component mount and when filters change
  useEffect(() => {
    fetchRecipes(activeCategory, searchQuery);
  }, [activeCategory, searchQuery, fetchRecipes]);

  // Handle category filter changes with smooth transitions
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Debounced search handler to prevent excessive API calls
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Dot Pattern Background */}
      <section className="bg-surface-subtle dark:bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-gray-900 dark:text-white">
                  Revolutionize Your Cooking
                </h1>
                <h2 className="text-gray-800 dark:text-gray-200">
                  with Community-Driven Recipe Sharing
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                  Discover, create, and share amazing recipes with our vibrant cooking community. 
                  Connect with fellow food enthusiasts worldwide and expand your culinary horizons.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="btn btn-dark text-base px-8 py-4">
                  Explore Recipes
                </button>
                <button className="btn bg-white text-gray-900 border-2 border-gray-200 hover:border-green-primary hover:text-green-primary text-base px-8 py-4">
                  Join Community
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-3xl font-bold font-serif italic ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image with Floating Elements */}
            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                  alt="Delicious Recipe"
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Mediterranean Quinoa Bowl
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Fresh, vibrant, and perfect for summer gatherings
                  </p>
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-primary/10 rounded-full animate-float"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-orange/20 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-primary focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {recipes.length} recipes
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-green-primary text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <IconComponent size={16} />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
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
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onBookmark={toggleBookmark}
                />
              ))}
            </div>

            {recipes.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or browse different categories
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;