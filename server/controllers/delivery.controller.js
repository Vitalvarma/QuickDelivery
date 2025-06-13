import Delivery from '../models/delivery.model.js';

export const createDelivery = async (req, res) => {
    const customerId = req.user._id;
    const { packageDetails, pickupLocation, deliveryLocation, packageWeight, packageType } = req.body;

    if(customerId === undefined) {
        return res.status(400).json({ message: 'Not authorized to create delivery' });
    }

    if (!packageDetails || !pickupLocation || !deliveryLocation || !packageWeight || !packageType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newDelivery = new Delivery({
            customerId,
            driverId: null, // Initially no driver assigned
            packageDetails,
            pickupLocation,
            deliveryLocation,
            packageWeight,
            packageType
        });

        await newDelivery.save();
        res.status(201).json({ message: 'Delivery created successfully' , delivery: newDelivery });
    } catch (error) {
        res.status(500).json({ message: 'Error creating delivery', error: error.message });
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
    const { deliveryStatus, deliveryRating, deliveryFeedback } = req.body;

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
            
            if (delivery.deliveryStatus !== 'delivered') {
                return res.status(400).json({ message: 'You can only rate delivered packages' });
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
        if (!deletedDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        res.status(200).json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting delivery', error: error.message });
    }
}