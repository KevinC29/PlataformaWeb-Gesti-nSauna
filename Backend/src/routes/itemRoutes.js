import express from 'express';
import {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
    updateItemStatus
} from '../controllers/itemController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN']), createItem);
router.get('/', checkAuth(['ADMIN']), getItems);
router.get('/:id', checkAuth(['ADMIN']), getItem);
router.put('/:id', checkAuth(['ADMIN']), updateItem);
router.post('/isActive', checkAuth(['ADMIN']), updateItemStatus);
router.delete('/:id', checkAuth(['ADMIN']), deleteItem);

export default router; 