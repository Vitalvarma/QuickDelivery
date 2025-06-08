import Router from 'express';
import { createDelivery,updateDelivery, deleteDelivery,getDeliveries,getDeliveriesByCustomers,getDelivery } from '../controllers/delivery.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createdelivery', isAuthenticated, createDelivery);
router.get('/getdeliveriesdfcustomer', isAuthenticated, getDeliveriesByCustomers);
router.get('/getdeliveries', isAuthenticated, getDeliveries); 
router.get('/:id', isAuthenticated, getDelivery);
router.put('/:id', isAuthenticated, updateDelivery);
router.delete('/:id', isAuthenticated, deleteDelivery);


export default router;