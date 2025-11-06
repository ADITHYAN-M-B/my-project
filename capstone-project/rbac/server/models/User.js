import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Editor", "Viewer"], required: true },
});

export default mongoose.model("User", userSchema);
