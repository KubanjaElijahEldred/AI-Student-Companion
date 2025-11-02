import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import studyNoteRoutes from './routes/studyNoteRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import studySessionRoutes from './routes/studySessionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-student-companion', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        message: 'AI Student Companion Backend (Advanced) is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notes', studyNoteRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/sessions', studySessionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'AI Student Companion - Advanced Backend API',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            chat: '/api/chat',
            notes: '/api/notes',
            flashcards: '/api/flashcards',
            sessions: '/api/sessions',
            quizzes: '/api/quizzes',
            progress: '/api/progress',
            health: '/api/health'
        },
        features: [
            'User Authentication',
            'AI Chat Integration',
            'Study Notes Management',
            'Spaced Repetition Flashcards',
            'Study Session Tracking',
            'Quiz Generation & Grading',
            'Progress Analytics',
            'Achievements & Gamification',
            'Leaderboard System'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Advanced Backend Server is running!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
    console.log(`\n✨ Advanced Features Enabled:`);
    console.log(`   - Study Notes with Search`);
    console.log(`   - Spaced Repetition Flashcards`);
    console.log(`   - Study Session Analytics`);
    console.log(`   - Quiz Generation & Grading`);
    console.log(`   - Progress Tracking & XP System`);
    console.log(`   - Achievements & Leaderboard`);
    console.log(`\n📚 Happy Learning!\n`);
});

export default app;
