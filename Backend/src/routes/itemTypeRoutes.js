import express from 'express';
import {
    createItemType,
    getItemTypes,
    getItemType,
    updateItemType,
    deleteItemType,
} from '../controllers/itemTypeController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN']), createItemType);
router.get('/', checkAuth(['ADMIN']), getItemTypes);
router.get('/:id', checkAuth(['ADMIN']), getItemType);
router.put('/:id', checkAuth(['ADMIN']), updateItemType);
router.delete('/:id', checkAuth(['ADMIN']), deleteItemType);

export default router; 