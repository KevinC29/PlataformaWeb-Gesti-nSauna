import express from 'express';
import { createDetailOrder, 
    getDetailOrders, 
    getDetailOrder, 
    updateDetailOrder, 
    deleteDetailOrder } from '../controllers/detailOrderController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createDetailOrder);
router.get('/', getDetailOrders);
router.get('/:id', getDetailOrder);
router.put('/:id', updateDetailOrder);
router.delete('/:id', deleteDetailOrder);

export default router; 