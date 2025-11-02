import { Quiz, QuizResult } from '../models/Quiz.js';
import Progress from '../models/Progress.js';

// Create a new quiz
export const createQuiz = async (req, res) => {
    try {
        const { title, subject, difficulty, questions, timeLimit } = req.body;

        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({ error: 'Title and questions are required' });
        }

        const quiz = new Quiz({
            userId: req.user._id,
            title,
            subject,
            difficulty,
            questions,
            timeLimit
        });

        await quiz.save();
        res.status(201).json({ message: 'Quiz created successfully', quiz });
    } catch (error) {
        console.error('Create quiz error:', error);
        res.status(500).json({ error: 'Failed to create quiz' });
    }
};

// Get all quizzes
export const getQuizzes = async (req, res) => {
    try {
        const { subject, difficulty } = req.query;

        let query = { userId: req.user._id };

        if (subject) query.subject = subject;
        if (difficulty) query.difficulty = difficulty;

        const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
        res.json({ quizzes });
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
};

// Get a single quiz
export const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Return quiz without correct answers
        const quizData = quiz.toObject();
        quizData.questions = quizData.questions.map(q => ({
            question: q.question,
            options: q.options,
            points: q.points
        }));

        res.json({ quiz: quizData });
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
};

// Submit quiz answers
export const submitQuiz = async (req, res) => {
    try {
        const { answers, timeTaken } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Answers are required' });
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Grade the quiz
        let score = 0;
        const gradedAnswers = answers.map((answer, index) => {
            const question = quiz.questions[index];
            const isCorrect = answer.selectedAnswer === question.correctAnswer;

            if (isCorrect) {
                score += question.points || 1;
            }

            return {
                questionIndex: index,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                timeTaken: answer.timeTaken || 0,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            };
        });

        const totalQuestions = quiz.questions.length;
        const percentage = (score / totalQuestions) * 100;

        // Save quiz result
        const quizResult = new QuizResult({
            userId: req.user._id,
            quizId: quiz._id,
            answers: gradedAnswers,
            score,
            totalQuestions,
            percentage,
            timeTaken
        });

        await quizResult.save();

        // Update user progress
        await updateProgressFromQuiz(req.user._id, quiz, percentage);

        res.json({
            message: 'Quiz submitted successfully',
            result: {
                score,
                totalQuestions,
                percentage: percentage.toFixed(2),
                timeTaken,
                answers: gradedAnswers
            }
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
};

// Get quiz results
export const getQuizResults = async (req, res) => {
    try {
        const results = await QuizResult.find({ userId: req.user._id })
            .populate('quizId', 'title subject difficulty')
            .sort({ completedAt: -1 });

        res.json({ results });
    } catch (error) {
        console.error('Get quiz results error:', error);
        res.status(500).json({ error: 'Failed to fetch quiz results' });
    }
};

// Get quiz statistics
export const getQuizStats = async (req, res) => {
    try {
        const results = await QuizResult.find({ userId: req.user._id });

        const totalQuizzes = results.length;
        const avgScore = totalQuizzes > 0
            ? (results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes).toFixed(2)
            : 0;

        const bySubject = {};
        for (const result of results) {
            const quiz = await Quiz.findById(result.quizId);
            if (quiz) {
                if (!bySubject[quiz.subject]) {
                    bySubject[quiz.subject] = { count: 0, avgScore: 0, scores: [] };
                }
                bySubject[quiz.subject].count += 1;
                bySubject[quiz.subject].scores.push(result.percentage);
            }
        }

        // Calculate average for each subject
        Object.keys(bySubject).forEach(subject => {
            const scores = bySubject[subject].scores;
            bySubject[subject].avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
            delete bySubject[subject].scores;
        });

        res.json({
            totalQuizzes,
            avgScore,
            bySubject
        });
    } catch (error) {
        console.error('Get quiz stats error:', error);
        res.status(500).json({ error: 'Failed to fetch quiz statistics' });
    }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Also delete associated results
        await QuizResult.deleteMany({ quizId: quiz._id });

        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
};

// Generate AI quiz (placeholder for AI integration)
export const generateAIQuiz = async (req, res) => {
    try {
        const { subject, difficulty, topic, questionCount = 5 } = req.body;

        if (!subject || !topic) {
            return res.status(400).json({ error: 'Subject and topic are required' });
        }

        // This is a placeholder - in production, integrate with AI service
        const sampleQuestions = [];
        for (let i = 0; i < questionCount; i++) {
            sampleQuestions.push({
                question: `Sample question ${i + 1} about ${topic} in ${subject}?`,
                options: [
                    'Option A',
                    'Option B',
                    'Option C',
                    'Option D'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
                explanation: `Explanation for question ${i + 1}`,
                points: 1
            });
        }

        const quiz = new Quiz({
            userId: req.user._id,
            title: `AI Generated Quiz: ${topic}`,
            subject,
            difficulty: difficulty || 'medium',
            questions: sampleQuestions,
            timeLimit: questionCount * 2 // 2 minutes per question
        });

        await quiz.save();

        res.status(201).json({
            message: 'AI quiz generated successfully',
            quiz,
            note: 'This is a sample implementation. Integrate with AI API for real questions.'
        });
    } catch (error) {
        console.error('Generate AI quiz error:', error);
        res.status(500).json({ error: 'Failed to generate AI quiz' });
    }
};

// Helper function to update progress from quiz
async function updateProgressFromQuiz(userId, quiz, percentage) {
    try {
        let progress = await Progress.findOne({ userId });

        if (!progress) {
            progress = new Progress({ userId });
        }

        progress.statistics.totalQuizzesTaken += 1;

        // Update average quiz score
        const totalQuizzes = progress.statistics.totalQuizzesTaken;
        const currentAvg = progress.statistics.averageQuizScore;
        progress.statistics.averageQuizScore = ((currentAvg * (totalQuizzes - 1)) + percentage) / totalQuizzes;

        // Award XP based on score (max 50 XP per quiz)
        const xpGained = Math.round((percentage / 100) * 50);
        progress.totalXP += xpGained;

        // Update subject progress
        let subjectProgress = progress.subjects.find(s => s.subject === quiz.subject);
        if (!subjectProgress) {
            subjectProgress = {
                subject: quiz.subject,
                level: 1,
                xp: 0,
                topics: [],
                strengths: [],
                weaknesses: []
            };
            progress.subjects.push(subjectProgress);
        } else {
            const index = progress.subjects.findIndex(s => s.subject === quiz.subject);
            subjectProgress = progress.subjects[index];
        }

        subjectProgress.xp += xpGained;
        subjectProgress.level = Math.floor(subjectProgress.xp / 1000) + 1;
        progress.overallLevel = Math.floor(progress.totalXP / 1000) + 1;

        // Check for achievements
        if (totalQuizzes === 1) {
            progress.achievements.push({
                name: 'First Quiz',
                description: 'Completed your first quiz',
                unlockedAt: new Date(),
                icon: '🎯'
            });
        }

        if (percentage === 100) {
            progress.achievements.push({
                name: 'Perfect Score',
                description: 'Got 100% on a quiz',
                unlockedAt: new Date(),
                icon: '🌟'
            });
        }

        await progress.save();
    } catch (error) {
        console.error('Update progress from quiz error:', error);
    }
}
