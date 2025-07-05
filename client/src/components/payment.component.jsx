import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import usePaymentStore from '../stores/paymentStore';
import { useNavigate } from 'react-router-dom';
import useDeliveryStore from '../stores/deliveryStore';
import toast from 'react-hot-toast';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '10px 12px',
      letterSpacing: '0.025em',
      backgroundColor: 'white',
      height: '44px',
      boxSizing: 'border-box',
      border: '1px solid #ccc',
      borderRadius: '4px',
      paddingLeft: '12px',
      paddingRight: '12px',
      width: '100%',
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { loading, error, paymentStatus, handlePayment, amount } = usePaymentStore();
  const { updateDelivery, currentDelivery } = useDeliveryStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await handlePayment(amount, elements, stripe);
      if (response) {
        await updateDelivery(currentDelivery._id, {
          paymentStatus: 'paid',
        });
        navigate(`/deliveries`);
        toast.success("Payment done successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block text-gray-700 font-medium mb-4">
          Credit or debit card
          <div
            id="card-element"
            className="border border-gray-300 rounded-md p-5 mt-2 mb-6"
            style={{ padding: '15px 20px', minHeight: '50px', width: '100%' }}
          >
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading || !stripe || !elements}
          className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
            loading || !stripe || !elements
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Processing...' : `Pay $${(amount/100).toFixed(2)}`}
        </button>

        {error && <div className="text-red-600 text-center">{error.message || error}</div>}
        {paymentStatus === 'paid' && (
          <div className="text-green-600 text-center">Payment of ${(amount/100).toFixed(2)} successful!</div>
        )}
      </form>
    </div>
  );
};

export default Payment;
