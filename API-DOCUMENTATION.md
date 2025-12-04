# AI Student Companion - API Documentation

## Overview

The AI Student Companion provides a comprehensive REST API for managing study activities, flashcards, notes, quizzes, and progress tracking. All endpoints require JWT authentication except health checks.

## Base URLs

- **Backend API**: `http://localhost:5001`
- **AI Engine**: `http://localhost:3001`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "student123",
  "email": "student@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "student123",
    "email": "student@example.com",
    "level": 1,
    "totalXP": 0
  }
}
```

### Study Notes (`/api/notes`)

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Calculus Basics",
  "content": "Derivatives measure the rate of change...",
  "subject": "mathematics",
  "importance": "high",
  "tags": ["calculus", "derivatives", "math"]
}
```

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer <token>
```

#### Search Notes
```http
GET /api/notes/search?query=calculus&subject=mathematics
Authorization: Bearer <token>
```

#### Get Single Note
```http
GET /api/notes/:id
Authorization: Bearer <token>
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

### Flashcards (`/api/flashcards`)

#### Create Flashcard
```http
POST /api/flashcards
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What is the quadratic formula?",
  "answer": "x = [-b ± √(b² - 4ac)] / 2a",
  "subject": "mathematics",
  "difficulty": "medium",
  "deck": "Algebra"
}
```

#### Get All Flashcards
```http
GET /api/flashcards
Authorization: Bearer <token>
```

#### Get Due Flashcards
```http
GET /api/flashcards/due
Authorization: Bearer <token>
```

#### Review Flashcard (Spaced Repetition)
```http
POST /api/flashcards/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "quality": 3
}
```

**Quality Scale:**
- 0: Again (completely forgot)
- 1: Hard (significant difficulty)
- 2: Good (some difficulty)
- 3: Easy (perfect recall)

#### Get Flashcard Statistics
```http
GET /api/flashcards/stats
Authorization: Bearer <token>
```

#### Update Flashcard
```http
PUT /api/flashcards/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "Updated question",
  "answer": "Updated answer"
}
```

#### Delete Flashcard
```http
DELETE /api/flashcards/:id
Authorization: Bearer <token>
```

### Study Sessions (`/api/sessions`)

#### Start Study Session
```http
POST /api/sessions/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "physics",
  "focus": "Newton's laws of motion",
  "goals": ["Understand F=ma", "Solve 10 problems"]
}
```

#### End Study Session
```http
POST /api/sessions/:id/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "productivity": 8,
  "notes": "Good focus, minimal distractions"
}
```

#### Add Break to Session
```http
POST /api/sessions/:id/break
Authorization: Bearer <token>
Content-Type: application/json

{
  "duration": 300,
  "reason": "Rest break"
}
```

#### Get All Sessions
```http
GET /api/sessions
Authorization: Bearer <token>
```

#### Get Session Statistics
```http
GET /api/sessions/stats
Authorization: Bearer <token>
```

### Quizzes (`/api/quizzes`)

#### Create Quiz
```http
POST /api/quizzes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Calculus Basics",
  "subject": "mathematics",
  "difficulty": "medium",
  "description": "Test your knowledge of basic calculus",
  "questions": [
    {
      "question": "What is the derivative of x²?",
      "options": ["2x", "x", "x²", "2"],
      "correctAnswer": 0,
      "explanation": "Using power rule: d/dx(x²) = 2x",
      "points": 1
    }
  ]
}
```

#### Generate AI Quiz
```http
POST /api/quizzes/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "chemistry",
  "topic": "atomic structure",
  "difficulty": "medium",
  "questionCount": 5
}
```

#### Get All Quizzes
```http
GET /api/quizzes
Authorization: Bearer <token>
```

#### Get Single Quiz
```http
GET /api/quizzes/:id
Authorization: Bearer <token>
```

#### Submit Quiz Answers
```http
POST /api/quizzes/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [0, 2, 1, 3, 0],
  "timeSpent": 1200
}
```

#### Get Quiz Results
```http
GET /api/quizzes/results
Authorization: Bearer <token>
```

#### Get Quiz Statistics
```http
GET /api/quizzes/stats
Authorization: Bearer <token>
```

#### Delete Quiz
```http
DELETE /api/quizzes/:id
Authorization: Bearer <token>
```

### Progress & Analytics (`/api/progress`)

#### Get User Progress
```http
GET /api/progress
Authorization: Bearer <token>
```

#### Get Dashboard Data
```http
GET /api/progress/dashboard
Authorization: Bearer <token>
```

#### Get Leaderboard
```http
GET /api/progress/leaderboard
Authorization: Bearer <token>
```

#### Get Subject Analytics
```http
GET /api/progress/subject/:subject
Authorization: Bearer <token>
```

#### Add Study Goal
```http
POST /api/progress/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Master Calculus",
  "description": "Complete calculus course",
  "targetXP": 500,
  "deadline": "2024-12-31"
}
```

#### Complete Study Goal
```http
PUT /api/progress/goals/:goalId/complete
Authorization: Bearer <token>
```

### AI Chat (`/api/chat`)

#### Send Message to AI
```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Explain the concept of derivatives",
  "sessionId": "session123"
}
```

### AI Engine (`/api/respond`)

#### Get AI Response
```http
POST /api/respond
Content-Type: application/json

{
  "message": "What is photosynthesis?",
  "userId": "user123",
  "sessionId": "session456"
}
```

#### Get Conversation Context
```http
GET /api/context/:sessionId
```

#### Clear Conversation Context
```http
DELETE /api/context/:sessionId
```

#### Get Study Tip
```http
GET /api/study-tip
```

#### Get Supported Subjects
```http
GET /api/subjects
```

## Health Check

#### System Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "online",
  "message": "AI Student Companion Backend (Advanced) is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected"
}
```

## Data Models

### User
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "level": "number",
  "totalXP": "number",
  "streak": "number",
  "achievements": ["string"],
  "preferences": {}
}
```

### StudyNote
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "content": "string",
  "subject": "string",
  "tags": ["string"],
  "importance": "low|medium|high",
  "attachments": [],
  "lastReviewed": "date",
  "reviewCount": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Flashcard
```json
{
  "id": "string",
  "userId": "string",
  "question": "string",
  "answer": "string",
  "subject": "string",
  "deck": "string",
  "difficulty": "easy|medium|hard",
  "easeFactor": "number",
  "interval": "number",
  "repetitions": "number",
  "nextReview": "date",
  "lastReviewed": "date",
  "timesReviewed": "number",
  "correctCount": "number",
  "incorrectCount": "number",
  "createdAt": "date"
}
```

### StudySession
```json
{
  "id": "string",
  "userId": "string",
  "subject": "string",
  "focus": "string",
  "goals": ["string"],
  "startTime": "date",
  "endTime": "date",
  "duration": "number",
  "productivity": "number",
  "breaks": [],
  "status": "active|completed|paused"
}
```

### Quiz
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "subject": "string",
  "difficulty": "easy|medium|hard",
  "description": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string"],
      "correctAnswer": "number",
      "explanation": "string",
      "points": "number"
    }
  ],
  "createdAt": "date"
}
```

### Progress
```json
{
  "userId": "string",
  "level": "number",
  "totalXP": "number",
  "subjectXP": {},
  "achievements": ["string"],
  "goals": [],
  "streak": "number",
  "lastStudyDate": "date"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **General endpoints**: 100 requests per minute
- **AI endpoints**: 50 requests per minute
- **Authentication**: 10 requests per minute

## WebSocket Support

Real-time features are available via WebSocket connections:
- **Chat**: `ws://localhost:5001/socket.io`
- **Live updates**: `ws://localhost:5001/live`

## Testing

Use the provided test files in the project root:
- `test-api.json` - API endpoint tests
- `test-chat.json` - Chat functionality tests
- `test-register.json` - User registration tests

## SDK Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:5001';

class StudentCompanionAPI {
  constructor(token) {
    this.token = token;
  }

  async request(method, endpoint, data = null) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  async createNote(noteData) {
    return this.request('POST', '/api/notes', noteData);
  }

  async getFlashcards() {
    return this.request('GET', '/api/flashcards');
  }

  async startSession(sessionData) {
    return this.request('POST', '/api/sessions/start', sessionData);
  }
}
```

### Python
```python
import requests

class StudentCompanionAPI:
    def __init__(self, token):
        self.base_url = 'http://localhost:5001'
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def create_note(self, note_data):
        response = requests.post(
            f'{self.base_url}/api/notes',
            json=note_data,
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def get_flashcards(self):
        response = requests.get(
            f'{self.base_url}/api/flashcards',
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
```

## Support

For API support and questions:
- Check the project documentation
- Review the test files for examples
- Inspect server logs for debugging
- Use the health check endpoint to verify service status
