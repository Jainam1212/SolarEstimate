import mongoose from "mongoose";

const CreditSchema = mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    credits: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.CreditModel ||
  mongoose.model("CreditModel", CreditSchema);
