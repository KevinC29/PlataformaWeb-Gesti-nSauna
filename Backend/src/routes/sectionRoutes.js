import express from 'express';
import { createSection, 
    getSections, 
    getSection, 
    updateSection, 
    deleteSection, 
    updateSectionStatus } from '../controllers/sectionController.js';
// const checkAuth = require("../utils/validators/authCheck")
// const {validateCreateUser} = require('../utils/validators/user.validator')
const router = express.Router();

router.post('/', createSection);
router.get('/', getSections);
router.get('/:id', getSection);
router.put('/:id', updateSection);
router.post('/isActive', updateSectionStatus);
router.delete('/:id', deleteSection);


export default router; 