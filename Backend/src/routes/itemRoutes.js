import express from 'express';
import {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
} from '../controllers/itemController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN']), createItem);
router.get('/', checkAuth(['ADMIN', 'CASHIER']), getItems);
router.get('/:id', checkAuth(['ADMIN', 'CASHIER']), getItem);
router.put('/:id', checkAuth(['ADMIN']), updateItem);
router.delete('/:id', checkAuth(['ADMIN']), deleteItem);

export default router; 