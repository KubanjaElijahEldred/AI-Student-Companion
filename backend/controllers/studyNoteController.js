import StudyNote from '../models/StudyNote.js';

// Create a new study note
export const createStudyNote = async (req, res) => {
    try {
        const { title, content, subject, tags, importance } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const studyNote = new StudyNote({
            userId: req.user._id,
            title,
            content,
            subject,
            tags: tags || [],
            importance: importance || 'medium'
        });

        await studyNote.save();
        res.status(201).json({ message: 'Study note created successfully', note: studyNote });
    } catch (error) {
        console.error('Create study note error:', error);
        res.status(500).json({ error: 'Failed to create study note' });
    }
};

// Get all study notes for a user
export const getStudyNotes = async (req, res) => {
    try {
        const { subject, tags, sortBy = 'createdAt', order = 'desc' } = req.query;
        
        let query = { userId: req.user._id };
        
        if (subject) {
            query.subject = subject;
        }
        
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        const notes = await StudyNote.find(query).sort(sortOptions);
        res.json({ notes });
    } catch (error) {
        console.error('Get study notes error:', error);
        res.status(500).json({ error: 'Failed to fetch study notes' });
    }
};

// Get a single study note
export const getStudyNote = async (req, res) => {
    try {
        const note = await StudyNote.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!note) {
            return res.status(404).json({ error: 'Study note not found' });
        }

        // Update review count and last reviewed date
        note.reviewCount += 1;
        note.lastReviewed = Date.now();
        await note.save();

        res.json({ note });
    } catch (error) {
        console.error('Get study note error:', error);
        res.status(500).json({ error: 'Failed to fetch study note' });
    }
};

// Update a study note
export const updateStudyNote = async (req, res) => {
    try {
        const { title, content, subject, tags, importance } = req.body;

        const note = await StudyNote.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, content, subject, tags, importance },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ error: 'Study note not found' });
        }

        res.json({ message: 'Study note updated successfully', note });
    } catch (error) {
        console.error('Update study note error:', error);
        res.status(500).json({ error: 'Failed to update study note' });
    }
};

// Delete a study note
export const deleteStudyNote = async (req, res) => {
    try {
        const note = await StudyNote.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!note) {
            return res.status(404).json({ error: 'Study note not found' });
        }

        res.json({ message: 'Study note deleted successfully' });
    } catch (error) {
        console.error('Delete study note error:', error);
        res.status(500).json({ error: 'Failed to delete study note' });
    }
};

// Search study notes
export const searchStudyNotes = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const notes = await StudyNote.find({
            userId: req.user._id,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        }).sort({ updatedAt: -1 });

        res.json({ notes });
    } catch (error) {
        console.error('Search study notes error:', error);
        res.status(500).json({ error: 'Failed to search study notes' });
    }
};
