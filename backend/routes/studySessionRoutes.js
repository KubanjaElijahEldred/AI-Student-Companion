import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    startStudySession,
    endStudySession,
    addBreak,
    getStudySessions,
    getStudySessionStats
} from '../controllers/studySessionController.js';

const router = express.Router();

router.post('/start', auth, startStudySession);
router.post('/:id/end', auth, endStudySession);
router.post('/:id/break', auth, addBreak);
router.get('/', auth, getStudySessions);
router.get('/stats', auth, getStudySessionStats);

export default router;
