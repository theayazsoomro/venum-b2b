import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

// Generate JWT token - CORRECTED to include role
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      userId, 
      role 
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: "7d",
    }
  );
};

// POST /api/auth/login - Login user - CORRECTED
router.post("/login", async (req, res) => { // REMOVED auth middleware
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user and include password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await user.correctPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token with role
    const token = generateToken(user._id, user.role);

    // Remove password from response
    const userResponse = {
      email: user.email,
      role: user.role,
      _id: user._id
    };

    // CORRECTED response structure to match frontend expectations
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
});

// GET /api/auth/me - Get current user (protected route)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        _id: user._id
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user information",
    });
  }
});

// POST /api/auth/logout - Logout user
router.post("/logout", auth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
});

export default router;