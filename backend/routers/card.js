import express from 'express';
const router = express.Router();
import Card from '../modules/card.model.js';
import passport from 'passport'; // Import passport

// All routes below will now require JWT authentication

// Create Card
// Only authenticated users can create cards, and the card will be linked to them.
router.post('/', passport.authenticate('jwt', { session: false }), async(req, res) => {
    try {
        const { title, description, status } = req.body;
        // Ensure the user ID from the authenticated session is used
        const card = new Card({
            title,
            description,
            status,
            user: req.user._id, // Assign the card to the authenticated user
        });
        await card.save();
        res.status(201).json(card);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read All Cards for the authenticated user
// Only retrieves cards belonging to the logged-in user.
router.get('/', passport.authenticate('jwt', { session: false }), async(req, res) => {
    try {
        const cards = await Card.find({ user: req.user._id }).sort({ timestamp: -1 }); // Filter by user ID
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read Single Card by ID for the authenticated user
// Retrieves a specific card only if it belongs to the logged-in user.
router.get('/:id', passport.authenticate('jwt', { session: false }), async(req, res) => {
    try {
        // Find by _id AND user ID to ensure ownership
        const card = await Card.findOne({ _id: req.params.id, user: req.user._id });
        if (!card) return res.status(404).json({ error: 'Card not found or not owned by user' });
        res.json(card);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Card
// Updates a card only if it belongs to the authenticated user.
router.put('/:id', passport.authenticate('jwt', { session: false }), async(req, res) => {
    try {
        const { title, description, status } = req.body;
        // Find and update by _id AND user ID to ensure ownership
        const card = await Card.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { title, description, status }, { new: true });
        if (!card) return res.status(404).json({ error: 'Card not found or not owned by user' });
        res.json(card);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Card
// Deletes a card only if it belongs to the authenticated user.
router.delete('/:id', passport.authenticate('jwt', { session: false }), async(req, res) => {
    try {
        // Find and delete by _id AND user ID to ensure ownership
        const card = await Card.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!card) return res.status(404).json({ error: 'Card not found or not owned by user' });
        res.json({ message: 'Card deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;