import mongoose from 'mongoose';

const subjectProgressSchema = new mongoose.Schema({
    subject: String,
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    topics: [{
        name: String,
        mastery: {
            type: Number,
            default: 0
        },
        lastStudied: Date
    }],
    strengths: [String],
    weaknesses: [String]
});

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    overallLevel: {
        type: Number,
        default: 1
    },
    totalXP: {
        type: Number,
        default: 0
    },
    streakDays: {
        type: Number,
        default: 0
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    subjects: [subjectProgressSchema],
    achievements: [{
        name: String,
        description: String,
        unlockedAt: Date,
        icon: String
    }],
    studyGoals: [{
        goal: String,
        targetDate: Date,
        completed: {
            type: Boolean,
            default: false
        },
        progress: {
            type: Number,
            default: 0
        }
    }],
    statistics: {
        totalStudyTime: {
            type: Number,
            default: 0
        }, // in minutes
        totalSessions: {
            type: Number,
            default: 0
        },
        totalQuizzesTaken: {
            type: Number,
            default: 0
        },
        averageQuizScore: {
            type: Number,
            default: 0
        },
        totalFlashcardsReviewed: {
            type: Number,
            default: 0
        },
        totalNotesCreated: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
progressSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
