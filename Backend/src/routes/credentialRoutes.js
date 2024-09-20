import express from 'express';
import {
    updateCredentialPassword,
    updateCredentialStatus,
    getUserWithCredential,
} from '../controllers/credentialController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.get('/user-profile', checkAuth(['ADMIN', 'CLIENT']), getUserWithCredential);
router.put('/:id', checkAuth(['ADMIN']), updateCredentialPassword);
router.post('/isActive', checkAuth(['ADMIN']), updateCredentialStatus);

export default router; 