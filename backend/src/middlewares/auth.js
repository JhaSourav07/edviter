import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Firebase Token Verification Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // 1. Find the user in our DB using the Firebase UID from the previous middleware
      const user = await User.findOne({ firebaseUid: req.user.uid });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found in database" });
      }

      // 2. Check if their role matches what the route requires
      if (user.role !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Requires ${requiredRole} role.`,
        });
      }

      // 3. Attach the MongoDB user object to the request so controllers don't have to fetch it again!
      req.dbUser = user;
      next();
    } catch (error) {
      console.error("Role Verification Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during role verification",
      });
    }
  };
};
