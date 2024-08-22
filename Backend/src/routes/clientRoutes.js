import express from 'express';
import { createClient,
    getClients,
    getClient, 
    updateClient,
    deleteClient } from '../controllers/ClientController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createClient);
router.get('/', getClients);
router.get('/:id', getClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router; 