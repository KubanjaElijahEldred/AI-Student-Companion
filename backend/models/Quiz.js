import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: Number,
        required: true
    },
    explanation: {
        type: String
    },
    points: {
        type: Number,
        default: 1
    }
});

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        enum: ['mathematics', 'physics', 'chemistry', 'biology', 'history', 'geography', 'literature', 'computer_science', 'other'],
        default: 'other'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    questions: [quizQuestionSchema],
    timeLimit: {
        type: Number, // in minutes
        default: 30
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answers: [{
        questionIndex: Number,
        selectedAnswer: Number,
        isCorrect: Boolean,
        timeTaken: Number // in seconds
    }],
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number, // in seconds
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export { Quiz, QuizResult };
