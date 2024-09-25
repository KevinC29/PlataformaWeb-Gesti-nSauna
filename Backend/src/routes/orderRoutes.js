import express from 'express';
import {
    createOrder,
    getOrders,
    getOrdersByDate,
    getOrder,
    updateOrder,
    deleteOrder
} from '../controllers/OrderController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN', 'CASHIER']), createOrder);
router.get('/', checkAuth(['ADMIN', 'CASHIER', 'MANAGER']), getOrders);
router.get('/by-date', checkAuth(['ADMIN', 'MANAGER']), getOrdersByDate);
router.get('/:id', checkAuth(['ADMIN', 'CASHIER', 'MANAGER']), getOrder);
router.put('/:id', checkAuth(['ADMIN', 'CASHIER']), updateOrder);
router.delete('/:id', checkAuth(['ADMIN', 'CASHIER']), deleteOrder);

export default router; 