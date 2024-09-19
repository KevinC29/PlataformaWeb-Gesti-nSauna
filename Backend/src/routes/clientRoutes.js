import express from 'express';
import {
    createClient,
    getClients,
    getClient,
    getClientByAuthenticatedUser,
    updateClient,
    deleteClient,
} from '../controllers/clientController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN', 'CASHIER']), createClient);
router.get('/', checkAuth(['ADMIN', 'CASHIER']), getClients);
router.get('/by-user', checkAuth(['ADMIN', 'CLIENT']), getClientByAuthenticatedUser);
router.get('/:id', checkAuth(['ADMIN', 'CASHIER']), getClient);
router.put('/:id', checkAuth(['ADMIN', 'CASHIER']), updateClient);
router.delete('/:id', checkAuth(['ADMIN']), deleteClient);


export default router; 