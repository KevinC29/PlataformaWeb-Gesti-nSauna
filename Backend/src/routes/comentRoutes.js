import express from 'express';
import { createComment,
    getComments,
    updateCommentStatus,
    deleteComment } from '../controllers/commentController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createComment);
router.get('/', getComments);
router.post('/isActive', updateCommentStatus);
router.delete('/:id', deleteComment);

export default router;