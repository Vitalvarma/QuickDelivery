import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 

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
      const response = await axios.post(`${API_URL}/register`, {
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
      return { success: true ,message: response.data.message };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Registration failed', 
        isAuthenticated: false 
      });
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
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
      return { success: true, message: response.data.message };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Login failed', 
        isAuthenticated: false 
      });
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      return { success: true, message: 'Logout successful' };
    } catch (error) {
      return {success: false, message: error.message };
    } finally {
      set({ user: null, token: null, isAuthenticated: false });
      localStorage.removeItem('token');
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='));
      if (!token && !refreshToken) {
        set({ isAuthenticated: false });
        return;
      }
      if(!token) {
        // If no token, try to refresh
        const response = await axios.post(`${API_URL}/refreshToken`, {}, { withCredentials: true });
        localStorage.setItem('token', response.data.accessToken);
        set({ token: response.data.accessToken });
      }

      const response = await axios.get(`${API_URL}/checkAuth`, {
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
      localStorage.removeItem('token');
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;