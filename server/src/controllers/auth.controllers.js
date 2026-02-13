import client from "../lib/redis.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import storeRefreshToken from "../utils/storeRefreshToken.js";

// 🔹 Handle /me endpoint
export const me = async (req, res) => {
  console.log(req.user);
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        plan: req.user.plan || "free",
        businessName: req.user.businessName || `${req.user.name}'s Business`,
        profileImage: req.user.profileImage || null,
        subscriptionId: req.user.subscriptionId,
        subscriptionStatus: req.user.subscriptionStatus,
      },
    });
  } catch (err) {
    console.error("❌ Me endpoint error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Logout user
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await client.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check Redis
    const storedToken = await client.get(`refresh_token:${decoded.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or revoked refresh token",
      });
    }

    // Issue new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    // Set access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ success: true, message: "Access token refreshed" });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res
      .status(401)
      .json({ success: false, message: "Session expired, please login again" });
  }
};

// 🔹 Google OAuth callback handler
export const googleCallback = async (req, res) => {
  try {
    const user = req.user; // req.user populated by Passport Google strategy

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }

    // Create access and refresh tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" },
    );

    // Store refresh token in Redis
    await storeRefreshToken(user._id, refreshToken);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to frontend
    res.redirect(process.env.FRONTEND_URL); //React app reloads (full page navigation).
  } catch (err) {
    console.error("Google callback error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during Google login" });
  }
};
