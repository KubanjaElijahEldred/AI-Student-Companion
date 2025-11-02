import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Advanced AI response system with educational content
const knowledgeBase = {
    // Mathematics responses
    math: {
        keywords: ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'equation', 'solve', 'calculate', 'number', 'formula', 'derivative', 'integral', 'trigonometry', 'statistics'],
        responses: [
            "Great question about mathematics! Let me help you understand this step by step.\n\nMathematics is the foundation of logical thinking. What specific topic are you working on? I can help with:\n- Algebra (equations, polynomials, functions)\n- Calculus (limits, derivatives, integrals)\n- Geometry (shapes, angles, theorems)\n- Statistics (probability, data analysis)\n- Trigonometry (sin, cos, tan, angles)\n\nTell me what you're struggling with, and I'll break it down into simple steps!",

            "Mathematics is like a puzzle - once you understand the pattern, it all makes sense!\n\nHere's my approach to solving math problems:\n1. **Understand** what the question is asking\n2. **Identify** what information you have\n3. **Choose** the right formula or method\n4. **Work through** step by step\n5. **Check** your answer makes sense\n\nWhat specific math problem can I help you solve today?",

            "Math doesn't have to be intimidating! Let's tackle it together.\n\n**Key Math Tips:**\n- Practice regularly (even 15 minutes daily helps)\n- Draw diagrams to visualize problems\n- Check your work by plugging answers back in\n- Learn the 'why' behind formulas, not just memorization\n\nWhat area of math would you like to explore?"
        ]
    },

    // Science responses
    science: {
        keywords: ['science', 'biology', 'chemistry', 'physics', 'experiment', 'scientific', 'atom', 'molecule', 'cell', 'energy', 'force', 'reaction', 'organism'],
        responses: [
            "Science is the study of how our universe works - it's fascinating!\n\nLet me help you understand this concept better. Science is divided into main branches:\n\n**Biology** - Study of living things (cells, evolution, ecology)\n**Chemistry** - Study of matter and reactions (atoms, compounds, bonds)\n**Physics** - Study of energy and motion (force, gravity, electricity)\n\nWhich area interests you? I can explain concepts in simple terms with real-world examples!",

            "Great science question! Let me break this down scientifically.\n\n**The Scientific Method:**\n1. Make an observation\n2. Ask a question\n3. Form a hypothesis\n4. Test with experiments\n5. Analyze results\n6. Draw conclusions\n\nThis is how all scientific discoveries are made! What specific science topic are you studying?",

            "Science is all around us! Let me help you understand this.\n\n**Key Science Concepts:**\n- Everything is made of atoms (tiny building blocks)\n- Energy cannot be created or destroyed, only transformed\n- Living things are made of cells\n- Forces cause motion and changes\n- Chemical reactions rearrange atoms\n\nWhat would you like to explore deeper?"
        ]
    },

    // Biology specific
    biology: {
        keywords: ['cell', 'photosynthesis', 'DNA', 'evolution', 'organism', 'ecosystem', 'protein', 'gene', 'bacteria', 'plant', 'animal'],
        responses: [
            "Biology is the amazing study of life! Let me explain this clearly.\n\n**Photosynthesis** is how plants make food:\n- Plants take in CO₂ (carbon dioxide) from air\n- They absorb water from soil through roots\n- Chlorophyll in leaves captures sunlight\n- Chemical reaction: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n- Plants make glucose (sugar) and release oxygen!\n\nThis process gives us oxygen to breathe. Without plants, life on Earth wouldn't exist!\n\nWant to know more about plant biology or another topic?",

            "Cells are the building blocks of all living things!\n\n**Cell Structure:**\n- **Cell Membrane** - Protective outer layer (like a fence)\n- **Cytoplasm** - Jelly-like fluid inside\n- **Nucleus** - Control center with DNA (the instructions)\n- **Mitochondria** - Power plants that make energy\n- **Ribosomes** - Protein factories\n\nYour body has about 37 TRILLION cells working together right now!\n\nWhat aspect of biology interests you most?",

            "DNA is the blueprint of life - it's incredible!\n\n**What is DNA?**\n- Stands for Deoxyribonucleic Acid\n- Double helix structure (twisted ladder)\n- Made of 4 bases: A, T, G, C\n- Contains all instructions to build and run your body\n- Half from mom, half from dad\n- Makes you unique!\n\n**Fun fact:** If you unwound all DNA in your body, it would reach to the sun and back 300 times!\n\nWant to learn more about genetics or another biology topic?"
        ]
    },

    // History responses
    history: {
        keywords: ['history', 'war', 'ancient', 'civilization', 'century', 'empire', 'revolution', 'historical', 'past', 'era', 'world war'],
        responses: [
            "History helps us understand the present by studying the past!\n\n**World War II (1939-1945)** was one of history's most significant events:\n\n**Causes:**\n- Treaty of Versailles created resentment in Germany\n- Economic depression worldwide\n- Rise of fascism (Hitler, Mussolini)\n- Failure of League of Nations\n\n**Key Events:**\n- Germany invaded Poland (Sept 1, 1939)\n- Pearl Harbor attack (Dec 7, 1941)\n- D-Day invasion (June 6, 1944)\n- Atomic bombs on Japan (Aug 1945)\n\n**Impact:** 70-85 million deaths, United Nations formed, Cold War began\n\nWhat period of history interests you?",

            "Every historical event teaches us valuable lessons!\n\n**How to Study History:**\n1. Look for **causes** - why did it happen?\n2. Understand **key players** - who was involved?\n3. Identify **consequences** - what changed?\n4. Connect to **today** - how does it affect us now?\n5. Learn from **mistakes** - how can we improve?\n\n**Remember:** History repeats itself if we don't learn from it!\n\nWhat historical event would you like to explore?",

            "Ancient civilizations built the foundation of our modern world!\n\n**Major Ancient Civilizations:**\n- **Mesopotamia** (3500 BC) - Writing, wheel, laws\n- **Egypt** (3100 BC) - Pyramids, medicine, math\n- **Greece** (800 BC) - Democracy, philosophy, science\n- **Rome** (753 BC) - Engineering, law, government\n- **China** (2070 BC) - Paper, gunpowder, compass\n\nEach contributed technologies and ideas we still use today!\n\nWhich civilization fascinates you most?"
        ]
    },

    // Study tips and learning
    study: {
        keywords: ['study', 'learn', 'tips', 'exam', 'test', 'homework', 'improve', 'better', 'focus', 'concentrate', 'memory', 'remember'],
        responses: [
            "Excellent question! Here are proven study strategies that actually work:\n\n**Effective Study Techniques:**\n\n1. **Pomodoro Technique** - Study 25 min, break 5 min (prevents burnout)\n2. **Active Recall** - Test yourself instead of just re-reading\n3. **Spaced Repetition** - Review material at increasing intervals\n4. **Teach Others** - If you can teach it, you know it!\n5. **Study Environment** - Quiet space, no phone distractions\n\n**Memory Boosters:**\n- Create mnemonics (memory tricks)\n- Use mind maps for connections\n- Study before sleep (helps consolidation)\n- Practice, don't just read\n\n**Avoid:**\n- ❌ Cramming the night before\n- ❌ Multitasking while studying\n- ❌ Passive reading without engaging\n\nWhat subject are you preparing for?",

            "Smart study habits make all the difference! Let me share what works:\n\n**The Learning Pyramid:**\n- Reading: 10% retention\n- Listening: 20% retention\n- Watching demos: 30% retention\n- Discussion: 50% retention\n- Practice: 75% retention\n- Teaching others: 90% retention\n\n**Top Study Hacks:**\n1. Study in different locations (improves recall)\n2. Use multiple senses (write, speak, draw)\n3. Test yourself frequently\n4. Connect new info to what you know\n5. Get enough sleep (7-9 hours)\n6. Exercise regularly (boosts brain power)\n\nQuality > Quantity in studying!\n\nWhat's your biggest study challenge?",

            "Building good study habits is the key to success!\n\n**Daily Study Routine:**\n\n**Before Studying:**\n- Clear your desk\n- Put phone in another room\n- Have water nearby\n- Set specific goals\n\n**During Study Session:**\n- Start with hardest subject first\n- Take regular breaks\n- Summarize in your own words\n- Make practice questions\n\n**After Studying:**\n- Review what you learned\n- Plan tomorrow's topics\n- Reward yourself!\n\n**Pro Tip:** Studying same time daily trains your brain for focus!\n\nHow can I help optimize your study routine?"
        ]
    },

    // Calculus
    calculus: {
        keywords: ['calculus', 'derivative', 'integral', 'limit', 'differential', 'integration'],
        responses: [
            "Calculus is the mathematics of change - it's powerful!\n\n**What is Calculus?**\nCalculus has two main parts:\n\n**1. Derivatives (Rate of Change)**\n- How fast something is changing\n- Slope of a curve at any point\n- Example: Speed is derivative of position\n- Used in: physics, engineering, economics\n\n**2. Integrals (Accumulation)**\n- Adding up infinite small pieces\n- Area under a curve\n- Example: Distance from speed over time\n- Used in: calculating volumes, work, probability\n\n**Real-World Uses:**\n- Rocket trajectories\n- Medical imaging\n- Stock market analysis\n- Machine learning algorithms\n\nWhat aspect of calculus are you working on?",

            "Calculus unlocks understanding of motion and change!\n\n**Key Calculus Concepts:**\n\n**Limits:**\n- What value does function approach?\n- Foundation of all calculus\n- Example: lim(x→2) of x² = 4\n\n**Derivatives:**\n- Rate of change\n- d/dx(x²) = 2x\n- Used to find maxima/minima\n\n**Integrals:**\n- Area accumulation\n- ∫x dx = x²/2 + C\n- Reverse of derivatives\n\n**Remember:** Integration and differentiation are inverse operations!\n\nWhich concept needs clarification?"
        ]
    },

    // Greetings
    greeting: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
        responses: [
            "Hello! 👋 I'm your AI Study Companion, here to help you excel in your studies!\n\nI can assist you with:\n📚 **Mathematics** - Algebra, Calculus, Geometry, Statistics\n🔬 **Science** - Biology, Chemistry, Physics\n📖 **History** - World events, civilizations, analysis\n💡 **Study Skills** - Tips, techniques, memory strategies\n\nWhat would you like to learn about today? Ask me anything!",

            "Hi there! Welcome to your personalized learning session! 🌟\n\nI'm here to make studying easier and more effective. Whether you need:\n- Explanations of difficult
