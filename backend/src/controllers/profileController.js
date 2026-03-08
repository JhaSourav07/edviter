import User from "../models/User.js";
import Profile from "../models/Profile.js";

// @desc    Get current user's profile
// @route   GET /api/v1/profiles/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    // 1. Find the internal MongoDB user using the Firebase UID from the token
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2. Find their profile and populate the user data (like email and role)
    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "email role",
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/v1/profiles/me
// @access  Private
export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Destructure the allowed fields from the request body so users can't inject malicious data
    const { displayName, avatarUrl, bio, skills, portfolioUrls, companyName } =
      req.body;

    // Build the update object dynamically based on what was provided
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (avatarUrl) updateData.avatarUrl = avatarUrl; // We will plug Cloudinary URLs in here later

    // Role-specific updates
    if (user.role === "editor") {
      if (bio) updateData.bio = bio;
      if (skills) updateData.skills = skills;
      if (portfolioUrls) updateData.portfolioUrls = portfolioUrls;
    } else if (user.role === "business") {
      if (companyName) updateData.companyName = companyName;
    }

    // Find and update the profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: updateData },
      { new: true, runValidators: true }, // Return the updated document and run schema rules
    ).populate("userId", "email role");

    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
