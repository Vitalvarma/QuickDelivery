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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await axios.post(`${API_URL}/delivery/createdelivery`, deliveryData, config);
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
      const response = await axios.get(`${API_URL}/delivery/getdeliveries`, {
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
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update delivery', 
        loading: false 
      });
    }
  },

  deleteDelivery: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/delivery/${id}`, {
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

  sendOtp: async (id) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const token = localStorage.getItem('token');
      // Access currentDelivery from the current state
      const currentDelivery = useDeliveryStore.getState().currentDelivery;
      const response = await axios.post(`${API_URL}/otp/send`, {
        deliveryId: id || currentDelivery?._id,
        customerId: currentDelivery?.customerId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set((state) => ({ ...state, loading: false }));
      toast.success(response.data.message || 'OTP sent successfully');
      return true;
    } catch (error) {
      set((state) => ({ ...state, error: error.response?.data?.message || 'Failed to send OTP', loading: false }));
      console.error('Error sending OTP in the store:', error);
      toast.error(error.response?.data?.message);
      return false;
    }
  },
verifyOtp: async (otp, id) => {
  set({ loading: true, error: null });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/otp/verify`, {
      deliveryId: id,
      otp
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    set({ loading: false });
    toast.success(response.data.message || 'OTP verified successfully');
    return true;
  } catch (error) {
    set({ error: error.response?.data?.message || 'Failed to verify OTP', loading: false });
    toast.error(error.response?.data?.message || 'Failed to verify OTP');
    return false;
  }
},

  clearCurrentDelivery: () => set({ currentDelivery: null }),
}));

export default useDeliveryStore;