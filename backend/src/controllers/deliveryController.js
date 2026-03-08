import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import r2Client from "../config/r2.js";
import Job from "../models/Job.js";
import Delivery from "../models/Delivery.js";

// @desc    Generate a presigned URL for the editor to upload a video
// @route   POST /api/v1/jobs/:jobId/deliveries/upload-url
// @access  Private (Editor only)
export const generateUploadUrl = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Verify the job exists and this editor actually owns it
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.editorId.toString() !== req.dbUser._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized for this job" });
    }

    // 2. Generate a unique, secure file key (e.g., jobs/jobId/randomString.mp4)
    const randomString = crypto.randomBytes(16).toString("hex");
    const fileKey = `jobs/${jobId}/${randomString}.mp4`;

    // 3. Create the command for R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: "video/mp4", // Force MP4 format for consistency
    });

    // 4. Generate the presigned URL (expires in 1 hour)
    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 3600,
    });

    // 5. Create a pending delivery record in MongoDB
    const delivery = await Delivery.create({
      jobId: job._id,
      editorId: req.dbUser._id,
      fileKey: fileKey,
      fileType: "raw_upload",
      status: "pending_upload",
    });

    res.status(200).json({
      success: true,
      data: {
        uploadUrl,
        fileKey,
        deliveryId: delivery._id,
      },
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error generating URL" });
  }
};
