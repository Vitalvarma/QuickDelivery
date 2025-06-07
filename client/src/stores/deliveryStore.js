import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_ENV === 'development' ? import.meta.env.VITE_API_URL : '/api';

const useDeliveryStore = create((set) => ({
  deliveries: [],
  currentDelivery: null,
  loading: false,
  error: null,

  createDelivery: async (deliveryData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/delivery/createdelivery`, {
        ...deliveryData
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set((state) => ({
        deliveries: [...state.deliveries, response.data.delivery],
        loading: false
      }));
      toast.success(response.data.message || 'Delivery created successfully');
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create delivery', loading: false });
      toast.error(error.response?.data?.message || 'Failed to create delivery');
    }
  },

  getCustomerDeliveries: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery/getdeliveriesdfcustomer`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ deliveries: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch deliveries', loading: false });
    }
  },

  getAllDeliveries: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery/getDeliveries`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ deliveries: response.data, loading: false });

    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch deliveries', loading: false });
    }
  },

  getDeliveryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ currentDelivery: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch delivery', loading: false });
    }
  },


  updateDelivery: async (id, updateData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/delivery/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set((state) => ({
        deliveries: state.deliveries.map(delivery => 
          delivery._id === id ? { ...delivery, ...response.data } : delivery
        ),
        currentDelivery: response.data,
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update delivery', 
        loading: false 
      });
      throw error; // Re-throw to handle in component if needed
    }
  },

  deleteDelivery: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/delivery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set((state) => ({
        deliveries: state.deliveries.filter(delivery => delivery._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete delivery', loading: false });
    }
  },

  clearCurrentDelivery: () => set({ currentDelivery: null }),
}));

export default useDeliveryStore;