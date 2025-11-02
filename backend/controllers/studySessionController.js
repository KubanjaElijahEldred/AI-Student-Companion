import StudySession from '../models/StudySession.js';
import Progress from '../models/Progress.js';

// Start a new study session
export const startStudySession = async (req, res) => {
    try {
        const { subject, focus, goals } = req.body;

        if (!subject) {
            return res.status(400).json({ error: 'Subject is required' });
        }

        const session = new StudySession({
            userId: req.user._id,
            subject,
            focus,
            goals: goals || [],
            startTime: new Date()
        });

        await session.save();
        res.status(201).json({ message: 'Study session started', session });
    } catch (error) {
        console.error('Start study session error:', error);
        res.status(500).json({ error: 'Failed to start study session' });
    }
};

// End a study session
export const endStudySession = async (req, res) => {
    try {
        const { productivity, notes, goalsCompleted } = req.body;

        const session = await StudySession.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!session) {
            return res.status(404).json({ error: 'Study session not found' });
        }

        if (session.endTime) {
            return res.status(400).json({ error: 'Study session already ended' });
        }

        const endTime = new Date();
        const duration = Math.round((endTime - session.startTime) / 1000 / 60); // in minutes

        session.endTime = endTime;
        session.duration = duration;
        session.productivity = productivity || 5;
        session.notes = notes;
        session.goalsCompleted = goalsCompleted || [];

        await session.save();

        // Update user progress
        await updateUserProgress(req.user._id, session);

        res.json({ message: 'Study session ended', session });
    } catch (error) {
        console.error('End study session error:', error);
        res.status(500).json({ error: 'Failed to end study session' });
    }
};

// Add break to study session
export const addBreak = async (req, res) => {
    try {
        const { startTime, endTime } = req.body;

        const session = await StudySession.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!session) {
            return res.status(404).json({ error: 'Study session not found' });
        }

        const breakDuration = Math.round((new Date(endTime) - new Date(startTime)) / 1000 / 60);

        session.breaks.push({
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            duration: breakDuration
        });

        await session.save();
        res.json({ message: 'Break added to study session', session });
    } catch (error) {
        console.error('Add break error:', error);
        res.status(500).json({ error: 'Failed to add break' });
    }
};

// Get all study sessions
export const getStudySessions = async (req, res) => {
    try {
        const { subject, startDate, endDate } = req.query;

        let query = { userId: req.user._id };

        if (subject) {
            query.subject = subject;
        }

        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = new Date(startDate);
            if (endDate) query.startTime.$lte = new Date(endDate);
        }

        const sessions = await StudySession.find(query).sort({ startTime: -1 });
        res.json({ sessions });
    } catch (error) {
        console.error('Get study sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch study sessions' });
    }
};

// Get study session statistics
export const getStudySessionStats = async (req, res) => {
    try {
        const sessions = await StudySession.find({ userId: req.user._id });

        const totalSessions = sessions.length;
        const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
        const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
        const avgProductivity = totalSessions > 0 
            ? (sessions.reduce((sum, session) => sum + (session.productivity || 5), 0) / totalSessions).toFixed(2)
            : 0;

        const bySubject = sessions.reduce((acc, session) => {
            if (!acc[session.subject]) {
                acc[session.subject] = { count: 0, duration: 0 };
            }
            acc[session.subject].count += 1;
            acc[session.subject].duration += session.duration || 0;
            return acc;
        }, {});

        // Calculate study streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let streak = 0;
        let checkDate = new Date(today);

        while (true) {
            const dayStart = new Date(checkDate);
            const dayEnd = new Date(checkDate);
            dayEnd.setHours(23, 59, 59, 999);

            const sessionOnDay = sessions.some(s => 
                s.startTime >= dayStart && s.startTime <= dayEnd
            );

            if (sessionOnDay) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        res.json({
            totalSessions,
            totalDuration,
            avgDuration,
            avgProductivity,
            streak,
            bySubject
        });
    } catch (error) {
        console.error('Get study session stats error:', error);
        res.status(500).json({ error: 'Failed to fetch study session statistics' });
    }
};

// Helper function to update user progress
async function updateUserProgress(userId, session) {
    try {
        let progress = await Progress.findOne({ userId });

        if (!progress) {
            progress = new Progress({ userId });
        }

        // Update statistics
        progress.statistics.totalStudyTime += session.duration || 0;
        progress.statistics.totalSessions += 1;
        progress.lastActive = new Date();

        // Calculate XP based on session (1 XP per minute studied)
        const xpGained = session.duration || 0;
        progress.totalXP += xpGained;

        // Update subject progress
        let subjectProgress = progress.subjects.find(s => s.subject === session.subject);
        if (!subjectProgress) {
            subjectProgress = {
                subject: session.subject,
                level: 1,
                xp: 0,
                topics: [],
                strengths: [],
                weaknesses: []
            };
            progress.subjects.push(subjectProgress);
        } else {
            const index = progress.subjects.findIndex(s => s.subject === session.subject);
            subjectProgress = progress.subjects[index];
        }

        subjectProgress.xp += xpGained;

        // Level up logic (every 1000 XP = 1 level)
        subjectProgress.level = Math.floor(subjectProgress.xp / 1000) + 1;
        progress.overallLevel = Math.floor(progress.totalXP / 1000) + 1;

        await progress.save();
    } catch (error) {
        console.error('Update user progress error:', error);
    }
}
