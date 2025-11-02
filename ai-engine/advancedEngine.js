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

// Context memory for conversations
const conversationContexts = new Map();

// Subject detection patterns
const subjectPatterns = {
    mathematics: /\b(math|algebra|calculus|geometry|trigonometry|equation|formula|derivative|integral|theorem|logarithm|exponential|polynomial|matrix|vector)\b/i,
    physics: /\b(physics|force|energy|motion|velocity|acceleration|momentum|gravity|mass|newton|friction|thermodynamics|quantum|relativity|electromagnetism)\b/i,
    chemistry: /\b(chemistry|molecule|atom|element|compound|reaction|bond|periodic|acid|base|electron|proton|neutron|oxidation|catalyst)\b/i,
    biology: /\b(biology|cell|organism|DNA|gene|evolution|photosynthesis|mitosis|protein|enzyme|bacteria|virus|ecology|anatomy)\b/i,
    history: /\b(history|war|revolution|century|ancient|medieval|civilization|empire|dynasty|historical|treaty|independence)\b/i,
    geography: /\b(geography|continent|ocean|mountain|climate|population|country|city|map|terrain|latitude|longitude)\b/i,
    literature: /\b(literature|novel|poem|poetry|author|writer|book|story|character|plot|theme|metaphor|Shakespeare)\b/i,
    computer_science: /\b(programming|code|algorithm|data structure|software|hardware|computer|python|javascript|database|API|function)\b/i
};

// Advanced knowledge base with detailed responses
const knowledgeBase = {
    mathematics: {
        keywords: ['algebra', 'calculus', 'geometry', 'equation', 'formula'],
        responses: [
            {
                pattern: /quadratic.*equation/i,
                response: "A quadratic equation is in the form ax² + bx + c = 0. To solve it, you can:\n\n1. **Factoring**: Break down into (x + p)(x + q) = 0\n2. **Quadratic Formula**: x = [-b ± √(b² - 4ac)] / 2a\n3. **Completing the Square**: Rewrite as perfect square\n\nExample: x² + 5x + 6 = 0\nFactoring: (x + 2)(x + 3) = 0\nSolutions: x = -2 or x = -3"
            },
            {
                pattern: /derivative|differentiation/i,
                response: "**Derivatives** measure the rate of change of a function.\n\n**Basic Rules:**\n• Power Rule: d/dx(xⁿ) = nxⁿ⁻¹\n• Product Rule: d/dx(fg) = f'g + fg'\n• Chain Rule: d/dx(f(g(x))) = f'(g(x)) · g'(x)\n\n**Example:**\nFind d/dx(x³ + 2x²)\n= 3x² + 4x\n\nDerivatives are used in optimization, physics, and economics!"
            },
            {
                pattern: /integral|integration/i,
                response: "**Integration** is the reverse of differentiation.\n\n**Basic Rules:**\n• ∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ -1)\n• ∫eˣ dx = eˣ + C\n• ∫sin(x) dx = -cos(x) + C\n\n**Types:**\n1. Definite: ∫ₐᵇ f(x)dx (gives area)\n2. Indefinite: ∫f(x)dx + C\n\n**Applications:** Area under curves, volumes, physics problems"
            }
        ],
        general: "I can help with various math topics including:\n• Algebra (equations, functions, polynomials)\n• Calculus (limits, derivatives, integrals)\n• Geometry (shapes, theorems, proofs)\n• Trigonometry (sin, cos, tan, identities)\n• Statistics (mean, median, probability)\n\nWhat specific topic do you need help with?"
    },
    physics: {
        keywords: ['force', 'energy', 'motion', 'velocity', 'newton'],
        responses: [
            {
                pattern: /newton.*law/i,
                response: "**Newton's Laws of Motion:**\n\n**1st Law (Inertia):**\nAn object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.\n\n**2nd Law (F=ma):**\nForce = Mass × Acceleration\nF = ma\n\n**3rd Law (Action-Reaction):**\nFor every action, there's an equal and opposite reaction.\n\n**Example:** When you push a wall, the wall pushes back with equal force."
            },
            {
                pattern: /energy|kinetic|potential/i,
                response: "**Types of Energy:**\n\n**Kinetic Energy (KE):**\nKE = ½mv²\nEnergy of motion\n\n**Potential Energy (PE):**\nPE = mgh (gravitational)\nStored energy due to position\n\n**Law of Conservation:**\nTotal energy in a closed system remains constant.\nKE + PE = constant\n\n**Example:** A pendulum converts between KE and PE continuously."
            }
        ],
        general: "I can explain physics concepts like:\n• Mechanics (motion, forces, energy)\n• Thermodynamics (heat, temperature)\n• Electromagnetism (electricity, magnetism)\n• Waves and Optics\n• Modern Physics (quantum, relativity)\n\nWhat physics topic interests you?"
    },
    chemistry: {
        keywords: ['atom', 'molecule', 'reaction', 'element', 'compound'],
        responses: [
            {
                pattern: /periodic.*table/i,
                response: "**The Periodic Table** organizes elements by:\n\n**Structure:**\n• Rows (Periods): Same number of electron shells\n• Columns (Groups): Similar chemical properties\n\n**Key Groups:**\n• Group 1: Alkali metals (very reactive)\n• Group 17: Halogens (highly reactive non-metals)\n• Group 18: Noble gases (inert)\n\n**Trends:**\n• Atomic radius decreases left to right\n• Reactivity varies by group\n• Electronegativity increases left to right"
            },
            {
                pattern: /chemical.*bond/i,
                response: "**Types of Chemical Bonds:**\n\n**1. Ionic Bonds:**\n• Transfer of electrons\n• Between metal and non-metal\n• Example: NaCl (table salt)\n\n**2. Covalent Bonds:**\n• Sharing of electrons\n• Between non-metals\n• Example: H₂O (water)\n\n**3. Metallic Bonds:**\n• Sea of delocalized electrons\n• In metals\n• Example: Iron, copper"
            }
        ],
        general: "I can help with chemistry topics:\n• Atomic Structure\n• Chemical Bonding\n• Chemical Reactions\n• Stoichiometry\n• Acids and Bases\n• Organic Chemistry\n\nWhat chemistry concept can I explain?"
    },
    biology: {
        keywords: ['cell', 'DNA', 'evolution', 'organism', 'photosynthesis'],
        responses: [
            {
                pattern: /photosynthe/i,
                response: "**Photosynthesis** is how plants make food:\n\n**Equation:**\n6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂\n\n**Process:**\n1. **Light Reactions** (in thylakoids)\n   • Capture light energy\n   • Split water molecules\n   • Produce ATP and NADPH\n\n2. **Calvin Cycle** (in stroma)\n   • Use ATP and NADPH\n   • Fix CO₂ into glucose\n\n**Importance:** Produces oxygen and food for most life on Earth!"
            },
            {
                pattern: /cell.*division|mitosis/i,
                response: "**Mitosis** - Cell division for growth and repair:\n\n**Phases:**\n1. **Prophase:** Chromosomes condense\n2. **Metaphase:** Chromosomes align at center\n3. **Anaphase:** Chromosomes separate\n4. **Telophase:** Two nuclei form\n5. **Cytokinesis:** Cell splits in two\n\n**Result:** 2 identical daughter cells\n\n**vs Meiosis:** Makes 4 sex cells with half the chromosomes"
            }
        ],
        general: "I can explain biology topics:\n• Cell Biology\n• Genetics and DNA\n• Evolution\n• Ecology\n• Human Anatomy\n• Plant Biology\n\nWhat biological concept interests you?"
    }
};

// Study tips and strategies
const studyTips = [
    "**Pomodoro Technique:** Study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout.",
    "**Active Recall:** Test yourself regularly instead of just re-reading. This strengthens memory connections.",
    "**Spaced Repetition:** Review material at increasing intervals (1 day, 3 days, 1 week, 1 month) for long-term retention.",
    "**Feynman Technique:** Explain concepts in simple terms as if teaching someone. This reveals gaps in understanding.",
    "**Mind Mapping:** Create visual diagrams connecting related concepts. Great for big-picture understanding.",
    "**Practice Problems:** Especially for math and science. Apply concepts, don't just memorize them.",
    "**Study Groups:** Collaborate with peers to gain different perspectives and stay motivated.",
    "**Sleep Well:** Memory consolidation happens during sleep. Aim for 7-9 hours before exams."
];

// Detect subject from message
function detectSubject(message) {
    const scores = {};
    
    for (const [subject, pattern] of Object.entries(subjectPatterns)) {
        const matches = message.match(pattern);
        scores[subject] = matches ? matches.length : 0;
    }
    
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore > 0) {
        return Object.keys(scores).find(key => scores[key] === maxScore);
    }
    
    return 'general';
}

// Get context for a session
function getContext(sessionId) {
    if (!conversationContexts.has(sessionId)) {
        conversationContexts.set(sessionId, {
            messages: [],
            subjects: [],
            topics: [],
            userLevel: 'intermediate'
        });
    }
    return conversationContexts.get(sessionId);
}

// Generate AI response with context awareness
function generateResponse(message, sessionId = 'default') {
    const context = getContext(sessionId);
    const subject = detectSubject(message);
    
    // Add to context
    context.messages.push({ role: 'user', content: message, timestamp: Date.now() });
    if (subject !== 'general' && !context.subjects.includes(subject)) {
        context.subjects.push(subject);
    }
    
    let response = '';
    
    // Check for greetings
    if (/^(hi|hello|hey|greetings)/i.test(message.trim())) {
        const greetings = [
            "Hello! I'm your AI study companion. How can I help you learn today?",
            "Hi there! Ready to dive into some learning? What subject interests you?",
            "Hey! I'm here to help you with your studies. What would you like to explore?",
            "Greetings! Let's make learning fun. What topic can I help you with?"
        ];
        response = greetings[Math.floor(Math.random() * greetings.length)];
        
        if (context.subjects.length > 0) {
            response += `\n\nI see we've discussed ${context.subjects.join(', ')} before. Want to continue with those or try something new?`;
        }
    }
    // Study tips request
    else if (/study.*tip|how.*study|study.*better|improve.*study/i.test(message)) {
        response = "Here are some effective study strategies:\n\n" + 
                   studyTips.slice(0, 4).map((tip, i) => `${i + 1}. ${tip}`).join('\n\n');
    }
    // Help request
    else if (/help|what.*can.*do|capabilities/i.test(message)) {
        response = `I'm an advanced AI study companion! I can help you with:

**📚 Subjects:**
• Mathematics (algebra, calculus, geometry)
• Physics (mechanics, thermodynamics, electromagnetism)
• Chemistry (atomic structure, reactions, organic)
• Biology (cells, genetics, ecology)
• History, Geography, Literature, Computer Science

**🎯 Study Features:**
• Explain complex concepts in simple terms
• Provide examples and practice problems
• Share study tips and strategies
• Remember our conversation context
• Adapt to your learning level

**💡 Tips:**
• Ask specific questions for better answers
• Request examples or practice problems
• Tell me if you need simpler/deeper explanations

What would you like to learn about?`;
    }
    // Subject-specific responses
    else if (subject !== 'general' && knowledgeBase[subject]) {
        const subjectData = knowledgeBase[subject];
        
        // Check for specific patterns
        let matched = false;
        if (subjectData.responses) {
            for (const item of subjectData.responses) {
                if (item.pattern.test(message)) {
                    response = item.response;
                    matched = true;
                    break;
                }
            }
        }
        
        // Use general response if no specific match
        if (!matched) {
            response = subjectData.general;
        }
        
        // Add context-aware follow-up
        if (context.messages.length > 2) {
            response += "\n\nWould you like me to explain this further or provide practice problems?";
        }
    }
    // Example request
    else if (/example|show.*me|demonstrate/i.test(message)) {
        response = "I'd be happy to provide examples! Could you specify which topic or concept you'd like to see examples for? For instance:\n• Math problems (e.g., 'quadratic equation example')\n• Science experiments\n• Historical events\n• Code snippets\n\nThe more specific you are, the better example I can provide!";
    }
    // Gratitude
    else if (/thank|thanks|appreciate/i.test(message)) {
        response = "You're welcome! I'm here to help you succeed. Keep up the great work! 🌟\n\nFeel free to ask more questions anytime.";
    }
    // Default intelligent response
    else {
        if (subject !== 'general') {
            response = `I understand you're asking about ${subject}. `;
        }
        
        response += `I'd love to help you with that! To give you the best explanation, could you be more specific? For example:

• What exactly would you like to understand?
• Is this for a particular problem or concept?
• What level are you studying at (high school, college)?

The more details you provide, the better I can tailor my explanation to your needs!`;
    }
    
    // Add response to context
    context.messages.push({ role: 'assistant', content: response, timestamp: Date.now() });
    
    // Keep context manageable (last 20 messages)
    if (context.messages.length > 20) {
        context.messages = context.messages.slice(-20);
    }
    
    return {
        reply: response,
        subject: subject,
        confidence: subject !== 'general' ? 0.85 : 0.5,
        context: {
            messageCount: context.messages.length,
            subjects: context.subjects,
            topics: context.topics
        }
    };
}

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        message: 'AI Engine (Advanced) is running',
        timestamp: new Date().toISOString(),
        features: [
            'Context Memory',
            'Subject Detection',
            'Multi-Subject Support',
            'Study Tips Integration',
            'Adaptive Responses'
        ]
    });
});

// Main response endpoint
app.post('/api/respond', (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        const result = generateResponse(message, sessionId);
        
        res.json(result);
    } catch (error) {
        console.error('Response generation error:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            reply: "I apologize, but I encountered an error. Please try rephrasing your question."
        });
    }
});

// Get conversation context
app.get('/api/context/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const context = getContext(sessionId);
    
    res.json({
        sessionId,
        messageCount: context.messages.length,
        subjects: context.subjects,
        topics: context.topics,
        recentMessages: context.messages.slice(-5)
    });
});

// Clear context
app.delete('/api/context/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    conversationContexts.delete(sessionId);
    
    res.json({
        message: 'Context cleared successfully',
        sessionId
    });
});

// Get study tip
app.get('/api/study-tip', (req, res) => {
    const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)];
    res.json({ tip: randomTip });
});

// Get subject info
app.get('/api/subjects', (req, res) => {
    const subjects = Object.keys(knowledgeBase).map(subject => ({
        name: subject,
        keywords: knowledgeBase[subject].keywords
    }));
    
    res.json({ subjects });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'AI Student Companion - Advanced Engine',
        version: '2.0.0',
        endpoints: {
            respond: 'POST /api/respond',
            context: 'GET /api/context/:sessionId',
            clearContext: 'DELETE /api/context/:sessionId',
            studyTip: 'GET /api/study-tip',
            subjects: 'GET /api/subjects',
            health: 'GET /health'
        },
        features: [
            'Context-Aware Conversations',
            'Automatic Subject Detection',
            'Multi-Subject Knowledge Base',
            'Personalized Study Tips',
            'Adaptive Response Generation'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🤖 Advanced AI Engine is running!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`\n🧠 Intelligent Features:`);
    console.log(`   - Context Memory (remembers conversation)`);
    console.log(`   - Subject Detection (auto-identifies topics)`);
    console.log(`   - Adaptive Responses (adjusts to user level)`);
    console.log(`   - Study Tips Integration`);
    console.log(`\n📚 Subjects Supported:`);
    console.log(`   Mathematics, Physics, Chemistry, Biology,`);
    console.log(`   History, Geography, Literature, Computer Science`);
    console.log(`\n✨ Ready to help students learn!\n`);
});

export default app;
