import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  authLoading: true,
  followedUsers: [],

  /* ---------- helpers ---------- */
  _saveCredentials: ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  /* ---------- life-cycle ---------- */
  initializeAuth: () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      console.log('InitializeAuth called:', { token: !!token, userStr: !!userStr });
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        console.log('Setting authenticated user:', user);
        set({ 
          token, 
          user, 
          isAuthenticated: true, 
          authLoading: false 
        });
      } else {
        console.log('No stored credentials found');
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false, 
          authLoading: false 
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ 
        token: null, 
        user: null, 
        isAuthenticated: false, 
        authLoading: false 
      });
    }
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      followedUsers: [],
      authLoading: false 
    });
    toast.success('Logged out successfully');
  },

  /* ---------- auth ---------- */
  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/register', data);
      get()._saveCredentials(res.data);
      set({ 
        user: res.data.user, 
        token: res.data.token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      toast.success('Registration successful!');
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      toast.error(err.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', credentials);
      console.log('Login successful, user:', res.data.user);
      get()._saveCredentials(res.data);
      set({ 
        user: res.data.user, 
        token: res.data.token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      toast.error(err.response?.data?.message || 'Login failed');
      return { success: false };
    }
  },

  /* ---------- user profile ---------- */
  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const res = await api.put('/users/me', profileData);
      localStorage.setItem('user', JSON.stringify(res.data));
      set({ user: res.data, isLoading: false });
      toast.success('Profile updated!');
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      toast.error(err.response?.data?.message || 'Update failed');
      return { success: false };
    }
  },

  getUserProfile: async (userId) => {
    try {
      const res = await api.get(`/users/${userId}`);
      const isFollowing = get().followedUsers.includes(userId);
      return { success: true, user: { ...res.data, isFollowing } };
    } catch (err) {
      toast.error('Failed to fetch user');
      return { success: false };
    }
  },

  /* ---------- account deletion ---------- */
  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      await api.delete('/users/me');
      
      // Clear all local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset store state
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        followedUsers: [],
        authLoading: false,
        isLoading: false 
      });
      
      toast.success('Account deleted successfully');
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      toast.error(err.response?.data?.message || 'Failed to delete account');
      return { success: false };
    }
  }
}));