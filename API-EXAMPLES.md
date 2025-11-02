# 🔌 API Examples - AI Student Companion

Complete API usage examples with real requests and responses.

---

## 🔐 Authentication

### Register New User

**Request:**
```http
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "username": "student123",
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "username": "student123",
    "email": "student@example.com"
  }
}
```

### Login

**Request:**
```http
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "username": "student123",
    "email": "student@example.com"
  }
}
```

---

## 📝 Study Notes

### Create Note

**Request:**
```http
POST http://localhost:5001/api/notes
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "Quadratic Equations",
  "content": "# Quadratic Formula\n\nx = [-b ± √(b² - 4ac)] / 2a\n\n## Example:\nx² + 5x + 6 = 0\na=1, b=5, c=6\n\nSolutions: x = -2 or x = -3",
  "subject": "mathematics",
  "tags": ["algebra", "equations", "formulas"],
  "importance": "high"
}
```

**Response:**
```json
{
  "message": "Study note created successfully",
  "note": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Quadratic Equations",
    "content": "# Quadratic Formula...",
    "subject": "mathematics",
    "tags": ["algebra", "equations", "formulas"],
    "importance": "high",
    "reviewCount": 0,
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
  }
}
```

### Get All Notes

**Request:**
```http
GET http://localhost:5001/api/notes?subject=mathematics&sortBy=createdAt&order=desc
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "notes": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "title": "Quadratic Equations",
      "subject": "mathematics",
      "tags": ["algebra", "equations"],
      "importance": "high",
      "reviewCount": 5,
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

### Search Notes

**Request:**
```http
GET http://localhost:5001/api/notes/search?query=quadratic
Authorization: Bearer <your-token>
```

---

## 🃏 Flashcards

### Create Flashcard

**Request:**
```http
POST http://localhost:5001/api/flashcards
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "question": "What is the derivative of x²?",
  "answer": "The derivative of x² is 2x\n\nUsing the power rule: d/dx(xⁿ) = nxⁿ⁻¹\nSo d/dx(x²) = 2x²⁻¹ = 2x",
  "subject": "mathematics",
  "deck": "Calculus Basics",
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "message": "Flashcard created successfully",
  "flashcard": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "question": "What is the derivative of x²?",
    "answer": "The derivative of x² is 2x...",
    "subject": "mathematics",
    "deck": "Calculus Basics",
    "difficulty": "medium",
    "easeFactor": 2.5,
    "interval": 0,
    "repetitions": 0,
    "nextReview": "2024-03-15T10:30:00.000Z",
    "timesReviewed": 0,
    "correctCount": 0,
    "incorrectCount": 0
  }
}
```

### Get Due Flashcards

**Request:**
```http
GET http://localhost:5001/api/flashcards/due
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "flashcards": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "question": "What is the derivative of x²?",
      "subject": "mathematics",
      "nextReview": "2024-03-15T10:30:00.000Z",
      "timesReviewed": 3,
      "difficulty": "medium"
    }
  ],
  "count": 1
}
```

### Review Flashcard

**Request:**
```http
POST http://localhost:5001/api/flashcards/65f1a2b3c4d5e6f7g8h9i0j3/review
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "quality": 4
}
```
*Quality scale: 0=blackout, 1=incorrect hard, 2=incorrect easy, 3=correct hard, 4=correct easy, 5=perfect*

**Response:**
```json
{
  "message": "Flashcard reviewed successfully",
  "flashcard": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "easeFactor": 2.6,
    "interval": 6,
    "repetitions": 2,
    "nextReview": "2024-03-21T10:30:00.000Z",
    "timesReviewed": 4,
    "correctCount": 3,
    "incorrectCount": 1
  },
  "nextReview": "2024-03-21T10:30:00.000Z"
}
```

### Get Flashcard Statistics

**Request:**
```http
GET http://localhost:5001/api/flashcards/stats
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "totalCards": 25,
  "dueCards": 5,
  "totalReviews": 150,
  "accuracy": "85.50",
  "bySubject": {
    "mathematics": 10,
    "physics": 8,
    "chemistry": 7
  }
}
```

---

## ⏱️ Study Sessions

### Start Session

**Request:**
```http
POST http://localhost:5001/api/sessions/start
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "subject": "physics",
  "focus": "Newton's Laws of Motion",
  "goals": [
    "Understand F=ma",
    "Solve 10 practice problems",
    "Review momentum concept"
  ]
}
```

**Response:**
```json
{
  "message": "Study session started",
  "session": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "subject": "physics",
    "focus": "Newton's Laws of Motion",
    "goals": ["Understand F=ma", "Solve 10 practice problems"],
    "startTime": "2024-03-15T10:30:00.000Z",
    "breaks": []
  }
}
```

### End Session

**Request:**
```http
POST http://localhost:5001/api/sessions/65f1a2b3c4d5e6f7g8h9i0j4/end
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "productivity": 8,
  "notes": "Good session. Understood all three laws clearly.",
  "goalsCompleted": ["Understand F=ma", "Solve 10 practice problems"]
}
```

**Response:**
```json
{
  "message": "Study session ended",
  "session": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "subject": "physics",
    "duration": 45,
    "productivity": 8,
    "goalsCompleted": ["Understand F=ma", "Solve 10 practice problems"],
    "endTime": "2024-03-15T11:15:00.000Z"
  }
}
```

### Get Session Statistics

**Request:**
```http
GET http://localhost:5001/api/sessions/stats
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "totalSessions": 25,
  "totalDuration": 1250,
  "avgDuration": 50,
  "avgProductivity": "7.80",
  "streak": 7,
  "bySubject": {
    "mathematics": {
      "count": 10,
      "duration": 500
    },
    "physics": {
      "count": 8,
      "duration": 400
    }
  }
}
```

---

## 📊 Quizzes

### Create Quiz

**Request:**
```http
POST http://localhost:5001/api/quizzes
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "Calculus Fundamentals",
  "subject": "mathematics",
  "difficulty": "medium",
  "timeLimit": 30,
  "questions": [
    {
      "question": "What is the derivative of x²?",
      "options": ["2x", "x", "x²", "2"],
      "correctAnswer": 0,
      "explanation": "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x",
      "points": 1
    },
    {
      "question": "What is ∫x dx?",
      "options": ["x²/2 + C", "x + C", "2x + C", "x²"],
      "correctAnswer": 0,
      "explanation": "The integral of x is x²/2 + C (don't forget the constant!)",
      "points": 1
    }
  ]
}
```

**Response:**
```json
{
  "message": "Quiz created successfully",
  "quiz": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "title": "Calculus Fundamentals",
    "subject": "mathematics",
    "difficulty": "medium",
    "timeLimit": 30,
    "questions": [
      {
        "question": "What is the derivative of x²?",
        "options": ["2x", "x", "x²", "2"],
        "points": 1,
        "_id": "65f1a2b3c4d5e6f7g8h9i0j6"
      }
    ],
    "createdAt": "2024-03-15T10:30:00.000Z"
  }
}
```

### Get Quiz (for taking)

**Request:**
```http
GET http://localhost:5001/api/quizzes/65f1a2b3c4d5e6f7g8h9i0j5
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "quiz": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "title": "Calculus Fundamentals",
    "subject": "mathematics",
    "difficulty": "medium",
    "timeLimit": 30,
    "questions": [
      {
        "question": "What is the derivative of x²?",
        "options": ["2x", "x", "x²", "2"],
        "points": 1
      }
    ]
  }
}
```
*Note: Correct answers are not sent when retrieving a quiz to take*

### Submit Quiz

**Request:**
```http
POST http://localhost:5001/api/quizzes/65f1a2b3c4d5e6f7g8h9i0j5/submit
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "answers": [
    {
      "selectedAnswer": 0,
      "timeTaken": 15
    },
    {
      "selectedAnswer": 0,
      "timeTaken": 20
    }
  ],
  "timeTaken": 35
}
```

**Response:**
```json
{
  "message": "Quiz submitted successfully",
  "result": {
    "score": 2,
    "totalQuestions": 2,
    "percentage": "100.00",
    "timeTaken": 35,
    "answers": [
      {
        "questionIndex": 0,
        "selectedAnswer": 0,
        "isCorrect": true,
        "correctAnswer": 0,
        "explanation": "Using the power rule...",
        "timeTaken": 15
      },
      {
        "questionIndex": 1,
        "selectedAnswer": 0,
        "isCorrect": true,
        "correctAnswer": 0,
        "explanation": "The integral of x is...",
        "timeTaken": 20
      }
    ]
  }
}
```

---

## 🏆 Progress & Analytics

### Get Dashboard

**Request:**
```http
GET http://localhost:5001/api/progress/dashboard
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "progress": {
    "overallLevel": 5,
    "totalXP": 4500,
    "streakDays": 7,
    "achievements": [
      {
        "name": "First Quiz",
        "description": "Completed your first quiz",
        "unlockedAt": "2024-03-10T10:30:00.000Z",
        "icon": "🎯"
      },
      {
        "name": "Perfect Score",
        "description": "Got 100% on a quiz",
        "unlockedAt": "2024-03-12T14:20:00.000Z",
        "icon": "🌟"
      }
    ],
    "statistics": {
      "totalStudyTime": 1500,
      "totalSessions": 30,
      "totalQuizzesTaken": 15,
      "averageQuizScore": 87.5
    }
  },
  "recentActivity": {
    "sessions": [
      {
        "subject": "mathematics",
        "duration": 45,
        "startTime": "2024-03-15T09:00:00.000Z"
      }
    ],
    "quizResults": [
      {
        "quizId": {
          "title": "Calculus Fundamentals",
          "subject": "mathematics"
        },
        "score": 8,
        "percentage": 80
      }
    ]
  },
  "statistics": {
    "totalNotes": 25,
    "totalFlashcards": 50,
    "dueFlashcardsCount": 5,
    "weeklyStudyTime": 300
  }
}
```

### Get Subject Analytics

**Request:**
```http
GET http://localhost:5001/api/progress/subject/mathematics
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "subject": "mathematics",
  "statistics": {
    "totalStudyTime": 600,
    "totalSessions": 12,
    "totalQuizzes": 8,
    "avgQuizScore": "85.50",
    "totalFlashcards": 20,
    "flashcardAccuracy": "88.50",
    "totalNotes": 15
  },
  "studyTrend": [
    {
      "date": "2024-03-09",
      "studyTime": 45,
      "sessionCount": 1
    },
    {
      "date": "2024-03-10",
      "studyTime": 90,
      "sessionCount": 2
    }
  ]
}
```

### Get Leaderboard

**Request:**
```http
GET http://localhost:5001/api/progress/leaderboard
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "topstudent",
      "level": 10,
      "xp": 10500,
      "achievements": 15
    },
    {
      "rank": 2,
      "username": "student123",
      "level": 5,
      "xp": 4500,
      "achievements": 5
    }
  ],
  "currentUser": {
    "rank": 2,
    "level": 5,
    "xp": 4500
  }
}
```

---

## 🤖 AI Engine

### Get AI Response

**Request:**
```http
POST http://localhost:3001/api/respond
Content-Type: application/json

{
  "message": "Explain Newton's second law of motion",
  "sessionId": "user123"
}
```

**Response:**
```json
{
  "reply": "**Newton's 2nd Law (F=ma):**\n\nForce = Mass × Acceleration\nF = ma\n\nThis means:\n- Greater mass requires more force for same acceleration\n- Greater force produces greater acceleration\n- If force is constant, lighter objects accelerate more\n\n**Example:** Pushing a shopping cart (light) vs pushing a car (heavy) requires different forces for the same acceleration.\n\nWould you like me to explain further or provide practice problems?",
  "subject": "physics",
  "confidence": 0.85,
  "context": {
    "messageCount": 2,
    "subjects": ["physics"],
    "topics": []
  }
}
```

### Get Study Tip

**Request:**
```http
GET http://localhost:3001/api/study-tip
```

**Response:**
```json
{
  "tip": "**Pomodoro Technique:** Study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout."
}
```

---

## 📋 Error Responses

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 400 Bad Request
```json
{
  "error": "Title and content are required"
}
```

### 404 Not Found
```json
{
  "error": "Study note not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to create study note",
  "timestamp": "2024-03-15T10:30:00.000Z"
}
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

### Create Note
```bash
curl -X POST http://localhost:5001/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test","content":"Content","subject":"mathematics"}'
```

---

## 🌐 Using in JavaScript

### Fetch Example
```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'pass123'
    })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
};

// Create Note
const createNote = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5001/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'My Note',
      content: 'Note content here',
      subject: 'mathematics'
    })
  });
  return await response.json();
};
```

---

That's it! Use these examples to interact with your AI Student Companion API. 🚀
