import express from 'express';
import { updateCredentialPassword,
    updateCredentialStatus } from '../controllers/credentialController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.put('/:id', updateCredentialPassword);
router.post('/isActive', updateCredentialStatus);

export default router; 