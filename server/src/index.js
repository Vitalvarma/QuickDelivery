import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './DB/connectDB.js';
import authRoutes from './routes/auth.route.js';
import deliveryRoutes from './routes/delivery.route.js';
import paymentRoutes from './routes/payment.route.js';
import otpRoutes from './routes/otp.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const app=express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173' || 'https://quickdelivery.onrender.com', // Replace with your client's origin
  credentials: true 
}));
app.use('/api/auth', authRoutes);
app.use('/api/delivery', deliveryRoutes); 
app.use('/api/otp',otpRoutes);
app.use('/api/payment',paymentRoutes);
/*
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client',"dist", 'index.html'));
  });
}
*/

app.listen(PORT, ()=>{
    connectDB();
    console.log('Server is running on port 3000');
})
