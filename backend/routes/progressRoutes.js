import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    getProgress,
    getDashboard,
    updateStudyGoal,
    completeStudyGoal,
    getSubjectAnalytics,
    getLeaderboard
} from '../controllers/progressController.js';

const router = express.Router();

router.get('/', auth, getProgress);
router.get('/dashboard', auth, getDashboard);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/subject/:subject', auth, getSubjectAnalytics);
router.post('/goals', auth, updateStudyGoal);
router.put('/goals/:goalId/complete', auth, completeStudyGoal);

export default router;
