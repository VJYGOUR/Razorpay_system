import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
