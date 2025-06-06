import Router from 'express';
import { createDelivery,updateDelivery, deleteDelivery,getDeliveries,getDeliveriesByCustomers } from '../controllers/delivery.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createdelivery', isAuthenticated, createDelivery);
router.get('/getdeliveriesdfcustomer', isAuthenticated, getDeliveriesByCustomers);
router.get('/getDeliveries', isAuthenticated, getDeliveries); 
router.put('/:id', isAuthenticated, updateDelivery);
router.delete('/:id', isAuthenticated, deleteDelivery);


export default router;