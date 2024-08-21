import express from 'express';
import { getClients,
    getClient, 
    updateClient} from '../controllers/ClientController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.get('/', getClients);
router.get('/:id', getClient);
router.put('/:id', updateClient);

export default router; 