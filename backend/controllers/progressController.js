import Progress from '../models/Progress.js';
import StudySession from '../models/StudySession.js';
import { QuizResult } from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';
import StudyNote from '../models/StudyNote.js';

// Get user progress
export const getProgress = async (req, res) => {
    try {
        let progress = await Progress.findOne({ userId: req.user._id });

        if (!progress) {
            progress = new Progress({ userId: req.user._id });
            await progress.save();
        }

        res.json({ progress });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
};

// Get comprehensive dashboard data
export const getDashboard = async (req, res) => {
    try {
        let progress = await Progress.findOne({ userId: req.user._id });

        if (!progress) {
            progress = new Progress({ userId: req.user._id });
            await progress.save();
        }

        // Get recent activity
        const recentSessions = await StudySession.find({ userId: req.user._id })
            .sort({ startTime: -1 })
            .limit(5);

        const recentQuizResults = await QuizResult.find({ userId: req.user._id })
            .populate('quizId', 'title subject')
            .sort({ completedAt: -1 })
            .limit(5);

        // Get due flashcards count
        const dueFlashcardsCount = await Flashcard.countDocuments({
            userId: req.user._id,
            nextReview: { $lte: new Date() }
        });

        // Get total counts
        const totalNotes = await StudyNote.countDocuments({ userId: req.user._id });
        const totalFlashcards = await Flashcard.countDocuments({ userId: req.user._id });

        // Calculate weekly study time
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weeklySessions = await StudySession.find({
            userId: req.user._id,
            startTime: { $gte: weekAgo }
        });

        const weeklyStudyTime = weeklySessions.reduce((sum, session) => sum + (session.duration || 0), 0);

        res.json({
            progress,
            recentActivity: {
                sessions: recentSessions,
                quizResults: recentQuizResults
            },
            statistics: {
                totalNotes,
                totalFlashcards,
                dueFlashcardsCount,
                weeklyStudyTime
            }
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

// Update study goal
export const updateStudyGoal = async (req, res) => {
    try {
        const { goal, targetDate, progress: goalProgress } = req.body;

        if (!goal) {
            return res.status(400).json({ error: 'Goal is required' });
        }

        let progress = await Progress.findOne({ userId: req.user._id });

        if (!progress) {
            progress = new Progress({ userId: req.user._id });
        }

        progress.studyGoals.push({
            goal,
            targetDate: targetDate ? new Date(targetDate) : undefined,
            progress: goalProgress || 0
        });

        await progress.save();

        res.json({ message: 'Study goal added successfully', progress });
    } catch (error) {
        console.error('Update study goal error:', error);
        res.status(500).json({ error: 'Failed to update study goal' });
    }
};

// Mark study goal as completed
export const completeStudyGoal = async (req, res) => {
    try {
        const { goalId } = req.params;

        const progress = await Progress.findOne({ userId: req.user._id });

        if (!progress) {
            return res.status(404).json({ error: 'Progress not found' });
        }

        const goal = progress.studyGoals.id(goalId);

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        goal.completed = true;
        goal.progress = 100;

        // Award XP for completing goal
        progress.totalXP += 100;
        progress.overallLevel = Math.floor(progress.totalXP / 1000) + 1;

        // Add achievement
        const completedGoalsCount = progress.studyGoals.filter(g => g.completed).length;
        if (completedGoalsCount === 1) {
            progress.achievements.push({
                name: 'Goal Getter',
                description: 'Completed your first study goal',
                unlockedAt: new Date(),
                icon: '🎯'
            });
        }

        await progress.save();

        res.json({ message: 'Study goal completed successfully', progress });
    } catch (error) {
        console.error('Complete study goal error:', error);
        res.status(500).json({ error: 'Failed to complete study goal' });
    }
};

// Get subject analytics
export const getSubjectAnalytics = async (req, res) => {
    try {
        const { subject } = req.params;

        // Get all sessions for this subject
        const sessions = await StudySession.find({
            userId: req.user._id,
            subject
        });

        // Get quiz results for this subject
        const allQuizResults = await QuizResult.find({ userId: req.user._id })
            .populate('quizId');

        const quizResults = allQuizResults.filter(r => r.quizId && r.quizId.subject === subject);

        // Get flashcards for this subject
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            subject
        });

        // Get notes for this subject
        const notes = await StudyNote.find({
            userId: req.user._id,
            subject
        });

        // Calculate statistics
        const totalStudyTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const avgQuizScore = quizResults.length > 0
            ? (quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length).toFixed(2)
            : 0;

        const flashcardAccuracy = flashcards.length > 0
            ? ((flashcards.reduce((sum, f) => sum + f.correctCount, 0) /
                flashcards.reduce((sum, f) => sum + f.correctCount + f.incorrectCount, 1)) * 100).toFixed(2)
            : 0;

        res.json({
            subject,
            statistics: {
                totalStudyTime,
                totalSessions: sessions.length,
                totalQuizzes: quizResults.length,
                avgQuizScore,
                totalFlashcards: flashcards.length,
                flashcardAccuracy,
                totalNotes: notes.length
            },
            recentSessions: sessions.slice(0, 10),
            recentQuizzes: quizResults.slice(0, 5),
            studyTrend: calculateStudyTrend(sessions)
        });
    } catch (error) {
        console.error('Get subject analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch subject analytics' });
    }
};

// Get leaderboard (for gamification)
export const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await Progress.find()
            .sort({ totalXP: -1 })
            .limit(10)
            .populate('userId', 'username');

        const currentUserProgress = await Progress.findOne({ userId: req.user._id });

        const leaderboard = topUsers.map((progress, index) => ({
            rank: index + 1,
            username: progress.userId ? progress.userId.username : 'Unknown',
            level: progress.overallLevel,
            xp: progress.totalXP,
            achievements: progress.achievements.length
        }));

        // Find current user rank
        const allProgress = await Progress.find().sort({ totalXP: -1 });
        const currentUserRank = allProgress.findIndex(p => 
            p.userId.toString() === req.user._id.toString()
        ) + 1;

        res.json({
            leaderboard,
            currentUser: {
                rank: currentUserRank,
                level: currentUserProgress?.overallLevel || 1,
                xp: currentUserProgress?.totalXP || 0
            }
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

// Helper function to calculate study trend
function calculateStudyTrend(sessions) {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const daysSessions = sessions.filter(s =>
            s.startTime >= date && s.startTime < nextDate
        );

        const totalMinutes = daysSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

        last7Days.push({
            date: date.toISOString().split('T')[0],
            studyTime: totalMinutes,
            sessionCount: daysSessions.length
        });
    }

    return last7Days;
}
