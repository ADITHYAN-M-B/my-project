import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Admin', 'Editor', 'Viewer'] 
  },
  permissions: {
    type: [String],
    default: []
  }
});

export default mongoose.model('Role', roleSchema);
