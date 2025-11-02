import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    createStudyNote,
    getStudyNotes,
    getStudyNote,
    updateStudyNote,
    deleteStudyNote,
    searchStudyNotes
} from '../controllers/studyNoteController.js';

const router = express.Router();

router.post('/', auth, createStudyNote);
router.get('/', auth, getStudyNotes);
router.get('/search', auth, searchStudyNotes);
router.get('/:id', auth, getStudyNote);
router.put('/:id', auth, updateStudyNote);
router.delete('/:id', auth, deleteStudyNote);

export default router;
