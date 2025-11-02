import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'simple-secret-key-2024';
const AI_ENGINE_URL = 'http://localhost:3001';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const users = new Map();
const messages = new Map();

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        if (users.has(email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user
        const userId = Date.now().toString();
        users.set(email, {
            id: userId,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        console.log(`✅ User registered: ${username} (${email})`);

        res.json({
            message: 'Registration successful',
            user: { id: userId, username, email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = users.get(email);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        console.log(`✅ User logged in: ${user.username} (${email})`);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied - No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Chat endpoint
app.post('/api/chat', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        console.log(`💬 User ${userId} asked: "${content}"`);

        // Get AI response
        const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/respond`, {
            message: content
        }, {
            timeout: 5000
        });

        const reply = aiResponse.data.reply;

        console.log(`🤖 AI replied: "${reply}"`);

        // Store message
        const messageId = Date.now().toString();
        const messageData = {
            id: messageId,
            userId,
            content,
            response: reply,
            timestamp: new Date()
        };

        // Store in user's history
        if (!messages.has(userId)) {
            messages.set(userId, []);
        }
        messages.get(userId).push(messageData);

        res.json({
            id: messageId,
            userId,
            content,
            response: reply,
            timestamp: messageData.timestamp
        });
    } catch (error) {
        console.error('Chat error:', error);

        if (error.code === 'ECONNREFUSED') {
            res.status(503).json({
                error: 'AI Engine is offline. Please start it on port 3001.'
            });
        } else if (error.response) {
            res.status(500).json({
                error: `AI service error: ${error.response.statusText}`
            });
        } else {
            res.status(500).json({
                error: 'Chat service temporarily unavailable'
            });
        }
    }
});

// Chat history endpoint
app.get('/api/chat/history', authMiddleware, (req, res) => {
    try {
        const userId = req.user.id;
        const userMessages = messages.get(userId) || [];
        const limit = parseInt(req.query.limit) || 50;
        const recentMessages = userMessages.slice(-limit);

        res.json({
            messages: recentMessages,
            totalCount: userMessages.length
        });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Unable to retrieve chat history' });
    }
});

// Get stats
app.get('/api/stats', (req, res) => {
    res.json({
        totalUsers: users.size,
        totalMessages: Array.from(messages.values()).reduce((sum, msgs) => sum + msgs.length, 0),
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🤖 AI Student Companion - Simple Backend Server',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            health: 'GET /api/health',
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            chat: 'POST /api/chat (requires auth)',
            history: 'GET /api/chat/history (requires auth)',
            stats: 'GET /api/stats'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('  🚀 BACKEND SERVER STARTED');
    console.log('========================================');
    console.log(`  Port: ${PORT}`);
    console.log(`  Status: RUNNING ✅`);
    console.log(`  Health: http://localhost:${PORT}/api/health`);
    console.log(`  AI Engine: ${AI_ENGINE_URL}`);
    console.log('========================================');
    console.log('  Keep this window OPEN!');
    console.log('  Press Ctrl+C to stop');
    console.log('========================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Backend server shutting down...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Backend server shutting down...');
    process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.log('Server will continue running...');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    console.log('Server will continue running...');
});

export default app;
