import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        enum: ['mathematics', 'physics', 'chemistry', 'biology', 'history', 'geography', 'literature', 'computer_science', 'other'],
        default: 'other'
    },
    deck: {
        type: String,
        default: 'General'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    // Spaced repetition algorithm data
    easeFactor: {
        type: Number,
        default: 2.5
    },
    interval: {
        type: Number,
        default: 0
    },
    repetitions: {
        type: Number,
        default: 0
    },
    nextReview: {
        type: Date,
        default: Date.now
    },
    lastReviewed: {
        type: Date
    },
    timesReviewed: {
        type: Number,
        default: 0
    },
    correctCount: {
        type: Number,
        default: 0
    },
    incorrectCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;
