import express from 'express';
const router = express.Router();
import Card from '../modules/card.model.js';

// Create Card
router.post('/', async(req, res) => {
    try {
        const card = new Card(req.body);
        await card.save();
        res.status(201).json(card);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read All Cards
router.get('/', async(req, res) => {
    try {
        const cards = await Card.find().sort({ timestamp: -1 });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read Single Card
router.get('/:id', async(req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        res.json(card);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Card
router.put('/:id', async(req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!card) return res.status(404).json({ error: 'Card not found' });
        res.json(card);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Card
router.delete('/:id', async(req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        res.json({ message: 'Card deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;