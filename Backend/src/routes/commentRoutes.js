import express from 'express';
import {
    createComment,
    getComments,
    updateCommentStatus,
    deleteComment
} from '../controllers/commentController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN', 'CLIENT']), createComment);
router.get('/', checkAuth(['ADMIN']), getComments);
router.post('/isActive', checkAuth(['ADMIN']), updateCommentStatus);
router.delete('/:id', checkAuth(['ADMIN']), deleteComment);

export default router;