# 🤖 AI Student Companion - Advanced Edition

A comprehensive, intelligent study platform with AI-powered assistance, spaced repetition flashcards, progress tracking, quiz system, and gamification features. Perfect for students who want to optimize their learning.

## 📋 Features

### Core Features
- **User Authentication**: Secure JWT-based registration and login
- **AI-Powered Chat**: Context-aware conversations with intelligent subject detection
- **Multi-Subject Support**: 8+ subjects (Math, Physics, Chemistry, Biology, etc.)
- **Real-time Messaging**: Instant AI responses with conversation memory

### 🆕 Advanced Features
- **📝 Study Notes**: Create, organize, and search study notes with tags
- **🃏 Flashcards**: Spaced repetition system (SM-2 algorithm) for optimal learning
- **⏱️ Study Sessions**: Track study time, productivity, and breaks
- **📊 Quiz System**: Create quizzes, auto-grading, and performance analytics
- **🏆 Progress Tracking**: XP system, levels, achievements, and leaderboards
- **📈 Analytics**: Comprehensive statistics and insights
- **🎮 Gamification**: Streaks, achievements, and competitive leaderboards

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

### AI Engine
- **Node.js** with Express.js
- **Context-Aware AI**: Remembers conversation history
- **Subject Detection**: Automatic topic identification
- **Adaptive Responses**: Adjusts to user level
- **Study Tips Integration**: Built-in learning strategies
- **Multi-Subject Knowledge Base**: Detailed explanations with examples

### Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **Responsive Design**
- **Local Storage** for auth persistence

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Option 1: Quick Start (Windows)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-student-companion.git
   cd ai-student-companion
   ```

2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../ai-engine && npm install
   ```

3. **For Basic Version:** Double-click `start.bat`
   **For Advanced Version:** Double-click `START-ADVANCED.bat`
   
   This will:
   - Start AI Engine (port 3001)
   - Start Backend (port 5001 for advanced)
   - Open web interface

### Option 2: Manual Setup

#### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/ai-student-companion.git
cd ai-student-companion

# Install backend dependencies
cd backend
npm install

# Install AI engine dependencies  
cd ../ai-engine
npm install
```

#### 2. Environment Setup

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/ai-student-companion

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000

# AI Engine Configuration
JAVA_SERVER=http://localhost:3001

# Environment
NODE_ENV=development
```

#### 3. Start Services

**Terminal 1 - AI Engine:**
```bash
cd ai-engine
npm start
```

**Terminal 2 - Backend Server:**
```  
cd backend
npm start
```

#### 4. Open Frontend
Open `frontend/index.html` in your web browser.

## 🎯 Usage

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials  
3. **Start Chatting**: Ask questions about your studies!

### Example Conversations
- "Hi, can you help me with calculus?"
- "I need help understanding photosynthesis"
- "Tell me about World War II"
- "Can you explain algebra basics?"

### Supported Subjects
- **Mathematics**: Algebra, Calculus, Geometry
- **Science**: Physics, Chemistry, Biology  
- **History**: Historical events and periods
- **General Studies**: Various academic topics

## 🔧 Configuration

### Database Setup
- **Local MongoDB**: Install MongoDB locally and use `mongodb://localhost:27017/ai-student-companion`
- **MongoDB Atlas**: Create a cloud database and update the `MONGO_URI` in your `.env` file

### AI Engine Customization
The AI engine uses a simple keyword-based response system. To enhance it:

1. **Add more responses** in `ai-engine/index.js`
2. **Integrate external APIs** like OpenAI GPT or Google's Gemini
3. **Implement machine learning** models for better understanding

### Frontend Customization
- Modify `frontend/index.html` for UI changes
- Update API endpoints if running on different ports
- Add new features like file uploads, voice chat, etc.

## 📁 Project Structure

```
ai-student-companion/
├── backend/                 # Express.js backend server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
│
├── ai-engine/             # AI response engine
│   ├── index.js          # AI engine server
│   └── package.json      # AI engine dependencies
│
├── frontend/              # Frontend interface
│   └── index.html        # Main chat interface
│
├── start.bat             # Windows startup script
├── package.json          # Root package.json
└── README.md            # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat
- `POST /api/chat` - Send message to AI (requires authentication)

### AI Engine
- `POST /api/respond` - Direct AI response endpoint
- `GET /health` - Health check

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Basic input sanitization
- **CORS Configuration**: Controlled cross-origin requests

## 🚀 Deployment

### Local Development
Follow the setup instructions above.

### Production Deployment
1. Set up MongoDB Atlas or production MongoDB instance
2. Update environment variables for production
3. Deploy backend to services like Heroku, Railway, or DigitalOcean
4. Deploy AI engine separately or as part of the backend
5. Serve frontend from a static hosting service or CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**"Cannot connect to database"**
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify the `MONGO_URI` in your `.env` file

**"JWT must be provided"**  
- Make sure you're logged in
- Check if the auth token is being sent in requests

**"AI Engine unavailable"**
- Ensure the AI engine is running on port 3001
- Check the `JAVA_SERVER` environment variable

**Port conflicts**
- Change ports in the respective `package.json` files or environment variables
- Ensure ports 5000 and 3001 are available

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Eldred** - Developer

## ✨ Version Comparison

| Feature | Basic Version | Advanced Version |
|---------|--------------|------------------|
| AI Chat | ✅ Simple | ✅ Context-aware |
| User Auth | ✅ | ✅ |
| Study Notes | ❌ | ✅ |
| Flashcards | ❌ | ✅ Spaced Repetition |
| Quizzes | ❌ | ✅ Auto-grading |
| Study Sessions | ❌ | ✅ Time tracking |
| Progress/XP | ❌ | ✅ |
| Achievements | ❌ | ✅ |
| Analytics | ❌ | ✅ |
| Leaderboard | ❌ | ✅ |

## 🎯 Getting Started

**Quick Start Guide:** See `QUICK-START-GUIDE.md`

**Advanced Features:** See `ADVANCED-FEATURES.md`

**Choose Your Version:**
- `start.bat` - Basic chat features
- `START-ADVANCED.bat` - All advanced features

## 🔮 Future Enhancements

- [ ] Real AI integration (OpenAI GPT, Google Gemini)
- [ ] Voice chat capabilities
- [ ] PDF document processing and analysis
- [x] ~~Study progress tracking~~ ✅ Completed
- [x] ~~Quiz and assessment features~~ ✅ Completed
- [ ] Mobile app (React Native)
- [ ] Collaborative study rooms
- [ ] Teacher/tutor dashboard
- [ ] Calendar integration
- [ ] Math equation renderer (LaTeX)
- [ ] Code syntax highlighting
- [ ] Video explanations

---

⭐ If you found this project helpful, please give it a star!