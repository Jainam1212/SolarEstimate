import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    userFirstName: { type: String, required: true },
    userLastName: { type: String, required: true },
    userPassword: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAddress: { type: Object, default: {} },
    isAddressDataAvailable: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.UserModel ||
  mongoose.model("UserModel", UserSchema);
