import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    packageDetails: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    deliveryLocation: {
        type: String,
        required: true
    },
    packageWeight: {
        type: Number,
        required: true
    },
    packageType: {
        type: String,
        enum: ['document', 'parcel', 'food', 'medicine', 'other'],
        required: true
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'inprogress', 'delivered','completed'],
        default: 'pending'
    },
    deliveryRating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    deliveryFeedback: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});


const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;
