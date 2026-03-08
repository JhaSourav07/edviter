import Gig from "../models/Gig.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc    Create a new Gig
// @route   POST /api/v1/gigs
// @access  Private (Business only)
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // req.dbUser is securely provided by our requireRole middleware
    const gig = await Gig.create({
      businessId: req.dbUser._id,
      title,
      description,
      budget,
    });

    res.status(201).json({ success: true, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply to a Gig
// @route   POST /api/v1/gigs/:gigId/apply
// @access  Private (Editor only)
export const applyToGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { coverLetter, proposedPrice } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open") {
      return res
        .status(400)
        .json({ success: false, message: "Gig is not available" });
    }

    const application = await Application.create({
      gigId,
      editorId: req.dbUser._id,
      coverLetter,
      proposedPrice,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    // Catch the duplicate index error we set up in the schema
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already applied to this gig",
        });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept an application and create a Job
// @route   POST /api/v1/applications/:applicationId/accept
// @access  Private (Business only)
export const acceptApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application =
      await Application.findById(applicationId).populate("gigId");
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // SECURITY CHECK: Did THIS business actually post THIS gig?
    // If we don't check this, Business A could accept an application on Business B's gig!
    if (application.gigId.businessId.toString() !== req.dbUser._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to manage this gig" });
    }

    if (application.gigId.status !== "open") {
      return res
        .status(400)
        .json({ success: false, message: "Gig is no longer open" });
    }

    // 1. Create the Job contract
    const job = await Job.create({
      gigId: application.gigId._id,
      applicationId: application._id,
      businessId: req.dbUser._id,
      editorId: application.editorId,
      agreedPrice: application.proposedPrice,
    });

    // 2. Update Application and Gig statuses
    application.status = "accepted";
    await application.save();

    application.gigId.status = "in_progress";
    await application.gigId.save();

    // In a real startup, we would also update all other pending applications for this gig to 'rejected' here.

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
