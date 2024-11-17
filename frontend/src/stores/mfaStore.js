import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useMFAStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  verify: async (code, navigate) => {
    set({ isLoading: true, error: null });
    try {
      const { userId } = useAuthStore.getState();
      if (!userId) {
        throw new Error('User ID is not available');
      }
      const res = await axios.post(
        'http://localhost:3000/api/mfa/verify',
        { userId, otp: code },
        { withCredentials: true }
      );
      set({ user: res.data.user, isLoading: false });
      navigate('/');
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || `OTP verification failed`,
        isLoading: false,
      });
    }
  },
  

  enable: async (userId, navigate) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('http://localhost:3000/api/mfa/enable', { userId }, { withCredentials: true });
      set({ user: res.data.user, isLoading: false });
      navigate('/');
    } catch (err) {
      set({ error: err.response?.data?.message || `MFA enabling failed`, isLoading: false });
    }
  },

  disable: async (userId, navigate) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('http://localhost:3000/api/mfa/disable', { userId }, { withCredentials: true });
      set({ user: res.data.user, isLoading: false });
      navigate('/');
    } catch (err) {
      set({ error: err.response?.data?.message || `MFA disabling failed`, isLoading: false });
    }
  },
}))