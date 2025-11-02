import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    focus: {
        type: String,
        trim: true
    },
    productivity: {
        type: Number, // 1-10 scale
        min: 1,
        max: 10,
        default: 5
    },
    notes: {
        type: String
    },
    activities: [{
        type: String,
        timestamp: Date,
        description: String
    }],
    goals: [{
        type: String
    }],
    goalsCompleted: [{
        type: String
    }],
    breaks: [{
        startTime: Date,
        endTime: Date,
        duration: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const StudySession = mongoose.model('StudySession', studySessionSchema);

export default StudySession;
