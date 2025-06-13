import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const useRecipeStore = create((set, get) => ({
  recipes: [],
  currentRecipe: null,
  errorMsg: null,
  userRecipes: [],
  bookmarkedRecipes: [],
  isLoading: false,
  selectedCategory: 'all',
  searchQuery: '',

  /* ---------- helpers ---------- */
  _start: () => set({ isLoading: true }),
  _end: () => set({ isLoading: false }),
  _fail: (msg) => { toast.error(msg); set({ errorMsg: msg }); },

  /* ---------- collections ---------- */
  fetchRecipes: async (category = 'all', search = '') => {
    get()._start();
    try {
      const res = await api.get('/recipes', { params: { category, search } });
      set({
        recipes: res.data,
        selectedCategory: category,
        searchQuery: search
      });
    } catch (err) {
      toast.error('Failed to load recipes');
    } finally {
      get()._end();
    }
  },

  fetchRecipeById: async (id) => {
    get()._start();
    try {
      const res = await api.get(`/recipes/${id}`);
      set({ currentRecipe: res.data });
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not load recipe';
      get()._fail(msg);
      set({ currentRecipe: null });
    } finally {
      get()._end();
    }
  },

  createRecipe: async (payload) => {
    get()._start();
    try {
      const res = await api.post('/recipes', payload);
      set(state => ({ recipes: [res.data, ...state.recipes] }));
      toast.success('Recipe created!');
      return { success: true, recipe: res.data };
    } catch (err) {
      toast.error('Creation failed');
      return { success: false };
    } finally {
      get()._end();
    }
  },

  deleteRecipe: async (recipeId) => {
    try {
      await api.delete(`/recipes/${recipeId}`);
      set(state => ({
        recipes: state.recipes.filter(r => r._id !== recipeId),
        userRecipes: state.userRecipes.filter(r => r._id !== recipeId),
        bookmarkedRecipes: state.bookmarkedRecipes.filter(r => r._id !== recipeId)
      }));
      toast.success('Recipe deleted');
      return { success: true };
    } catch (err) {
      toast.error('Delete failed');
      return { success: false };
    }
  },

  /* ---------- interactions ---------- */
  toggleLike: async (recipeId) => {
    // Get current recipe to calculate new likes count
    const recipe = get().recipes.find(r => r._id === recipeId) || get().currentRecipe;
    if (!recipe) return;
    
    // Calculate new likes count for optimistic update
    const newLikesCount = recipe.isLiked ? 
      (recipe.likes?.length - 1 || 0) : 
      (recipe.likes?.length + 1 || 1);
    
    // Optimistic UI update
    set(state => ({
      recipes: state.recipes.map(r =>
        r._id === recipeId ? { 
          ...r, 
          isLiked: !r.isLiked,
          likes: Array.isArray(r.likes) ? 
            r.isLiked ? 
              r.likes.filter((_, i) => i !== r.likes.length - 1) : 
              [...r.likes, 'temp-id'] : 
            r.isLiked ? [] : ['temp-id']
        } : r
      ),
      currentRecipe: state.currentRecipe && state.currentRecipe._id === recipeId
        ? { 
            ...state.currentRecipe, 
            isLiked: !state.currentRecipe.isLiked,
            likes: Array.isArray(state.currentRecipe.likes) ? 
              state.currentRecipe.isLiked ? 
                state.currentRecipe.likes.filter((_, i) => i !== state.currentRecipe.likes.length - 1) : 
                [...state.currentRecipe.likes, 'temp-id'] : 
              state.currentRecipe.isLiked ? [] : ['temp-id']
          }
        : state.currentRecipe
    }));
    
    try {
      const res = await api.post(`/recipes/${recipeId}/like`);
      
      // Update UI with actual likes count from server
      if (res.data && typeof res.data.likesCount !== 'undefined') {
        set(state => ({
          recipes: state.recipes.map(r =>
            r._id === recipeId ? { 
              ...r, 
              likes: Array(res.data.likesCount).fill('user-id')
            } : r
          ),
          currentRecipe: state.currentRecipe && state.currentRecipe._id === recipeId
            ? { 
                ...state.currentRecipe, 
                likes: Array(res.data.likesCount).fill('user-id')
              }
            : state.currentRecipe
        }));
      }
      
      toast.success(res.data.liked ? 'Recipe liked!' : 'Like removed');
    } catch (err) {
      // Revert the optimistic update if the API call fails
      set(state => ({
        recipes: state.recipes.map(r =>
          r._id === recipeId ? { 
            ...r, 
            isLiked: !r.isLiked,
            likes: Array.isArray(r.likes) ? 
              !r.isLiked ? 
                r.likes.filter((_, i) => i !== r.likes.length - 1) : 
                [...r.likes, 'temp-id'] : 
              !r.isLiked ? [] : ['temp-id']
          } : r
        ),
        currentRecipe: state.currentRecipe && state.currentRecipe._id === recipeId
          ? { 
              ...state.currentRecipe, 
              isLiked: !state.currentRecipe.isLiked,
              likes: Array.isArray(state.currentRecipe.likes) ? 
                !state.currentRecipe.isLiked ? 
                  state.currentRecipe.likes.filter((_, i) => i !== state.currentRecipe.likes.length - 1) : 
                  [...state.currentRecipe.likes, 'temp-id'] : 
                !state.currentRecipe.isLiked ? [] : ['temp-id']
            }
          : state.currentRecipe
      }));
      toast.error('Failed to toggle like');
    }
  },

  toggleBookmark: async (recipeId) => {
    // optimistic UI
    set(state => ({
      recipes: state.recipes.map(r =>
        r._id === recipeId ? { ...r, isBookmarked: !r.isBookmarked } : r
      ),
      currentRecipe: state.currentRecipe && state.currentRecipe._id === recipeId
        ? { ...state.currentRecipe, isBookmarked: !state.currentRecipe.isBookmarked }
        : state.currentRecipe
    }));
    try {
      const res = await api.post(`/recipes/${recipeId}/bookmark`); // { bookmarked }
      set(state => {
        const recipe = state.recipes.find(r => r._id === recipeId);
        const inList = state.bookmarkedRecipes.some(r => r._id === recipeId);
        return res.data.bookmarked
          ? { bookmarkedRecipes: inList ? state.bookmarkedRecipes : [recipe, ...state.bookmarkedRecipes] }
          : { bookmarkedRecipes: state.bookmarkedRecipes.filter(r => r._id !== recipeId) };
      });
      toast.success(res.data.bookmarked ? 'Bookmarked!' : 'Bookmark removed');
    } catch (err) {
      // Revert optimistic update on failure
      set(state => ({
        recipes: state.recipes.map(r =>
          r._id === recipeId ? { ...r, isBookmarked: !r.isBookmarked } : r
        ),
        currentRecipe: state.currentRecipe && state.currentRecipe._id === recipeId
          ? { ...state.currentRecipe, isBookmarked: !state.currentRecipe.isBookmarked }
          : state.currentRecipe
      }));
      toast.error('Failed to toggle bookmark');
    }
  },

  rateRecipe: async (recipeId, value) => {
  try {
    const res = await api.post(`/recipes/${recipeId}/rate`, { value }); 
    
    // Check if the user has already rated (backend will return this info)
    if (res.data.alreadyRated) {
      toast.error('You have already rated this recipe');
      return;
    }
    
    // Update both average rating and user's own rating
    set(state => ({
      recipes: state.recipes.map(r =>
        r._id === recipeId
          ? { 
              ...r, 
              averageRating: res.data.avg, 
              reviewCount: res.data.count,
              myRating: value // Store user's rating
            }
          : r
      ),
      currentRecipe: state.currentRecipe && state.currentRecipe._id === recipeId
        ? { 
            ...state.currentRecipe, 
            averageRating: res.data.avg, 
            reviewCount: res.data.count,
            myRating: value // Store user's rating
          }
        : state.currentRecipe
    }));
    toast.success('Thanks for rating!');
  } catch (err) {
    if (err.response?.data?.alreadyRated) {
      // User already rated this recipe
      toast.error('You have already rated this recipe');
      
      // Update local state to reflect the existing rating
      const existingRating = err.response.data.myRating;
      if (existingRating) {
        set(state => ({
          currentRecipe: state.currentRecipe && state.currentRecipe._id === recipeId
            ? { ...state.currentRecipe, myRating: existingRating }
            : state.currentRecipe
        }));
      }
    } else {
      toast.error('Rating failed');
    }
  }
},

  /* ---------- per-user collections ---------- */
  fetchBookmarkedRecipes: async () => {
    get()._start();
    try {
      const res = await api.get('/recipes/bookmarked');
      set({ bookmarkedRecipes: res.data });
    } catch {
      toast.error('Failed to load bookmarks');
    } finally {
      get()._end();
    }
  },

  fetchUserRecipes: async (userId) => {
  get()._start();
  try {
    const res = await api.get(`/users/${userId}/recipes`);
    
    // Ensure each recipe has all the necessary properties
    const recipes = res.data.map(recipe => ({
      ...recipe,
      isLiked: recipe.isLiked || false,
      isBookmarked: recipe.isBookmarked || false,
      likes: recipe.likes || [],
      bookmarks: recipe.bookmarks || [],
      myRating: recipe.myRating || null,
      averageRating: recipe.averageRating || 0,
      reviewCount: recipe.reviewCount || 0
    }));
    
    set({ userRecipes: recipes });
    return recipes;
  } catch (err) {
    toast.error('Failed to load your recipes');
    return [];
  } finally {
    get()._end();
  }
}
}));