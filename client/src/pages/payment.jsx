import Payment from "../components/payment.component";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  return (
    <div className="py-54 bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90%">
      <Elements stripe={stripePromise}>
        <Payment />
      </Elements>
    </div>
  )
}

export default PaymentPage;
