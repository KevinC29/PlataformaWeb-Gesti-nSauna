import express from 'express';
import {
    updateCredentialPassword,
    updateCredentialStatus
} from '../controllers/credentialController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.put('/:id', checkAuth(['ADMIN']), updateCredentialPassword);
router.post('/isActive', checkAuth(['ADMIN']), updateCredentialStatus);

export default router; 