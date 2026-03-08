import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indexed because we will frequently query "all gigs by this business"
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Gig", gigSchema);
