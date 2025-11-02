import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    createQuiz,
    getQuizzes,
    getQuiz,
    submitQuiz,
    getQuizResults,
    getQuizStats,
    deleteQuiz,
    generateAIQuiz
} from '../controllers/quizController.js';

const router = express.Router();

router.post('/', auth, createQuiz);
router.post('/generate', auth, generateAIQuiz);
router.get('/', auth, getQuizzes);
router.get('/results', auth, getQuizResults);
router.get('/stats', auth, getQuizStats);
router.get('/:id', auth, getQuiz);
router.post('/:id/submit', auth, submitQuiz);
router.delete('/:id', auth, deleteQuiz);

export default router;
