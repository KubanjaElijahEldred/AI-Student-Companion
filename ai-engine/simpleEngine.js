import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// Simple AI responses
const aiResponses = {
    greeting: [
        "Hello! I'm your AI study assistant. How can I help you today?",
        "Hi there! Ready to learn something new? What would you like to study?",
        "Greetings! I'm here to help with your studies. What topic are you working on?"
    ],
    math: [
        "Mathematics is the language of the universe! I can help with algebra, calculus, geometry, and more.",
        "Let's solve that math problem together. Remember: every complex problem is made of simple steps.",
        "Math is all about patterns and logic. Practice consistently and you'll see great improvement!"
    ],
    science: [
        "Science helps us understand the world around us. What scientific topic interests you?",
        "From physics to biology, science explains how things work. Let's explore together!",
        "The scientific method is your best friend: observe, hypothesize, test, and conclude."
    ],
    study: [
        "Effective studying involves active recall, spaced repetition, and regular breaks.",
        "Try the Pomodoro Technique: 25 minutes of focused study, then 5-minute break.",
        "Teaching someone else is one of the best ways to solidify your own understanding."
    ],
    default: [
        "That's an interesting question! Let me think about how I can best help you.",
        "I'm here to assist with your learning journey. Could you tell me more about what you need?",
        "Great question! Let's explore this topic together and find the answers you need."
    ]
};

// Get response based on message content
function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
    }
    
    if (lowerMessage.includes('math') || lowerMessage.includes('calculus') || lowerMessage.includes('algebra')) {
        return aiResponses.math[Math.floor(Math.random() * aiResponses.math.length)];
    }
    
    if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
        return aiResponses.science[Math.floor(Math.random() * aiResponses.science.length)];
    }
    
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('help')) {
        return aiResponses.study[Math.floor(Math.random() * aiResponses.study.length)];
    }
    
    return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        message: 'Simple AI Engine is running',
        timestamp: new Date().toISOString()
    });
});

// Get supported subjects
app.get('/api/subjects', (req, res) => {
    res.json({
        subjects: [
            { name: 'mathematics', keywords: ['algebra', 'calculus', 'geometry', 'equation', 'formula'] },
            { name: 'physics', keywords: ['force', 'energy', 'motion', 'velocity', 'newton'] },
            { name: 'chemistry', keywords: ['atom', 'molecule', 'reaction', 'element', 'compound'] },
            { name: 'biology', keywords: ['cell', 'DNA', 'evolution', 'organism', 'photosynthesis'] },
            { name: 'history', keywords: ['history', 'war', 'revolution', 'ancient', 'civilization'] },
            { name: 'literature', keywords: ['literature', 'novel', 'poem', 'author', 'story'] }
        ]
    });
});

// Get study tip
app.get('/api/study-tip', (req, res) => {
    const tips = [
        "Take breaks every 25-30 minutes to maintain focus and retention.",
        "Use active recall instead of passive reading for better memory formation.",
        "Connect new information to what you already know for better understanding.",
        "Teach concepts to others to solidify your own understanding.",
        "Use visual aids like diagrams and mind maps to organize information.",
        "Get enough sleep - memory consolidation happens during rest.",
        "Stay hydrated and well-fed for optimal brain function.",
        "Create a dedicated study space free from distractions.",
        "Use the Feynman technique: explain concepts in simple terms.",
        "Practice problems regularly, especially in math and science."
    ];
    
    res.json({
        tip: tips[Math.floor(Math.random() * tips.length)]
    });
});

// Main AI response endpoint
app.post('/api/respond', (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        const response = getAIResponse(message);
        
        res.json({
            response,
            sessionId,
            timestamp: new Date().toISOString(),
            subject: detectSubject(message)
        });
        
    } catch (error) {
        console.error('AI Engine Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'I had trouble processing your request. Please try again.'
        });
    }
});

// Simple subject detection
function detectSubject(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('math') || lowerMessage.includes('calculus') || lowerMessage.includes('algebra')) return 'mathematics';
    if (lowerMessage.includes('physics') || lowerMessage.includes('force') || lowerMessage.includes('energy')) return 'physics';
    if (lowerMessage.includes('chemistry') || lowerMessage.includes('atom') || lowerMessage.includes('molecule')) return 'chemistry';
    if (lowerMessage.includes('biology') || lowerMessage.includes('cell') || lowerMessage.includes('dna')) return 'biology';
    if (lowerMessage.includes('history') || lowerMessage.includes('war') || lowerMessage.includes('ancient')) return 'history';
    if (lowerMessage.includes('literature') || lowerMessage.includes('novel') || lowerMessage.includes('poem')) return 'literature';
    
    return 'general';
}

// Get conversation context (placeholder)
app.get('/api/context/:sessionId', (req, res) => {
    res.json({
        sessionId: req.params.sessionId,
        messages: [],
        subjects: [],
        topics: []
    });
});

// Clear conversation context (placeholder)
app.delete('/api/context/:sessionId', (req, res) => {
    res.json({
        message: 'Context cleared',
        sessionId: req.params.sessionId
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Simple AI Student Companion Engine',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            respond: '/api/respond',
            subjects: '/api/subjects',
            studyTip: '/api/study-tip',
            context: '/api/context/:sessionId'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Simple AI Engine is running!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`⚡ Features: Basic AI responses, subject detection, study tips`);
    console.log(`📚 Ready to assist with learning!\n`);
});

export default app;
