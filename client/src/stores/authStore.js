import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_ENV==='development' ? import.meta.env.VITE_API_URL : "/api"; 

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  register: async (username, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        role,
      }, { withCredentials: true });

      set({
        user: response.data.user,
        token: response.data.accessToken,
        isAuthenticated: true,
      });
      
      localStorage.setItem('token', response.data.accessToken);
      toast.success(response.data.message || 'Registration successful');
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Registration failed', 
        isAuthenticated: false 
      });
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        role,
      }, { withCredentials: true });
      
      set({
        user: response.data.user,
        token: response.data.accessToken,
        isAuthenticated: true,
      });

      
      localStorage.setItem('token', response.data.accessToken);
      toast.success(response.data.message || 'Login successful');
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Login failed', 
        isAuthenticated: false 
      });
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      toast.success('Logout successful');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Logout failed');
    } finally {
      set({ user: null, token: null, isAuthenticated: false });
      localStorage.removeItem('token');
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      let token = localStorage.getItem('token');
      const refreshTokenCookie = document.cookie.split('; ').find(row => row.startsWith('refreshToken='));
      if (!token && !refreshTokenCookie) {
        set({ isAuthenticated: false });
        return;
      }
      if (!token && refreshTokenCookie) {
        // If no token, try to refresh
        const response = await axios.get(`${API_URL}/auth/refreshtoken`, { withCredentials: true });
        token = response.data.accessToken;
        localStorage.setItem('token', token);
        set({ token });
      }

      const response = await axios.get(`${API_URL}/auth/checkauth`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      set({
        user: response.data.user,
        token: token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        isAuthenticated: false 
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;