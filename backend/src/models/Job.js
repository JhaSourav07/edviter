import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    editorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agreedPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["working", "in_review", "revision_requested", "approved"],
      default: "working",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
