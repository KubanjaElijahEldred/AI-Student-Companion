import mongoose from 'mongoose';

const studyNoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        enum: ['mathematics', 'physics', 'chemistry', 'biology', 'history', 'geography', 'literature', 'computer_science', 'other'],
        default: 'other'
    },
    tags: [{
        type: String,
        trim: true
    }],
    importance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    lastReviewed: {
        type: Date,
        default: Date.now
    },
    reviewCount: {
        type: Number,
        default: 0
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
studyNoteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const StudyNote = mongoose.model('StudyNote', studyNoteSchema);

export default StudyNote;
