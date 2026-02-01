import crypto from "crypto";
import razorpay from "../razorpay.js";
import Payment from "../models/payment.models.js";
import { ensureRazorpayCustomer } from "../utils/ ensureRazorpayCustomer.js";
import dotenv from "dotenv";
dotenv.config();
// Create Razorpay order
export const createOrder = async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  console.log(keyId);
  console.log("createorder-executed");
  try {
    const user = req.user;
    const { amount, type = "one_time" } = req.body; // type: "one_time" | "subscription"

    if (!user) return res.status(401).json({ message: "Login required" });

    // Ensure user has a Razorpay customer ID
    const customerId = await ensureRazorpayCustomer(user);

    // Create order in Razorpay
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      customer_id: customerId,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    // Save order in your DB
    await Payment.create({
      user: user._id,

      type,
      amount: order.amount,
      currency: order.currency,
      razorpayOrderId: order.id,
      razorpayCustomerId: customerId,
      status: "created",
    });

    res.json({
      orderId: order.id,
      keyId,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: "Invalid signature" });

    // Update payment status in DB
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = "paid";
    await payment.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
