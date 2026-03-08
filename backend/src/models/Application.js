import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true,
    },
    editorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: { type: String, required: true },
    proposedPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Prevent an editor from applying to the same gig twice
applicationSchema.index({ gigId: 1, editorId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
