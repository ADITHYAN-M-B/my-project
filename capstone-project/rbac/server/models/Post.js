import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
