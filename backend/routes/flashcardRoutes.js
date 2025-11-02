import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    createFlashcard,
    getFlashcards,
    getDueFlashcards,
    reviewFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardStats
} from '../controllers/flashcardController.js';

const router = express.Router();

router.post('/', auth, createFlashcard);
router.get('/', auth, getFlashcards);
router.get('/due', auth, getDueFlashcards);
router.get('/stats', auth, getFlashcardStats);
router.post('/:id/review', auth, reviewFlashcard);
router.put('/:id', auth, updateFlashcard);
router.delete('/:id', auth, deleteFlashcard);

export default router;
