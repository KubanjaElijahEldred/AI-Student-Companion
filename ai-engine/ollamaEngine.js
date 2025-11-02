import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:10b';

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Conversation context storage
const conversationContexts = new Map();

// No system prompt - use raw model responses
const SYSTEM_PROMPT = null;

// Raw model - no subject-specific prompts needed

// Detect subject from message
function detectSubject(message) {
    const patterns = {
        mathematics: /\b(math|algebra|calculus|geometry|equation|formula|derivative|integral|graph|function|polynomial|trigonometry|statistics|probability)\b/i,
        physics: /\b(physics|force|energy|motion|velocity|acceleration|momentum|mass|gravity|friction|newton|wave|quantum|relativity|electricity|magnetism)\b/i,
        chemistry: /\b(chemistry|molecule|atom|element|compound|reaction|bond|acid|base|pH|oxidation|catalyst|organic|inorganic|electron|proton)\b/i,
        biology: /\b(biology|cell|DNA|gene|organism|evolution|photosynthesis|mitosis|protein|enzyme|bacteria|virus|ecology|anatomy|physiology)\b/i,
        computer_science: /\b(programming|code|algorithm|data structure|function|array|loop|variable|class|object|debug|compile|software|python|javascript|java)\b/i
    };

    for (const [subject, pattern] of Object.entries(patterns)) {
        if (pattern.test(message)) return subject;
    }
    return 'general';
}

// Get or create conversation context
function getContext(sessionId) {
    if (!conversationContexts.has(sessionId)) {
        conversationContexts.set(sessionId, {
            messages: [],
            subject: 'general',
            learningLevel: 'intermediate'
        });
    }
    return conversationContexts.get(sessionId);
}

// Call Ollama API with reasoning
async function callOllama(messages, stream = false) {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                messages: messages,
                stream: stream,
                options: {
                    temperature: parseFloat(process.env.TEMPERATURE) || 0.3,
                    top_p: parseFloat(process.env.TOP_P) || 0.8,
                    num_predict: parseInt(process.env.NUM_PREDICT) || 512
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        if (stream) {
            return response.body;
        }

        const data = await response.json();
        return data.message.content;
    } catch (error) {
        console.error('Ollama API Error:', error.message);
        throw error;
    }
}

// Generate response with advanced reasoning
async function generateResponse(userMessage, sessionId = 'default') {
    const context = getContext(sessionId);
    const subject = detectSubject(userMessage);
    
    // Update context
    context.subject = subject;
    context.messages.push({ role: 'user', content: userMessage });

    // Build enhanced prompt with reasoning
    const enhancedPrompt = `${SYSTEM_PROMPT}

**Current Subject Context:** ${subject.replace('_', ' ').toUpperCase()}

**Subject-Specific Instructions:**
${SUBJECT_PROMPTS[subject] || SUBJECT_PROMPTS.general}

**Student Question:**
${userMessage}

**Your Task:**
1. First, think about what the student is asking
2. Consider their likely knowledge level
3. Plan your explanation structure
4. Provide a clear, comprehensive answer
5. Include examples and encourage further learning

Please provide a detailed, educational response:`;

    // Prepare messages for Ollama
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...context.messages.slice(-8), // Last 8 messages for context
        { role: 'user', content: enhancedPrompt }
    ];

    try {
        const response = await callOllama(messages);
        
        // Add AI response to context
        context.messages.push({ role: 'assistant', content: response });
        
        // Keep context manageable
        if (context.messages.length > 20) {
            context.messages = context.messages.slice(-20);
        }

        return {
            reply: response,
            subject: subject,
            model: OLLAMA_MODEL,
            reasoning: true,
            contextLength: context.messages.length
        };
    } catch (error) {
        console.error('Response generation error:', error);
        throw error;
    }
}

// Routes

// Health check
app.get('/health', async (req, res) => {
    try {
        // Check Ollama connection
        const ollamaResponse = await fetch(`${OLLAMA_URL}/api/tags`);
        const ollamaHealthy = ollamaResponse.ok;
        
        res.json({
            status: ollamaHealthy ? 'online' : 'ollama_offline',
            message: 'AI Engine with Ollama Integration',
            timestamp: new Date().toISOString(),
            ollama: {
                url: OLLAMA_URL,
                model: OLLAMA_MODEL,
                connected: ollamaHealthy
            },
            features: [
                'Ollama LLM Integration',
                'Advanced Reasoning',
                'Multi-Subject Support',
                'Context Memory',
                'Step-by-Step Explanations'
            ]
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: 'Ollama not accessible',
            error: error.message,
            ollama: {
                url: OLLAMA_URL,
                model: OLLAMA_MODEL,
                connected: false
            }
        });
    }
});

// Main chat endpoint - RAW MODEL RESPONSES
app.post('/api/respond', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get conversation context
        const context = getContext(sessionId);
        context.messages.push({ role: 'user', content: message });

        // Use only conversation history - NO SYSTEM PROMPT
        const messages = context.messages.slice(-10); // Last 10 messages for context

        // Call raw model
        const response = await callOllama(messages);
        
        // Add AI response to context
        context.messages.push({ role: 'assistant', content: response });

        res.json({
            response: response,
            sessionId: sessionId,
            model: OLLAMA_MODEL,
            raw: true // Indicate this is a raw response
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            message: error.message,
            fallback: "I'm having trouble connecting to the AI model. Please make sure Ollama is running with the model loaded."
        });
    }
});

// Streaming endpoint for real-time responses
app.post('/api/respond/stream', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const context = getContext(sessionId);
        context.messages.push({ role: 'user', content: message });

        // Use only conversation history - NO SYSTEM PROMPT
        const messages = context.messages.slice(-10);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await callOllama(messages, true);
        
        for await (const chunk of stream) {
            const text = chunk.toString();
            const lines = text.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data.message?.content) {
                        res.write(`data: ${JSON.stringify({ content: data.message.content })}\n\n`);
                    }
                    if (data.done) {
                        res.write('data: [DONE]\n\n');
                        res.end();
                    }
                } catch (e) {
                    // Skip invalid JSON
                }
            }
        }
    } catch (error) {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

// Get conversation context
app.get('/api/context/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const context = getContext(sessionId);
    
    res.json({
        sessionId,
        subject: context.subject,
        messageCount: context.messages.length,
        recentMessages: context.messages.slice(-5)
    });
});

// Clear context
app.delete('/api/context/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    conversationContexts.delete(sessionId);
    
    res.json({
        message: 'Context cleared',
        sessionId
    });
});

// Get available models
app.get('/api/models', async (req, res) => {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/tags`);
        const data = await response.json();
        
        res.json({
            currentModel: OLLAMA_MODEL,
            availableModels: data.models || []
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch models',
            message: error.message
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'AI Student Companion - Ollama Integration',
        version: '3.0.0',
        model: OLLAMA_MODEL,
        endpoints: {
            respond: 'POST /api/respond',
            stream: 'POST /api/respond/stream',
            context: 'GET /api/context/:sessionId',
            clearContext: 'DELETE /api/context/:sessionId',
            models: 'GET /api/models',
            health: 'GET /health'
        },
        features: [
            'Ollama LLM Integration',
            'Advanced Reasoning & Thinking',
            'Multi-Subject Expertise',
            'Context-Aware Conversations',
            'Streaming Responses',
            'Step-by-Step Explanations'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🤖 AI Engine with Ollama Integration`);
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🧠 Model: ${OLLAMA_MODEL}`);
    console.log(`🔗 Ollama: ${OLLAMA_URL}`);
    console.log(`\n✨ Features:`);
    console.log(`   - Advanced Reasoning & Thinking`);
    console.log(`   - Multi-Subject Support`);
    console.log(`   - Context Memory`);
    console.log(`   - Streaming Responses`);
    console.log(`   - Step-by-Step Explanations`);
    console.log(`\n📚 Ready to help students learn!\n`);
});

export default app;
