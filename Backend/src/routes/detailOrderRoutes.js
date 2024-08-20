import express from 'express';
import { createdetailOrder, 
    getdetailOrders, 
    getdetailOrder, 
    updatedetailOrder, 
    deletedetailOrder, 
    updatedetailOrderStatus } from '../controllers/detailOrderController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createdetailOrder);
router.get('/', getdetailOrders);
router.get('/:id', getdetailOrder);
router.put('/:id', updatedetailOrder);
router.post('/isActive', updatedetailOrderStatus);
router.delete('/:id', deletedetailOrder);

export default router; 