import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Card = mongoose.model('Card', cardSchema);
export default Card;