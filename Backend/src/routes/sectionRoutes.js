import express from 'express';
import {
    createSection,
    getSections,
    getSection,
    updateSection,
    deleteSection,
    updateSectionStatus
} from '../controllers/sectionController.js';
import checkAuth from "../utils/helpers/handleAuthCheck.js";

const router = express.Router();

router.post('/', checkAuth(['ADMIN']), createSection);
router.get('/', checkAuth(['ADMIN']), getSections);
router.get('/:id', checkAuth(['ADMIN']), getSection);
router.put('/:id', checkAuth(['ADMIN']), updateSection);
router.post('/isActive', checkAuth(['ADMIN']), updateSectionStatus);
router.delete('/:id', checkAuth(['ADMIN']), deleteSection);


export default router; 