import Flashcard from '../models/Flashcard.js';

// Spaced repetition algorithm (SM-2)
const calculateNextReview = (quality, flashcard) => {
    let { easeFactor, interval, repetitions } = flashcard;

    if (quality >= 3) {
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    } else {
        repetitions = 0;
        interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return { easeFactor, interval, repetitions, nextReview };
};

// Create a new flashcard
export const createFlashcard = async (req, res) => {
    try {
        const { question, answer, subject, deck, difficulty } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }

        const flashcard = new Flashcard({
            userId: req.user._id,
            question,
            answer,
            subject,
            deck: deck || 'General',
            difficulty: difficulty || 'medium'
        });

        await flashcard.save();
        res.status(201).json({ message: 'Flashcard created successfully', flashcard });
    } catch (error) {
        console.error('Create flashcard error:', error);
        res.status(500).json({ error: 'Failed to create flashcard' });
    }
};

// Get all flashcards for a user
export const getFlashcards = async (req, res) => {
    try {
        const { subject, deck, difficulty } = req.query;

        let query = { userId: req.user._id };

        if (subject) query.subject = subject;
        if (deck) query.deck = deck;
        if (difficulty) query.difficulty = difficulty;

        const flashcards = await Flashcard.find(query).sort({ createdAt: -1 });
        res.json({ flashcards });
    } catch (error) {
        console.error('Get flashcards error:', error);
        res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
};

// Get flashcards due for review
export const getDueFlashcards = async (req, res) => {
    try {
        const now = new Date();
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            nextReview: { $lte: now }
        }).sort({ nextReview: 1 }).limit(20);

        res.json({ flashcards, count: flashcards.length });
    } catch (error) {
        console.error('Get due flashcards error:', error);
        res.status(500).json({ error: 'Failed to fetch due flashcards' });
    }
};

// Review a flashcard
export const reviewFlashcard = async (req, res) => {
    try {
        const { quality } = req.body; // quality: 0-5 (0 = complete blackout, 5 = perfect recall)

        if (quality === undefined || quality < 0 || quality > 5) {
            return res.status(400).json({ error: 'Quality must be between 0 and 5' });
        }

        const flashcard = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        // Update review statistics
        const reviewData = calculateNextReview(quality, flashcard);
        flashcard.easeFactor = reviewData.easeFactor;
        flashcard.interval = reviewData.interval;
        flashcard.repetitions = reviewData.repetitions;
        flashcard.nextReview = reviewData.nextReview;
        flashcard.lastReviewed = new Date();
        flashcard.timesReviewed += 1;

        if (quality >= 3) {
            flashcard.correctCount += 1;
        } else {
            flashcard.incorrectCount += 1;
        }

        await flashcard.save();

        res.json({
            message: 'Flashcard reviewed successfully',
            flashcard,
            nextReview: reviewData.nextReview
        });
    } catch (error) {
        console.error('Review flashcard error:', error);
        res.status(500).json({ error: 'Failed to review flashcard' });
    }
};

// Update a flashcard
export const updateFlashcard = async (req, res) => {
    try {
        const { question, answer, subject, deck, difficulty } = req.body;

        const flashcard = await Flashcard.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { question, answer, subject, deck, difficulty },
            { new: true, runValidators: true }
        );

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        res.json({ message: 'Flashcard updated successfully', flashcard });
    } catch (error) {
        console.error('Update flashcard error:', error);
        res.status(500).json({ error: 'Failed to update flashcard' });
    }
};

// Delete a flashcard
export const deleteFlashcard = async (req, res) => {
    try {
        const flashcard = await Flashcard.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        console.error('Delete flashcard error:', error);
        res.status(500).json({ error: 'Failed to delete flashcard' });
    }
};

// Get flashcard statistics
export const getFlashcardStats = async (req, res) => {
    try {
        const totalCards = await Flashcard.countDocuments({ userId: req.user._id });
        const dueCards = await Flashcard.countDocuments({
            userId: req.user._id,
            nextReview: { $lte: new Date() }
        });

        const flashcards = await Flashcard.find({ userId: req.user._id });

        const totalReviews = flashcards.reduce((sum, card) => sum + card.timesReviewed, 0);
        const totalCorrect = flashcards.reduce((sum, card) => sum + card.correctCount, 0);
        const totalIncorrect = flashcards.reduce((sum, card) => sum + card.incorrectCount, 0);

        const accuracy = totalReviews > 0 ? (totalCorrect / (totalCorrect + totalIncorrect) * 100).toFixed(2) : 0;

        res.json({
            totalCards,
            dueCards,
            totalReviews,
            accuracy,
            bySubject: flashcards.reduce((acc, card) => {
                acc[card.subject] = (acc[card.subject] || 0) + 1;
                return acc;
            }, {})
        });
    } catch (error) {
        console.error('Get flashcard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch flashcard statistics' });
    }
};
