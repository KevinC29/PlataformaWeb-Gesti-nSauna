import express from 'express';
import {
    invoiceSend
} from '../controllers/invoiceController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/send', checkAuth(['ADMIN', 'CASHIER', 'MANAGER']), invoiceSend);

export default router; 