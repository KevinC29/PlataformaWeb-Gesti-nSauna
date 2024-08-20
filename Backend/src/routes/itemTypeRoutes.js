import express from 'express';
import { createItemType, 
    getItemTypes, 
    getItemType, 
    updateItemType, 
    deleteItemType, 
    updateItemTypeStatus } from '../controllers/itemTypeController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createItemType);
router.get('/', getItemTypes);
router.get('/:id', getItemType);
router.put('/:id', updateItemType);
router.post('/isActive', updateItemTypeStatus);
router.delete('/:id', deleteItemType);

export default router; 