import express from 'express';
import {
    createSection,
    getSections,
    getSectionsWithItems,
    getSection,
    updateSection,
    deleteSection,
} from '../controllers/sectionController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN']), createSection);
router.get('/', checkAuth(['ADMIN']), getSections);
router.get('/public', getSectionsWithItems);
router.get('/:id', checkAuth(['ADMIN']), getSection);
router.put('/:id', checkAuth(['ADMIN']), updateSection);
router.delete('/:id', checkAuth(['ADMIN']), deleteSection);


export default router; 