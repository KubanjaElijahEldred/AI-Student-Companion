import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Advanced Knowledge Base with Smart Educational Responses
const knowledgeBase = {
    mathematics: {
        keywords: ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'equation', 'solve', 'calculate', 'number', 'formula', 'derivative', 'integral', 'trigonometry', 'statistics', 'quadratic', 'linear', 'polynomial'],
        responses: [
            "📐 **Mathematics Help**\n\nMathematics is the language of patterns and logic! Let me break this down for you:\n\n**Core Math Areas:**\n• **Algebra** - Solving equations, working with variables (x, y, z)\n• **Calculus** - Study of change (derivatives) and accumulation (integrals)\n• **Geometry** - Shapes, angles, spatial relationships\n• **Statistics** - Data analysis, probability, trends\n• **Trigonometry** - Triangles, angles, waves (sin, cos, tan)\n\n**Problem-Solving Steps:**\n1. Read the problem carefully - what's being asked?\n2. Identify what you know (given information)\n3. Choose the right formula or method\n4. Work through step-by-step\n5. Check: Does your answer make sense?\n\n**Pro Tips:**\n✓ Practice daily (even 15 minutes helps!)\n✓ Show all your work\n✓ Draw diagrams when possible\n✓ Check by plugging answer back in\n\nWhat specific math topic can I help you with?",

            "🔢 **Let's Master Mathematics Together!**\n\nMath isn't about memorization - it's about understanding patterns!\n\n**Key Formulas You Should Know:**\n\n**Algebra:**\n• Quadratic Formula: x = (-b ± √(b²-4ac)) / 2a\n• Slope: m = (y₂-y₁) / (x₂-x₁)\n• Distance: d = √((x₂-x₁)² + (y₂-y₁)²)\n\n**Geometry:**\n• Area of Circle: A = πr²\n• Pythagorean Theorem: a² + b² = c²\n• Volume of Sphere: V = (4/3)πr³\n\n**Calculus:**\n• Power Rule: d/dx(xⁿ) = nxⁿ⁻¹\n• Product Rule: d/dx(uv) = u'v + uv'\n• ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n\n**Study Strategy:**\n→ Understand concepts, not just formulas\n→ Work through examples\n→ Teach someone else (best way to learn!)\n\nWhat math problem are you working on?"
        ]
    },

    biology: {
        keywords: ['biology', 'cell', 'photosynthesis', 'DNA', 'RNA', 'evolution', 'organism', 'ecosystem', 'protein', 'gene', 'bacteria', 'plant', 'animal', 'mitosis', 'meiosis'],
        responses: [
            "🧬 **Biology - The Science of Life!**\n\n**Photosynthesis Explained:**\nPlants are nature's food factories!\n\n**The Process:**\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\n**Step by Step:**\n1. **Chlorophyll** in leaves captures sunlight\n2. **Roots** absorb water (H₂O) from soil\n3. **Leaves** take in CO₂ from air through stomata\n4. **Light reactions** split water, release O₂\n5. **Calvin cycle** produces glucose (sugar)\n\n**Why It Matters:**\n✓ Produces oxygen we breathe\n✓ Creates food for entire food chain\n✓ Removes CO₂ from atmosphere\n✓ Without it, no life on Earth!\n\n**Fun Fact:** One large tree produces enough oxygen for 2 people per year!\n\nWhat else about biology interests you?",

            "🔬 **Cell Biology - Building Blocks of Life**\n\n**Inside a Cell:**\n\n**Cell Membrane** - Protective outer layer (like a security guard)\n• Controls what enters/exits\n• Made of phospholipid bilayer\n\n**Nucleus** - The brain/control center\n• Contains DNA (genetic instructions)\n• Controls all cell activities\n\n**Mitochondria** - Power plants\n• Produce ATP (cellular energy)\n• Known as 'Powerhouse of the cell'\n\n**Ribosomes** - Protein factories\n• Read mRNA instructions\n• Build proteins from amino acids\n\n**Endoplasmic Reticulum** - Transport system\n• Rough ER: Has ribosomes, makes proteins\n• Smooth ER: Makes lipids\n\n**Golgi Apparatus** - Packaging center\n• Modifies and ships proteins\n\n**Amazing Facts:**\n→ Your body has 37 TRILLION cells!\n→ Red blood cells live 120 days\n→ Nerve cells can be 3 feet long!\n\nWhat cell process would you like to explore?"
        ]
    },

    chemistry: {
        keywords: ['chemistry', 'atom', 'molecule', 'element', 'compound', 'reaction', 'periodic table', 'bond', 'chemical', 'electron', 'proton', 'neutron', 'ion', 'acid', 'base'],
        responses: [
            "⚗️ **Chemistry - The Science of Matter!**\n\n**Atoms: The Building Blocks**\n\n**Structure:**\n• **Protons** (+) in nucleus\n• **Neutrons** (neutral) in nucleus\n• **Electrons** (-) orbit nucleus\n\n**Periodic Table Guide:**\n\n**Groups (columns):**\n• Group 1: Alkali metals (very reactive)\n• Group 17: Halogens (want 1 electron)\n• Group 18: Noble gases (stable, don't react)\n\n**Key Concepts:**\n\n**Chemical Bonds:**\n1. **Ionic** - Transfer electrons (metal + nonmetal)\n   Example: NaCl (table salt)\n\n2. **Covalent** - Share electrons (nonmetal + nonmetal)\n   Example: H₂O (water)\n\n3. **Metallic** - Sea of electrons (metals)\n   Example: Iron, copper\n\n**Balancing Equations:**\nLaw of Conservation: Matter cannot be created/destroyed\n→ Same number of atoms on both sides!\n\nExample: 2H₂ + O₂ → 2H₂O\n(4 H atoms and 2 O atoms on each side)\n\nWhat chemistry concept can I clarify?",

            "🧪 **Chemical Reactions Explained**\n\n**Types of Reactions:**\n\n1. **Synthesis (Combination)**\n   A + B → AB\n   Example: 2H₂ + O₂ → 2H₂O\n\n2. **Decomposition**\n   AB → A + B\n   Example: 2H₂O → 2H₂ + O₂\n\n3. **Single Replacement**\n   A + BC → AC + B\n   Example: Zn + 2HCl → ZnCl₂ + H₂\n\n4. **Double Replacement**\n   AB + CD → AD + CB\n   Example: NaCl + AgNO₃ → NaNO₃ + AgCl\n\n5. **Combustion**\n   Fuel + O₂ → CO₂ + H₂O + energy\n   Example: CH₄ + 2O₂ → CO₂ + 2H₂O\n\n**pH Scale (0-14):**\n• 0-6: Acidic (lemon juice, vinegar)\n• 7: Neutral (pure water)\n• 8-14: Basic/Alkaline (soap, bleach)\n\n**Lab Safety:**\n→ Always wear goggles\n→ Never taste chemicals\n→ Add acid to water (not water to acid!)\n\nWhat would you like to know more about?"
        ]
    },

    physics: {
        keywords: ['physics', 'force', 'energy', 'motion', 'velocity', 'acceleration', 'gravity', 'newton', 'momentum', 'friction', 'mass', 'speed', 'light', 'electricity'],
        responses: [
            "⚡ **Physics - The Science of How Things Work!**\n\n**Newton's Laws of Motion:**\n\n**1st Law (Inertia):**\nAn object at rest stays at rest, an object in motion stays in motion unless acted upon by force.\n→ Why seatbelts are important!\n\n**2nd Law (F = ma):**\nForce = Mass × Acceleration\n→ Heavier objects need more force to move\n→ Force is measured in Newtons (N)\n\n**3rd Law (Action-Reaction):**\nFor every action, there's an equal and opposite reaction\n→ When you jump, you push Earth down, Earth pushes you up\n→ How rockets work in space!\n\n**Energy Types:**\n• **Kinetic Energy** - Energy of motion: KE = ½mv²\n• **Potential Energy** - Stored energy: PE = mgh\n• **Thermal Energy** - Heat energy\n• **Electrical Energy** - Moving electrons\n• **Chemical Energy** - In bonds (batteries, food)\n\n**Key Principle:**\nEnergy cannot be created or destroyed, only transformed!\n\n**Real-World Examples:**\n→ Roller coasters: PE ↔ KE conversion\n→ Batteries: Chemical → Electrical energy\n→ Solar panels: Light → Electrical energy\n\nWhat physics concept interests you?",

            "🌟 **Understanding Forces and Motion**\n\n**Key Formulas:**\n\n**Motion:**\n• Speed = Distance / Time\n• Velocity = Displacement / Time (includes direction)\n• Acceleration = Change in Velocity / Time\n• Distance = Speed × Time\n\n**Force:**\n• Force = Mass × Acceleration (F = ma)\n• Weight = Mass × Gravity (W = mg)\n• Work = Force × Distance (W = Fd)\n• Power = Work / Time (P = W/t)\n\n**Gravity:**\n• On Earth: g = 9.8 m/s²\n• Everything falls at same rate (ignoring air resistance)\n• Galileo proved this at Leaning Tower of Pisa!\n\n**Types of Forces:**\n1. **Gravity** - Pulls objects together\n2. **Friction** - Opposes motion\n3. **Normal Force** - Pushes perpendicular to surface\n4. **Tension** - Pulling force in rope/string\n5. **Applied Force** - Push or pull by person/object\n\n**Problem-Solving Steps:**\n1. Draw free-body diagram\n2. Identify all forces\n3. Choose coordinate system\n4. Apply Newton's laws\n5. Solve equations\n\nNeed help with a specific physics problem?"
        ]
    },

    history: {
        keywords: ['history', 'war', 'ancient', 'civilization', 'century', 'empire', 'revolution', 'historical', 'past', 'world war', 'medieval', 'renaissance'],
        responses: [
            "📚 **History - Learning from the Past**\n\n**World War II (1939-1945)**\nThe most devastating conflict in human history.\n\n**Timeline of Key Events:**\n\n**1939:** Germany invades Poland (Sept 1)\n→ Britain & France declare war on Germany\n\n**1940:** Battle of Britain (air warfare)\n→ Germany fails to invade Britain\n\n**1941:** Pearl Harbor attack (Dec 7)\n→ US enters the war\n→ Germany invades Soviet Union\n\n**1944:** D-Day invasion (June 6)\n→ Allied forces land in Normandy, France\n→ Largest amphibious assault in history\n\n**1945:** Germany surrenders (May 8)\n→ Atomic bombs on Hiroshima & Nagasaki (Aug 6 & 9)\n→ Japan surrenders (Aug 15)\n\n**Causes:**\n• Treaty of Versailles harsh on Germany\n• Worldwide economic depression\n• Rise of totalitarian regimes (Hitler, Mussolini)\n• Failure of League of Nations\n\n**Consequences:**\n→ 70-85 million deaths\n→ Holocaust: 6 million Jews killed\n→ United Nations formed\n→ Cold War begins\n→ Nuclear age starts\n\n**Lessons:** Never ignore rising tyranny, value human rights, seek diplomatic solutions.\n\nWhat historical period interests you?",

            "🏛️ **Ancient Civilizations - Foundations of Modern World**\n\n**Major Ancient Civilizations:**\n\n**Mesopotamia (3500 BC) - \"Cradle of Civilization\"**\n→ First writing system (cuneiform)\n→ Invented the wheel\n→ Code of Hammurabi (first written laws)\n→ Located between Tigris & Euphrates rivers\n\n**Ancient Egypt (3100 BC)**\n→ Built pyramids (engineering marvels)\n→ Advanced medicine & surgery\n→ Hieroglyphic writing\n→ Mathematics & astronomy\n→ Mummification process\n\n**Ancient Greece (800 BC)**\n→ Democracy invented in Athens\n→ Philosophy: Socrates, Plato, Aristotle\n→ Olympic Games started (776 BC)\n→ Mathematics: Pythagoras, Euclid\n→ Architecture: Parthenon\n\n**Roman Empire (753 BC - 476 AD)**\n→ Advanced engineering (aqueducts, roads)\n→ Roman law (basis of modern legal systems)\n→ Latin language (root of Romance languages)\n→ Military tactics still studied today\n\n**Ancient China (2070 BC)**\n→ Paper invented (105 AD)\n→ Gunpowder discovered\n→ Compass invented\n→ Great Wall built\n→ Silk Road trade routes\n\n**Why Study Ancient History?**\nThese civilizations gave us: writing, laws, democracy, philosophy, mathematics, architecture, and more!\n\nWhich civilization fascinates you most?"
        ]
    },

    study_tips: {
        keywords: ['study', 'learn', 'tips', 'exam', 'test', 'homework', 'improve', 'better', 'focus', 'concentrate', 'memory', 'remember', 'prepare', 'revision'],
        responses: [
            "💡 **Proven Study Strategies That Actually Work!**\n\n**Top 10 Study Techniques:**\n\n**1. Pomodoro Technique** ⏰\n→ Study 25 minutes, break 5 minutes\n→ After 4 sessions, take 15-30 min break\n→ Prevents burnout, maintains focus\n\n**2. Active Recall** 🧠\n→ Test yourself instead of re-reading\n→ Close book, write what you remember\n→ Most effective learning method!\n\n**3. Spaced Repetition** 📅\n→ Review material at increasing intervals\n→ Day 1, Day 3, Day 7, Day 14, Day 30\n→ Fights the \"forgetting curve\"\n\n**4. Feynman Technique** 🎓\n→ Explain concept in simple terms\n→ If you can't, you don't understand it yet\n→ Identify gaps in knowledge\n\n**5. Mind Mapping** 🗺️\n→ Visual representation of information\n→ Shows connections between concepts\n→ Great for visual learners\n\n**Memory Boosters:**\n✓ Study before sleep (consolidates memory)\n✓ Exercise regularly (increases blood flow to brain)\n✓ Stay hydrated (dehydration impairs cognition)\n✓ Eat brain foods (blueberries, nuts, fish)\n✓ Get 7-9 hours sleep\n\n**Avoid These Mistakes:**\n❌ Cramming the night before\n❌ Multitasking while studying\n❌ Passive reading without engaging\n❌ Studying same subject for hours\n❌ Skipping breaks\n\nWhat subject are you studying for?",

            "🎯 **Ultimate Exam Preparation Guide**\n\n**6 Weeks Before Exam:**\n→ Create study schedule\n→ Organize all materials\n→ Identify weak areas\n→ Start active recall practice\n\n**4 Weeks Before:**\n→ Make summary notes\n→ Create flashcards\n→ Practice problems daily\n→ Join study group\n\n**2 Weeks Before:**\n→ Take practice tests\n→ Review mistakes thoroughly\n→ Teach concepts to others\n→ Increase practice intensity\n\n**1 Week Before:**\n→ Final review of all topics\n→ Focus on weak areas\n→ Do timed practice exams\n→ Get good sleep every night\n\n**Day Before:**\n→ Light review only\n→ Organize materials for exam\n→ Prepare healthy snacks\n→ Relax and rest well\n→ NO cramming!\n\n**Exam Day:**\n→ Eat good breakfast\n→ Arrive early\n→ Read instructions carefully\n→ Answer easy questions first\n→ Check your work\n\n**Test-Taking Strategies:**\n1. Read entire question before answering\n2. Manage your time (check clock regularly)\n3. Skip hard questions, come back later\n4. Trust your first instinct\n5. Show all work in math\n6. Review before submitting\n\n**Anxiety Management:**\n→ Deep breathing (4-7-8 technique)\n→ Positive self-talk\n→ Focus on what you know\n→ Remember: It's just one exam!\n\nNeed help with a specific subject?"
        ]
    },

    greetings: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'what\'s up'],
        responses: [
            "👋 **Hello! Welcome to your AI Study Companion!**\n\nI'm here to help you succeed in your studies with clear explanations and proven learning strategies!\n\n**I can help you with:**\n📐 **Mathematics** - Algebra, Calculus, Geometry, Statistics\n🔬 **Science** - Biology, Chemistry, Physics\n📚 **History** - World events, civilizations, analysis\n💡 **Study Skills** - Effective techniques, memory tips\n\n**How I Work:**\n→ Ask me specific questions or general topics\n→ I'll provide detailed, educational explanations\n→ I break down complex concepts into simple terms\n→ I give real-world examples and applications\n\n**Example Questions:**\n• \"Explain photosynthesis\"\n• \"How do I solve quadratic equations?\"\n• \"What caused World War II?\"\n• \"What are the best study techniques?\"\n\nWhat would you like to learn about today? 🚀",

            "🌟 **Hey there! Ready to boost your learning?**\n\nGreat to see you here! I'm your AI study companion, and I'm excited to help you understand challenging concepts and ace your exams!\n\n**What Makes Me Different:**\n✓ I explain things clearly (no confusing jargon!)\n✓ I provide step-by-step breakdowns\n✓ I give memory tricks and study tips\n✓ I connect concepts to real life\n✓ I'm available 24/7 whenever you need help!\n\n**Popular Topics Students Ask About:**\n1. Math problem-solving strategies\n2. Science concepts (cells, atoms, forces)\n3. Historical events and their impacts\n4. Effective study and memory techniques\n5. Exam preparation tips\n\n**Pro Tip:** The more specific your question, the better I can help!\n\nSo... what subject are you working on today? Let's make learning fun! 📖✨"
        ]
    },

    default: {
        keywords: [],
        responses: [
            "🤔 **Interesting question!**\n\nI want to give you the best possible answer. Could you provide a bit more detail?\n\n**For better help, try asking:**\n• \"Explain [specific concept]\" - I'll break it down\n• \"How do I solve [type of problem]?\" - I'll show steps\n• \"What is [term/topic]?\" - I'll define and explain\n• \"Help me understand [subject area]\" - I'll provide overview\n\n**Popular Topics I Excel At:**\n→ Mathematics (all levels)\n→ Biology (cells, DNA, ecosystems)\n→ Chemistry (atoms, reactions, periodic table)\n→ Physics (forces, energy, motion)\n→ History (wars, civilizations, revolutions)\n→ Study techniques and exam prep\n\n**Example Questions:**\n• \"What is photosynthesis?\"\n• \"Help me with quadratic equations\"\n• \"Explain Newton's laws of motion\"\n• \"What are the best study methods?\"\n\nWhat subject area are you studying? I'm here to help! 🎓",

            "💭 **I'm here to help you learn!**\n\nYour question is interesting, but I need a bit more information to give you the most helpful answer.\n\n**Tell me more about:**\n• What subject is this related to?\n• What specific concept are you struggling with?\n• Is this for homework, exam prep, or general learning?\n• Do you need explanation, examples, or problem-solving help?\n\n**I'm Great At Explaining:**\n\n**Mathematics:**\nAlgebra, calculus, geometry, statistics, trigonometry\n\n**Sciences:**\nBiology (life processes), Chemistry (atoms & molecules), Physics (forces & energy)\n\n**History:**\nAncient civilizations, world wars, revolutions, historical analysis\n\n**Study Skills:**\nMemory techniques, exam strategies, time management, focus tips\n\n**Quick Examples:**\n✓ \"Explain the Pythagorean theorem\"\n✓ \"How do cells divide?\"\n✓ \"What caused the French Revolution?\"\n✓ \"Best way to memorize formulas?\"\n\nWhat can I help you understand today? 🚀"
        ]
    }
};

// Smart response generation function
function generateSmartResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // Score each category based on keyword matches
    const scores = {};
    let maxScore = 0;
    let bestCategory = 'default';

    for (const [category, data] of Object.entries(knowledgeBase)) {
        let score = 0;
        for (const keyword of data.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                score += 1;
                // Give extra weight to longer, more specific keywords
                if (keyword.length > 5) score += 0.5;
            }
        }
        scores[category] = score;
        if (score > maxScore) {
            maxScore = score;
            bestCategory = category;
        }
    }

    // If no good match found, use default
    if (maxScore === 0) {
        bestCategory = 'default';
    }

    // Get random response from best matching category
    const responses = knowledgeBase[bestCategory].responses;
    const randomIndex = Math.floor(Math.random() * responses.length);

    return {
        reply: responses[randomIndex],
        category: bestCategory,
        confidence: maxScore
    };
}

// API endpoint for intelligent responses
app.post('/api/respond', (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required' });
        }

        const result = generateSmartResponse(message);

        console.log(`\n📨 User: "${message}"`);
        console.log(`🎯 Category: ${result.category} (confidence: ${result.confidence})`);
        console.log(`🤖 AI Response: [${result.reply.substring(0, 50)}...]`);

        res.json({
            reply: result.reply,
            category: result.category
        });

    } catch (error) {
        console.error('❌ Error generating response:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            message: 'Please try rephrasing your question'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Smart AI Engine is running',
        version: '2.0',
        capabilities: [
            'Advanced Mathematics',
            'Biology & Life Sciences',
            'Chemistry',
            'Physics',
            'World History',
            'Study Techniques'
        ]
    });
});

// Get available topics
app.get('/api/topics', (req, res) => {
    const topics = Object.keys(knowledgeBase).map(key => ({
        name: key,
        keywords: knowledgeBase[key].keywords.slice(0, 5) // First 5 keywords
    }));
    res.json({ topics });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🤖 Smart AI Student Companion Engine',
        version: '2.0',
        status: 'Online',
        features: [
            'Intelligent keyword matching',
            'Comprehensive educational responses',
            'Multi-subject support',
            'Study tips and strategies'
        ],
        endpoints: {
            respond: 'POST /api/respond',
            health: 'GET /health',
            topics: 'GET /api/topics'
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

// Start server
const PORT = process.env.AI_ENGINE_PORT || 3001;

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('  🧠 SMART AI ENGINE STARTED');
    console.log('='.repeat(50));
    console.log(`  Port: ${PORT}`);
    console.log(`  Status: ✅ ONLINE`);
    console.log(`  Intelligence: Advanced`);
    console.log(`  Health Check: http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
    console.log('  📚 Knowledge Areas:');
    console.log('  - Mathematics (Algebra, Calculus, Geometry)');
    console.log('  - Biology (Cells, DNA, Ecosystems)');
    console.log('  - Chemistry (Atoms, Reactions, Elements)');
    console.log('  - Physics (Forces, Energy, Motion)');
    console.log('  - History (Civilizations, Wars, Revolutions)');
    console.log('  - Study Skills (Techniques, Memory, Exams)');
    console.log('='.repeat(50));
    console.log('  Keep this window OPEN!');
    console.log('  Press Ctrl+C to stop');
    console.log('='.repeat(50) + '\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Smart AI Engine shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Smart AI Engine shutting down gracefully...');
    process.exit(0);
});

export default app;
