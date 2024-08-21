import express from 'express';
import { createOrder, 
    getOrders,
    getOrdersByDate,
    getOrder, 
    updateOrder, 
    deleteOrder } from '../controllers/OrderController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/by-date', getOrdersByDate);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router; 