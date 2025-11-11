import JWT from "jsonwebtoken";
import userModel from "../models/authModel.js";

// Check token
export const requiresignin = async (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log("JWT verify error:", error.message);
    return res.status(401).json({
      success: false,
      error: true,
      message: "Invalid or expired token",
    });
  }
};

// Check admin role
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user?.role != 1) {
      return res.status(403).json({ success: false, message: "Unauthorized Access" });
    }

    next(); // ✅ only go ahead if admin
  } catch (error) {
    console.error("isAdmin error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error verifying admin access",
    });
  }
};
