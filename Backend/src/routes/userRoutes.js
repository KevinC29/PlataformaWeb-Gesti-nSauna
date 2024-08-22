import express from 'express';
import {
    createUser,
    getUsers,
    getUser,
    updateUser,
    updateUserStatus,
    deleteUser
} from '../controllers/userController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN']), createUser);
router.get('/', checkAuth(['ADMIN', 'CASHIER']), getUsers);
router.get('/:id', checkAuth(['ADMIN', 'CASHIER']), getUser);
router.put('/:id', checkAuth(['ADMIN']), updateUser);
router.post('/isActive', checkAuth(['ADMIN']), updateUserStatus);
router.delete('/:id', checkAuth(['ADMIN']), deleteUser);

export default router; 