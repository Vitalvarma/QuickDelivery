import mongoose from 'mongoose';
const locationSchema = new mongoose.Schema({
    display_name: {
        type: String,
        required: true
    },
    place_id: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    lon: {
        type: String,
        required: true
    },
});

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
        type: locationSchema,
        required: true
    },
    deliveryLocation: {
        type: locationSchema,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    imagePublicId: {
        type: String,
        default: ''
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
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
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
