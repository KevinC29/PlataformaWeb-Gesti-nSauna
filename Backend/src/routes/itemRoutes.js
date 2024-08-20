import express from 'express';
import { createItem, 
    getItems, 
    getItem, 
    updateItem, 
    deleteItem, 
    updateItemStatus } from '../controllers/itemController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.post('/isActive', updateItemStatus);
router.delete('/:id', deleteItem);

export default router; 