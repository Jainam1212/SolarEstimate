import mongoose from "mongoose";

const SessionSchema = mongoose.Schema({
  sessionId: { type: String, unique: true, required: true },
  createdBy: { type: String, required: true },
});
SessionSchema.index({ createdBy: 1 });
export default mongoose.model("SessionModel", SessionSchema);
