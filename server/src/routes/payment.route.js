import {Router} from 'express';
import stripePackage from 'stripe';
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const router=Router();

const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret ,message: 'Payment intent created' });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: err.message });
  }
};

router.post('/create-payment-intent',isAuthenticated,createPaymentIntent);



export default router;

