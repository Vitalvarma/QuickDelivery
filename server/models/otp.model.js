
import mongoose from 'mongoose';
const OTPSchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    required: true,
    index: true
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  driverId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Document will auto-delete after 5 minutes (300 seconds)
  }
});

const Otp = mongoose.model('Otp', OTPSchema);

export default Otp;
