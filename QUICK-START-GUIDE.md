# 🚀 Quick Start Guide - Advanced AI Student Companion

## Prerequisites

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud database)

## 📦 Installation

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install AI engine dependencies
cd ../ai-engine
npm install
```

### Step 2: Configure Environment

Create `.env` file in `backend` folder:

```env
# Database (use one of these)
MONGO_URI=mongodb://localhost:27017/ai-student-companion
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-student-companion

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-key-change-this

# Server Configuration
PORT=5001
NODE_ENV=development

# AI Engine URL
JAVA_SERVER=http://localhost:3001
```

## 🎯 Quick Start Options

### Option 1: One-Click Start (Windows)

Double-click `START-ADVANCED.bat`

This will:
- ✅ Start Advanced AI Engine (port 3001)
- ✅ Start Advanced Backend (port 5001)
- ✅ Open web interface automatically

### Option 2: Manual Start

**Terminal 1 - AI Engine:**
```bash
cd ai-engine
node advancedEngine.js
```

**Terminal 2 - Backend:**
```bash
cd backend
node advancedServer.js
```

**Terminal 3 - Open Browser:**
- Navigate to `unified-chatbot.html` or create your own frontend

### Option 3: Development Mode (with auto-reload)

```bash
# Backend
cd backend
npm run dev

# AI Engine
cd ai-engine
npm run dev
```

## 🌐 Access Points

After starting the services:

- **Frontend:** Open `unified-chatbot.html` in browser
- **Backend API:** http://localhost:5001
- **AI Engine:** http://localhost:3001
- **Health Check:** http://localhost:5001/api/health

## 📱 First Time Setup

### 1. Register an Account

Open the interface and click "Register":
- Username: Choose a unique username
- Email: Your email address
- Password: Secure password

### 2. Login

Use your credentials to login. You'll receive an authentication token.

### 3. Start Using Features

#### Create Your First Study Note
1. Go to "Study Notes" section
2. Click "New Note"
3. Add title, subject, and content
4. Save

#### Create Flashcards
1. Go to "Flashcards" section
2. Click "New Flashcard"
3. Add question (front) and answer (back)
4. Choose subject
5. Create

#### Start a Study Session
1. Go to "Study Sessions"
2. Click "Start Session"
3. Select subject and focus area
4. Set goals (optional)
5. Start studying!
6. End when done to track time

#### Take a Quiz
1. Go to "Quizzes" section
2. Create a new quiz or take existing one
3. Answer questions
4. Submit to see results

## 🎮 Using the AI Chat

1. Go to "AI Chat" section
2. Ask questions like:
   - "Explain the quadratic formula"
   - "Help me with photosynthesis"
   - "What are Newton's laws?"
   - "Give me study tips"

The AI will:
- Detect the subject automatically
- Remember your conversation
- Provide detailed explanations
- Suggest follow-up questions

## 📊 Track Your Progress

1. Go to "Dashboard" to see:
   - Your level and XP
   - Study streak
   - This week's study time
   - Recent activity

2. Go to "Progress" to see:
   - Achievements unlocked
   - Subject-specific progress
   - Strengths and weaknesses

## 🆘 Troubleshooting

### Cannot Connect to Database

**Problem:** "MongoDB connection error"

**Solutions:**
1. Make sure MongoDB is running
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

2. Or use MongoDB Atlas (cloud):
   - Create free account at mongodb.com
   - Get connection string
   - Update MONGO_URI in .env

### Port Already in Use

**Problem:** "Port 5001 already in use"

**Solution:** Change port in `.env` file:
```env
PORT=5002  # Use a different port
```

### AI Engine Not Responding

**Problem:** Chat not working

**Solutions:**
1. Check if AI Engine is running on port 3001
2. Check browser console for errors
3. Verify JAVA_SERVER in .env matches AI Engine URL

### Services Start Then Stop

**Problem:** Windows close immediately

**Solution:**
1. Open Command Prompt manually
2. Navigate to folder
3. Run commands to see error messages:
   ```bash
   cd ai-engine
   node advancedEngine.js
   ```

## 💡 Tips for Best Experience

1. **Keep Services Running:** Don't close the terminal windows while using the app

2. **Regular Study Sessions:** Track sessions daily to build streak

3. **Use Flashcards:** Review due flashcards daily for best retention

4. **Set Goals:** Add study goals in Progress section

5. **Mix Subjects:** Study different subjects to gain more XP

6. **Complete Quizzes:** Regular quizzes improve retention

7. **Take Breaks:** Use break tracking in study sessions

## 📚 Learn More

- See `ADVANCED-FEATURES.md` for complete feature list
- Check `README.md` for project overview
- View API documentation in each controller file

## 🎯 Next Steps

1. ✅ Create your account
2. ✅ Add study notes for your current subjects
3. ✅ Create flashcards for important concepts
4. ✅ Start your first study session
5. ✅ Take a practice quiz
6. ✅ Chat with AI about topics
7. ✅ Check your progress dashboard

## 🔔 Updates & Features Coming Soon

- Real AI integration (GPT, Gemini)
- Mobile app version
- Voice commands
- PDF document analysis
- Collaborative study rooms
- More gamification features

---

**Need Help?** Check the error messages in terminal windows for specific issues.

**Enjoying the app?** Star the repository and share with friends!
