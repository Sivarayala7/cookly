import { useState } from 'react';
import { User, Mail, MapPin, Lock, Bell, Shield, Trash2, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
const Settings = () => {
  const { user, updateProfile } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: user?.settings?.showEmail || false,
    showBio: user?.settings?.showBio || true,
    showLocation: user?.settings?.showLocation || true
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    recipeUpdates: true,
    followNotifications: true,
    commentNotifications: true
  });

  // Enhanced settings navigation tabs with appearance section
  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: darkMode ? Moon : Sun },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'account', name: 'Account', icon: Trash2 }
  ];

  // Handle profile form changes with real-time updates
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle privacy settings changes with immediate effect
  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle notification preference changes
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Save profile changes with validation
  const handleProfileSave = async (e) => {
    e.preventDefault();
    const result = await updateProfile({
      ...profileData,
      settings: privacySettings
    });
    if (result.success) {
      // Profile updated successfully
    }
  };

  // Save notification preferences
  const handleNotificationSave = () => {
    // API call to save notification preferences
    console.log('Saving notifications:', notifications);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Settings Navigation */}
          <div className="lg:w-64 bg-gray-50 dark:bg-gray-700 p-6">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Settings
            </h1>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Profile Information
                </h2>
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent"
                          placeholder="Your city or country"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        rows={4}
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent resize-none"
                        placeholder="Tell us about your cooking journey..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Privacy Settings
                </h2>
                
                <div className="space-y-6">
                  {/* Information Visibility */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Information Visibility
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail size={18} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Show Email</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Display your email address on your profile
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange('showEmail', !privacySettings.showEmail)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacySettings.showEmail ? 'bg-green-primary' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacySettings.showEmail ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User size={18} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Show Bio</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Display your bio on your profile
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange('showBio', !privacySettings.showBio)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacySettings.showBio ? 'bg-green-primary' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacySettings.showBio ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MapPin size={18} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Show Location</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Display your location on your profile
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange('showLocation', !privacySettings.showLocation)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacySettings.showLocation ? 'bg-green-primary' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacySettings.showLocation ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={handleProfileSave} className="btn btn-primary">
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Appearance Settings
                </h2>
                
                <div className="space-y-6">
                  {/* Theme Settings */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Theme Preferences
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {darkMode ? <Moon size={20} className="text-gray-400" /> : <Sun size={20} className="text-gray-400" />}
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">Dark Mode</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Switch between light and dark themes
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            darkMode ? 'bg-green-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Preview
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                          <div className={`h-2 w-20 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className={`h-8 w-full rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                        <div className={`h-2 w-3/4 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                      </div>
                                            <div className="text-sm">
                        <p className="text-gray-900 dark:text-white font-medium mb-1">
                          Current Theme: {darkMode ? 'Dark' : 'Light'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {darkMode 
                            ? 'Perfect for low-light environments and reducing eye strain'
                            : 'Optimal for daylight viewing and better readability'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {key === 'emailNotifications' && 'Receive important updates via email'}
                              {key === 'pushNotifications' && 'Get instant notifications in your browser'}
                              {key === 'recipeUpdates' && 'When someone likes or comments on your recipes'}
                              {key === 'followNotifications' && 'When someone follows your profile'}
                              {key === 'commentNotifications' && 'When someone replies to your comments'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-green-primary' : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={handleNotificationSave} className="btn btn-primary">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Management */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Account Management
                </h2>
                <div className="space-y-6">
                  {/* Account Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Account Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Account Type</span>
                        <span className="text-gray-900 dark:text-white font-medium">Free Account</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Recipes</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {user?.recipeCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                    <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-red-700 dark:text-red-300 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                          This action will permanently delete:
                        </p>
                        <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                          <li>All your recipes and recipe data</li>
                          <li>Your profile and personal information</li>
                          <li>All comments and interactions</li>
                          <li>Your bookmarks and favorites</li>
                        </ul>
                      </div>
                      <button className="btn bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2">
                        <Trash2 size={16} />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;