import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  BookOpen,
  Edit2 as EditIcon,
  Check as SaveIcon,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useRecipeStore } from '../store/recipeStore';
import RecipeCard from '../components/RecipeCard';
import api from '../lib/api';
import toast from 'react-hot-toast';

// Avatar options for profile editing
const avatarOptions = [
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_2.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_4.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_5.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_6.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_7.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_8.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_9.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_10.png',
];

const Profile = () => {
  const { userId } = useParams();
  const me = useAuthStore(state => state.user);
  
  // Move all hooks before any conditional returns
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [form, setForm] = useState({
    name: '',
    bio: '',
    location: '',
    avatar: '',
  });

  // Now handle the conditional logic
  const shouldRedirectToUserProfile = !userId && me;
  const shouldRedirectToLogin = !userId && !me;
  
  // Determine if this is the current user's profile
  const isOwn = !userId || (me && me._id === userId);
  
  // Use the logged-in user's ID if no userId in params, otherwise use the param
  const targetUserId = userId || (me ? me._id : null);

  // Load profile + recipes
  useEffect(() => {
    if (!targetUserId) return;
    
    setLoading(true);

    // Determine which endpoint to use
    const profileEndpoint = isOwn ? '/users/me' : `/users/${targetUserId}`;
    const recipesEndpoint = isOwn ? '/users/me/recipes' : `/users/${targetUserId}/recipes`;

    // Load profile
    api.get(profileEndpoint)
      .then(({ data }) => {
        setUser(data);
        setForm({
          name: data.name,
          bio: data.bio || '',
          location: data.location || '',
          avatar: data.avatar || '/avatars/avatar1.png',
        });
      })
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false));

    // Load recipes
    api.get(recipesEndpoint)
      .then(({ data }) => setRecipes(data))
      .catch(() => toast.error('Could not load recipes'));
  }, [targetUserId, isOwn]);

  // Form handlers
  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAvatarSelect = (avatar) => {
    setForm(f => ({ ...f, avatar }));
    setShowAvatarPicker(false);
  };

  const save = () => {
    api.put('/users/me', form)
      .then(({ data }) => {
        setUser(data);
        useAuthStore.getState().setUser(data);
        toast.success('Profile updated');
        setEditMode(false);
      })
      .catch(() => toast.error('Update failed'));
  };

  // Handle conditional redirects AFTER all hooks
  if (shouldRedirectToUserProfile) {
    return <Navigate to={`/profile/${me._id}`} replace />;
  }

  if (shouldRedirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="p-8 animate-pulse">Loading profile…</div>;
  }
  
  if (!user) {
    return <div className="p-8 text-center">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 mb-8">
        <div className="flex items-center space-x-8">
          {/* Avatar */}
          <div className="relative">
            <img
              src={form.avatar || user.avatar || '/avatars/avatar1.png'}
              alt="Profile"
              className="w-32 h-32 rounded-2xl object-cover"
            />
            {editMode && (
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute bottom-0 right-0 bg-green-primary text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
              >
                <EditIcon size={16} />
              </button>
            )}
          </div>

          <div className="flex-1">
            {editMode ? (
              <>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full text-2xl font-bold mb-2 border-b dark:bg-gray-800 dark:text-white"
                />
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  className="w-full mb-2 border-b dark:bg-gray-800 dark:text-white"
                  placeholder="Bio"
                />
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <input
                    name="location"
                    value={form.location}
                    onChange={onChange}
                    className="border-b dark:bg-gray-800 dark:text-white"
                    placeholder="Location"
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-1 dark:text-white">{user.name}</h1>
                {user.bio && <p className="mb-2 dark:text-gray-300">{user.bio}</p>}
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  {user.location && (
                    <>
                      <MapPin size={16} />
                      <span>{user.location}</span>
                    </>
                  )}
                  <Calendar size={16} />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>

          {/* Edit / Save button - only show for own profile */}
          {isOwn && (
            editMode ? (
              <button
                onClick={save}
                className="btn btn-primary flex items-center space-x-1"
              >
                <SaveIcon size={16} />
                <span>Save</span>
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="btn flex items-center space-x-1"
              >
                <EditIcon size={16} />
                <span>Edit Profile</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Choose Your Avatar
            </h3>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`relative p-1 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    form.avatar === avatar
                      ? 'border-green-primary ring-2 ring-green-primary ring-opacity-50'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
        {recipes.length === 0 && (
          <div className="col-span-full text-center py-16">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium dark:text-white">
              {isOwn ? "You haven't created any recipes yet" : "No recipes yet"}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;