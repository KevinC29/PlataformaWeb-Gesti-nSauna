import express from 'express';
import {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRole,
} from '../controllers/roleController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN']), createRole);
router.get('/', checkAuth(['ADMIN']), getRoles);
router.get('/:id', checkAuth(['ADMIN']), getRole);
router.put('/:id', checkAuth(['ADMIN']), updateRole);
router.delete('/:id', checkAuth(['ADMIN']), deleteRole);

export default router; 