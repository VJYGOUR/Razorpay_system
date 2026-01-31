import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}! This is a protected route.` });
});

export default router;
