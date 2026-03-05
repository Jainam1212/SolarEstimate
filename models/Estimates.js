import mongoose from "mongoose";

const EstimateSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    userPointers: { type: Array, default: {} },
    userEstimateData: { type: Object, default: {} },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.EstimateModel ||
  mongoose.model("EstimateModel", EstimateSchema);
