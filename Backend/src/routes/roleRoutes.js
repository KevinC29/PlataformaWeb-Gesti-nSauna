import express from 'express';
import { createRole, 
    getRoles, 
    getRole, 
    updateRole, 
    deleteRole, 
    updateRoleStatus } from '../controllers/roleController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createRole);
router.get('/', getRoles);
router.get('/:id', getRole);
router.put('/:id', updateRole);
router.post('/isActive', updateRoleStatus);
router.delete('/:id', deleteRole);

export default router; 