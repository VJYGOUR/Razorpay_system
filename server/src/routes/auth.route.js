import express from "express";
import passport from "passport";
import {
  googleCallback,
  logout,
  refreshToken,
  me,
} from "../controllers/auth.controllers.js";
import { protect } from "../middleware/auth.js"; // JWT cookie middleware

const router = express.Router();

// 🌐 1️⃣ Redirect to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// ✅ 2️⃣ Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback, // controller handles JWT creation + cookies
);

// 🔄 3️⃣ Refresh access token
router.post("/refresh-token", refreshToken);

// 🔐 4️⃣ Logout user (optional: protect if you want only logged-in users to logout)
router.post("/logout", protect, logout);

// 👤 5️⃣ Get current logged-in user (protected route!)
router.get("/me", protect, me);

export default router;
