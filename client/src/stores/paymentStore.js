import { create } from "zustand";
import axios from 'axios';
import useAuthStore from './authStore';

const API_URL = import.meta.env.VITE_ENV === 'development' ? import.meta.env.VITE_API_URL : '/api';

const usePaymentStore = create((set) => ({
  loading: false,
  error: null,
  paymentStatus: null,
  amount: 1000,
  
  handlePayment: async (amount, elements, stripe) => {
    set({ loading: true, error: null });
    
    try {
      const { token } = useAuthStore.getState();

      // Send amount to backend with Authorization header
      const response = await axios.post(`${API_URL}/payment/create-payment-intent`, 
        { amount: Math.round(amount) },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      if (response.status !== 200) {
        throw new Error('Failed to create payment intent');
      }
      
      const { clientSecret } = response.data;
      
      if (!elements) {
        throw new Error("Stripe Elements not provided.");
      }

      const cardElement = elements.getElement('card');
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      
      if (result.error) {
        set({ error: result.error, paymentStatus: 'failed' });
      } else {
        set({ paymentStatus: 'succeeded', amount });
      }
      return true;
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
  
  setAmount: (newAmount) => set({ amount: newAmount*100 }),
}));

export default usePaymentStore;
