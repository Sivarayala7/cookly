import { Routes, Route } from 'react-router-dom';
import { useEffect } from  'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RecipeDetail from './pages/RecipeDetail';
import NewRecipe from './pages/NewRecipe';
import Settings from './pages/Settings';
import Bookmarked from './pages/Bookmarked';
import MyRecipes from './pages/MyRecipes';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';

// Enhanced main application component with additional routes
// Manages global state initialization and theme application
// Provides comprehensive routing for all application features
function App() {
  // Access auth and UI state from Zustand stores
  const { initializeAuth } = useAuthStore();
  const { darkMode } = useUIStore();

  // Initialize authentication state on app mount
  // Check for existing token in localStorage and apply dark mode
  useEffect(() => {
    initializeAuth();
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [initializeAuth, darkMode]);

  return (
    <div className={`min-h-screen bg-surface-subtle dark:bg-gray-900 transition-colors duration-200`}>
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
              path="/profile" 
              element={
                  <Profile />
              } 
          />
          <Route path="/profile/:userId?" element={<Profile />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/new-recipe" element={<NewRecipe />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bookmarked" element={<Bookmarked />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;