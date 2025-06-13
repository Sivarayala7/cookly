import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Upload, Clock, Users } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';

// Recipe creation form with comprehensive input validation and preview
// Features dynamic ingredient/instruction management and image upload support
// Implements real-time form validation and intuitive user experience design
const NewRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'main-course',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'medium',
    image: '',
    ingredients: [''],
    instructions: ['']
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  
  const { createRecipe, isLoading } = useRecipeStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Recipe categories for selection dropdown
  const categories = [
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'main-course', label: 'Main Course' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' }
  ];

  // Difficulty levels with descriptions
  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Perfect for beginners' },
    { value: 'medium', label: 'Medium', description: 'Some cooking experience needed' },
    { value: 'hard', label: 'Hard', description: 'Advanced techniques required' }
  ];

  // Redirect non-authenticated users
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Handle basic form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image URL input with preview generation
  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
    setImagePreview(imageUrl);
  };

  // Add new ingredient field to the form
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  // Remove ingredient field by index
  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Update specific ingredient value
  const updateIngredient = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? value : ing
      )
    }));
  };

  // Add new instruction step to the form
  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  // Remove instruction step by index
  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  // Update specific instruction value
  const updateInstruction = (index, value) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => 
        i === index ? value : inst
      )
    }));
  };

  // Comprehensive form validation before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Recipe title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Recipe description is required';
    }

    if (!formData.prepTime || parseInt(formData.prepTime) <= 0) {
      newErrors.prepTime = 'Valid prep time is required';
    }

    if (!formData.cookTime || parseInt(formData.cookTime) <= 0) {
      newErrors.cookTime = 'Valid cook time is required';
    }

    if (!formData.servings || parseInt(formData.servings) <= 0) {
      newErrors.servings = 'Valid number of servings is required';
    }

    const validIngredients = formData.ingredients.filter(ing => ing.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    const validInstructions = formData.instructions.filter(inst => inst.trim());
    if (validInstructions.length === 0) {
      newErrors.instructions = 'At least one instruction step is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with validation and API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Clean up empty fields before submission
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.trim()),
      instructions: formData.instructions.filter(inst => inst.trim()),
      prepTime: parseInt(formData.prepTime),
      cookTime: parseInt(formData.cookTime),
      servings: parseInt(formData.servings)
    };

    const result = await createRecipe(cleanedData);
    if (result.success) {
      navigate(`/recipe/${result.recipe._id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Recipe
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your culinary creation with the Cookly community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your recipe title..."
              />
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Describe your recipe..."
              />
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipe Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock size={16} className="inline mr-1" />
                Prep Time (minutes) *
              </label>
              <input
                type="number"
                name="prepTime"
                min="1"
                value={formData.prepTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent ${
                  errors.prepTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="15"
              />
              {errors.prepTime && <p className="mt-2 text-sm text-red-600">{errors.prepTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock size={16} className="inline mr-1" />
                Cook Time (minutes) *
              </label>
              <input
                type="number"
                name="cookTime"
                min="1"
                value={formData.cookTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent ${
                  errors.cookTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="30"
              />
              {errors.cookTime && <p className="mt-2 text-sm text-red-600">{errors.cookTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users size={16} className="inline mr-1" />
                Servings *
              </label>
              <input
                type="number"
                name="servings"
                min="1"
                value={formData.servings}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent ${
                  errors.servings ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="4"
              />
              {errors.servings && <p className="mt-2 text-sm text-red-600">{errors.servings}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipe Image (URL)
            </label>
            <div className="flex space-x-4">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleImageChange}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="w-full max-w-md h-48 object-cover rounded-xl"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ingredients *
              </label>
              <button
                type="button"
                onClick={addIngredient}
                className="btn-primary text-sm px-3 py-1 rounded-lg flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent"
                    placeholder="1 cup flour"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.ingredients && <p className="mt-2 text-sm text-red-600">{errors.ingredients}</p>}
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Instructions *
              </label>
              <button
                type="button"
                onClick={addInstruction}
                className="btn-primary text-sm px-3 py-1 rounded-lg flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Add Step</span>
              </button>
            </div>
            <div className="space-y-3">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mt-2">
                    {index + 1}
                  </div>
                  <textarea
                    rows={3}
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent resize-none"
                    placeholder="Describe this step in detail..."
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors mt-2"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.instructions && <p className="mt-2 text-sm text-red-600">{errors.instructions}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Publishing...' : '🍳 Publish Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRecipe;