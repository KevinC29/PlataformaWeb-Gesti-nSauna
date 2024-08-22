import express from 'express';
import { login,
    resetPassword } from '../controllers/authController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/login', login);
router.post('/reset', resetPassword);

export default router; 