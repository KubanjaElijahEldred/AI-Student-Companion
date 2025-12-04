import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.AI_ENGINE_PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

// Middleware
app.use(cors());
app.use(express.json());

// Direct Ollama API integration
async function getOllamaResponse(message) {
    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: OLLAMA_MODEL,
            prompt: message,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 500
            }
        });
        
        return response.data.response;
    } catch (error) {
        console.error('Ollama API error:', error.message);
        return null;
    }
}

// API endpoint for intelligent responses
app.post('/api/respond', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`\n📨 User: "${message}"`);

        // Try to get response from Ollama first
        const ollamaResponse = await getOllamaResponse(message);
        
        if (ollamaResponse) {
            console.log(`🤖 Ollama Response: [${ollamaResponse.substring(0, 50)}...]`);
            
            res.json({
                response: ollamaResponse,
                reply: ollamaResponse,
                category: 'ollama',
                model: OLLAMA_MODEL,
            });
        } else {
            // Fallback if Ollama is not available
            const fallbackResponse = "I'm having trouble connecting to my AI model. Please make sure Ollama is running with '" + OLLAMA_MODEL + "' model installed. You can start it by running 'ollama serve' in your terminal.";
            
            console.log(`❌ Fallback Response: [${fallbackResponse.substring(0, 50)}...]`);
            
            res.json({
                response: fallbackResponse,
                reply: fallbackResponse,
                category: 'fallback',
                error: 'Ollama unavailable'
            });
        }

    } catch (error) {
        console.error('❌ Error generating response:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            message: 'Please try rephrasing your question or check if Ollama is running'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: '✅ ONLINE',
        model: 'llama3.2:1b via Ollama',
        port: PORT,
        ollama_url: OLLAMA_URL,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log('==================================================');
    console.log('🧠 OLLAMA-POWERED AI ENGINE STARTED');
    console.log('==================================================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 Ollama URL: ${OLLAMA_URL}`);
    console.log(`🤖 Model: ${OLLAMA_MODEL}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log('==================================================');
    console.log('🚀 UNLIMITED AI CAPABILITIES ENABLED');
    console.log('   • General knowledge');
    console.log('   • Complex reasoning');
    console.log('   • Scientific explanations');
    console.log('   • Mathematical problem solving');
    console.log('   • Historical analysis');
    console.log('   • And much more...');
    console.log('==================================================');
    console.log('⚠️  Make sure Ollama is running:');
    console.log('   1. Install Ollama: https://ollama.ai');
    console.log('   2. Run: ollama serve');
    console.log('   3. Install model: ollama pull llama3.2:1b');
    console.log('==================================================');
    console.log('Keep this window OPEN!');
    console.log('Press Ctrl+C to stop');
    console.log('==================================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down AI Engine gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received, shutting down...');
    process.exit(0);
});
