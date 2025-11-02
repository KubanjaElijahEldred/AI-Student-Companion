// Chat Manager - Pure JavaScript
class ChatManager {
    constructor() {
        this.apiBase = 'http://localhost:5001/api';
        this.aiEngineBase = 'http://localhost:3001/api';
        this.chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    }

    async sendMessage(message) {
        try {
            // Try backend API first
            const response = await this.sendToBackend(message);
            this.saveChatMessage(message, response);
            return response;
        } catch (error) {
            console.warn('Backend unavailable, trying AI engine directly:', error.message);
            try {
                // Fallback to AI engine directly
                const response = await this.sendToAIEngine(message);
                this.saveChatMessage(message, response);
                return response;
            } catch (aiError) {
                console.warn('AI engine unavailable, using fallback:', aiError.message);
                // Final fallback to local responses
                const response = this.getFallbackResponse(message);
                this.saveChatMessage(message, response);
                return response;
            }
        }
    }

    async sendToBackend(message) {
        const authManager = new AuthManager();
        const token = authManager.getAuthToken();

        const response = await fetch(`${this.apiBase}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token || ''
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        return data.response || data.message || 'No response received';
    }

    async sendToAIEngine(message) {
        const response = await fetch(`${this.aiEngineBase}/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`AI Engine error: ${response.status}`);
        }

        const data = await response.json();
        return data.response || data.message || 'No response received';
    }

    getFallbackResponse(message) {
        const responses = {
            greetings: [
                "Hello! I'm Mr. Elijah, your AI study companion. How can I help you today?",
                "Hi there! Ready to learn something new?",
                "Welcome back! What would you like to study today?"
            ],
            math: [
                "Math is all about patterns and logic! What specific math topic would you like help with?",
                "I'd be happy to help with mathematics! Are you working on algebra, geometry, calculus, or something else?",
                "Mathematics can be challenging but rewarding. What math problem are you trying to solve?"
            ],
            science: [
                "Science is fascinating! Are you interested in physics, chemistry, biology, or another science subject?",
                "I love helping with science questions! What scientific concept would you like to explore?",
                "Science helps us understand the world around us. What would you like to learn about?"
            ],
            history: [
                "History teaches us about the past and helps us understand the present. What historical period interests you?",
                "I can help with various historical topics! What would you like to know about?",
                "History is full of interesting stories and lessons. What historical question do you have?"
            ],
            general: [
                "That's an interesting question! While I may not have all the answers, I'm here to help you learn and think critically about topics.",
                "I'd be happy to help you explore that topic! Can you tell me more about what specifically you'd like to know?",
                "Learning is a journey, and I'm here to support you along the way. What would you like to focus on?"
            ]
        };

        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return this.getRandomResponse(responses.greetings);
        } else if (lowerMessage.includes('math') || lowerMessage.includes('algebra') || lowerMessage.includes('calculus') || lowerMessage.includes('geometry')) {
            return this.getRandomResponse(responses.math);
        } else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
            return this.getRandomResponse(responses.science);
        } else if (lowerMessage.includes('history') || lowerMessage.includes('historical')) {
            return this.getRandomResponse(responses.history);
        } else {
            return this.getRandomResponse(responses.general);
        }
    }

    getRandomResponse(responseArray) {
        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }

    saveChatMessage(userMessage, aiResponse) {
        const chatEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            userMessage,
            aiResponse
        };

        this.chatHistory.push(chatEntry);
        
        // Keep only last 50 messages to prevent storage bloat
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(-50);
        }

        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
    }

    getChatHistory() {
        return this.chatHistory;
    }

    clearChatHistory() {
        this.chatHistory = [];
        localStorage.removeItem('chatHistory');
    }

    async loadChatHistory() {
        try {
            const authManager = new AuthManager();
            const token = authManager.getAuthToken();

            const response = await fetch(`${this.apiBase}/chat/history`, {
                headers: {
                    'Authorization': token || ''
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.history || [];
            }
        } catch (error) {
            console.warn('Could not load chat history from server:', error.message);
        }

        // Return local history as fallback
        return this.chatHistory;
    }
}
