import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  userId: null,
  isLoading: false,
  error: null,

  login: async (email, password, navigate) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password }, { withCredentials: true });
      set({ user: res.data.user, isLoading: false, userId: res.data.userId });
      if (res.data.isMFAEnabled) {
        navigate('/auth/mfa');
      }
      navigate('/');
    } catch (err) {
      set({ error: err.response?.data?.message || `Login failed`, isLoading: false });
    }
  },

  register: async (email, password, username, navigate) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', { email, password, username }, { withCredentials: true });
      set({ user: res.data.user, isLoading: false });
      navigate('/');
    } catch (err) {
      set({ error: err.response?.data?.message || `Registration failed`, isLoading: false });
    }
  },

  logout: async (navigate) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('http://localhost:3000/api/auth/logout', null, { withCredentials: true });
      set({ user: null, isLoading: false });
      navigate('/auth/login');
    } catch (err) {
      set({ error: err.response?.data?.message || `Logout failed`, isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('http://localhost:3000/api/checkAuth', { withCredentials: true });
      set({ user: res.data.user, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || null, isLoading: false });
    }
  },
}))