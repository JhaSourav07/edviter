import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {

    // link to Firebase
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["editor", "business"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
