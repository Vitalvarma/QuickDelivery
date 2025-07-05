import Delivery from '../models/delivery.model.js';
import { calculateCost } from '../utils/calculateCost.js';
import { calculateDistance } from '../utils/calculateDistance.js';

export const createDelivery = async (req, res) => {
    const customerId = req.user._id;
    const customerName=req.user.username;
    const { packageDetails, pickupLocation, deliveryLocation, packageWeight, packageType } = req.body;

    if(customerId === undefined) {
        return res.status(400).json({ message: 'Not authorized to create delivery' });
    }

    if (!packageDetails || !pickupLocation || !deliveryLocation || !packageWeight || !packageType) {
        return res.status(400).json({ message: 'All fields are required pingpong' });
    }

    if(pickupLocation === deliveryLocation) {
        return res.status(400).json({ message: 'Pickup and delivery locations cannot be the same' });
    }

    if (packageWeight <= 0) {
        return res.status(400).json({ message: 'Package weight must be greater than 0' });
    }

    // Parse locations and convert lat/lon to numbers
    let parsedPickupLocation, parsedDeliveryLocation;
    try {
        parsedPickupLocation = JSON.parse(pickupLocation);
        parsedDeliveryLocation = JSON.parse(deliveryLocation);

        parsedPickupLocation.lat = parseFloat(parsedPickupLocation.lat);
        parsedPickupLocation.lon = parseFloat(parsedPickupLocation.lon);
        parsedDeliveryLocation.lat = parseFloat(parsedDeliveryLocation.lat);
        parsedDeliveryLocation.lon = parseFloat(parsedDeliveryLocation.lon);
    } catch (err) {
        return res.status(400).json({ message: 'Invalid location data' });
    }

    const distance = calculateDistance(parsedPickupLocation, parsedDeliveryLocation);
    const cost = calculateCost(packageWeight, distance);

    try {
        const deliveryData = {
            customerId: req.user._id,
            customerName,
            packageDetails,
            pickupLocation: parsedPickupLocation,
            deliveryLocation: parsedDeliveryLocation,
            packageWeight: parseFloat(packageWeight),
            packageType,
            deliveryStatus: 'pending',
            cost,
            distance
        };

        if(req.file) {
            deliveryData.imageUrl = req.file.path;
            deliveryData.imagePublicId = req.file.filename; 
        }
        const newDelivery = new Delivery(deliveryData);

        await newDelivery.save();
        res.status(201).json({ message: 'Delivery created successfully' , delivery: newDelivery });
    } catch (error) {
        console.error('Error creating delivery:', error);
        res.status(500).json({ message: 'Error creating delivery', error: error.message, stack: error.stack });
    }
}

export const getDeliveriesByCustomers = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(400).json({ message: 'Not authorized to get deliveries' });
    }

    try {
        const deliveries = await Delivery.find({ customerId: userId });
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deliveries', error: error.message });
    }
}

export const getDeliveries = async (req, res) => {
    //this endpoint is for delivery drivers to get all deliveries
    const userId = req.user._id;
    if (!userId) {
        return res.status(400).json({ message: 'Not authorized to get deliveries' });
    }
    
    try {

        const deliveries = await Delivery.find();

        const driverDeliveries = deliveries.filter(delivery => {
            return ((delivery.deliveryStatus==='pending') || (delivery.driverId && delivery.driverId.toString() === userId.toString()));
        })

        res.status(200).json(driverDeliveries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deliveries', error: error.message });
    }
}

export const getDelivery = async (req, res) => {
    const { id } = req.params;

    try {
        const delivery = await Delivery.findById(id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        res.status(200).json(delivery);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching delivery', error: error.message });
    }
}

export const updateDelivery = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const { deliveryStatus, deliveryRating, deliveryFeedback,paymentStatus } = req.body;

    try {
        // First get the delivery to check permissions
        const delivery = await Delivery.findById(id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        let updateData = {};
        
        // Customer can only update rating and feedback for delivered packages
        if (user.role === 'customer') {
            if (delivery.customerId.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this delivery' });
            }
            
            if (delivery.deliveryStatus === 'delivered' && delivery.paymentStatus === 'pending') {
                updateData = { paymentStatus };
                const updatedDelivery = await Delivery.findByIdAndUpdate(id, updateData, { new: true });
                return res.status(200).json(updatedDelivery);
            }

            updateData = {
                deliveryStatus,
                deliveryRating,
                deliveryFeedback
            };
        } 
        // Driver can only update status (pending -> inprogress)
        else if (user.role === 'driver') {
            if (delivery.driverId && delivery.driverId.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this delivery' });
            }
            
            if (deliveryStatus === 'inprogress' && delivery.deliveryStatus === 'pending' ||
                deliveryStatus === 'pending' && delivery.deliveryStatus === 'inprogress' ||
                deliveryStatus === 'delivered' && delivery.deliveryStatus === 'inprogress')
            {
                updateData = {
                    driverId: user._id, // Assign driver if not already assigned
                    driverName: user.username,
                    deliveryStatus,
                };
            } else {
                return res.status(400).json({ 
                    message: 'You cannot do this'
                });
            }
        } else {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedDelivery = await Delivery.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(500).json({ message: 'Error updating delivery', error: error.message });
    }
};

export const deleteDelivery = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDelivery = await Delivery.findByIdAndDelete(id);

        if (deletedDelivery.imagePublicId) {
      await cloudinary.uploader.destroy(delivery.imagePublicId);
    }
        if (!deletedDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        res.status(200).json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting delivery', error: error.message });
    }
}