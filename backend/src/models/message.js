import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: String,
    text: String,
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);