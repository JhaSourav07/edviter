import User from "../models/User.js";
import Profile from "../models/Profile.js";

export const syncUser = async (req, res) => {
  try {
    // req.user comes from our verifyFirebaseToken middleware!
    const { uid, email } = req.user;

    // The frontend will send the requested role ('editor' or 'business') in the body
    // If they logged in with Google, we might also get a name and picture
    const { role, displayName, photoURL } = req.body;

    // 1. Check if the user already exists in our database
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // User exists, just return their data
      return res.status(200).json({
        success: true,
        message: "User already synced",
        user,
      });
    }

    // 2. If user doesn't exist, validate the role (crucial for security)
    if (!["editor", "business"].includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role provided" });
    }

    // 3. Create the User in MongoDB
    user = await User.create({
      firebaseUid: uid,
      email: email,
      role: role,
    });

    // 4. Create their associated Profile
    // If they used Google Auth, we can use their Google name and photo as defaults
    await Profile.create({
      userId: user._id,
      displayName: displayName || email.split("@")[0], // Fallback to email prefix
      avatarUrl: photoURL || "", // Later, we can replace this with a Cloudinary upload
    });

    return res.status(201).json({
      success: true,
      message: "User synced and profile created successfully",
      user,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during sync" });
  }
};
