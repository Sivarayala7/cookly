import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  Moon,
  Sun,
  Plus,
  BookOpen,
  Heart,
  User,
  Settings,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Handle Home link click
  const handleHomeClick = (e) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // Already on home page, just scroll
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home with scroll flag
      navigate('/', { state: { scrollToMain: true } });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <dotlottie-player
            src="https://lottie.host/e0314ed3-daba-4c68-9c78-55ad580af191/1SCmVEfUHa.lottie"
            background="transparent"
            speed="1"
            style={{ width: 50, height: 50 }}
            autoplay
            count="1"
          ></dotlottie-player>
        </Link>

        {/* Primary nav links (desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="/"
            onClick={handleHomeClick}
            className={`hover:text-green-primary transition-colors cursor-pointer ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}
          >
            Home
          </a>
          {isAuthenticated && (
            <>
              <Link 
                to="/my-recipes" 
                className={`hover:text-green-primary transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                My Recipes
              </Link>
              <Link 
                to="/bookmarked" 
                className={`hover:text-green-primary transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                Bookmarked
              </Link>
            </>
          )}
        </div>

        {/* Rest of the navbar remains the same... */}
        {/* Right-hand controls */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 hover:text-green-primary transition-colors ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/new-recipe"
                className="btn-primary px-4 py-2 rounded-full flex items-center space-x-1"
              >
                <Plus size={16} /><span>Create</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-primary"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-green-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      <User size={16} className="mr-2" /> My Profile
                    </Link>
                    <Link
                      to="/bookmarked"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      <Heart size={16} className="mr-2" /> Bookmarked
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      <Settings size={16} className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                    >
                      <LogOut size={16} className="mr-2" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex space-x-3">
              <Link 
                to="/login" 
                className={`hover:text-green-primary mt-2 mr-3 ml-5 transition-colors ${
                  darkMode ? 'text-green-primary' : 'text-gray-700'
                }`}
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2 rounded-full">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;