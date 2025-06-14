// src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cookly.onrender.com/api',
  withCredentials: true,
});

// BEFORE each request, read the token from localStorage and attach it
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
