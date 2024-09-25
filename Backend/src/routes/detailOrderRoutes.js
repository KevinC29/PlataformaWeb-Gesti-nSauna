import express from 'express';
import {
    createDetailOrder,
    getDetailsOrder,
    getDetailOrder,
    getDetailsOrderByOrder,
    updateDetailOrder,
    deleteDetailOrder
} from '../controllers/detailOrderController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN', 'CASHIER']), createDetailOrder);
router.get('/', checkAuth(['ADMIN', 'CASHIER']), getDetailsOrder);
router.get('/:id', checkAuth(['ADMIN', 'CASHIER']), getDetailOrder);
router.get('/by-order/:id', checkAuth(['ADMIN', 'CASHIER']), getDetailsOrderByOrder);
router.put('/:id', checkAuth(['ADMIN', 'CASHIER']), updateDetailOrder);
router.delete('/:id', checkAuth(['ADMIN', 'CASHIER']), deleteDetailOrder);

export default router; 