// controllers/payment.controller.js
import razorpay from "../razorpay.js";
import Enrollment from "../models/enrollment.models.js";
import Cohort from "../models/cohort.models.js";
import Payment from "../models/payment.models.js";
import crypto from "crypto";

/**
 * Create Razorpay order for an enrollment
 * Idempotent: multiple clicks return the same order if pending
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Auth middleware sets req.user
    const { enrollmentId } = req.body;

    // 1️⃣ Validate enrollment
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      userId,
      status: "pending", // only allow pending enrollments
    });

    if (!enrollment) {
      return res.status(400).json({ message: "Invalid enrollment" });
    }
    // 2️⃣ Block already-paid enrollments
    if (enrollment.status === "paid") {
      return res.status(400).json({
        message: "Payment already completed for this enrollment",
      });
    }
    // 2️⃣ Get cohort price
    const cohort = await Cohort.findById(enrollment.cohortId);
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    const amountInPaise = cohort.price * 100; // Razorpay expects paise

    // 3️⃣ Check existing pending payment (idempotency)
    let payment = await Payment.findOne({
      enrollmentId,
      status: "created", // still waiting for payment
    });

    if (!payment) {
      // 3️⃣a Create Razorpay order
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `enroll_${enrollmentId}`,
      });

      // 3️⃣b Save payment record
      payment = await Payment.create({
        userId,
        enrollmentId,
        razorpayOrderId: order.id,
        amount: cohort.price,
        status: "created",
      });
    }

    // 4️⃣ Return order info to frontend
    return res.json({
      orderId: payment.razorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};
// controllers/payment.controller.js

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // 1️⃣ Find payment record
    const payment = await Payment.findOne({
      razorpayOrderId: orderId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // 2️⃣ Generate expected signature
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // 3️⃣ Compare signatures
    if (expectedSignature !== signature) {
      payment.status = "failed";
      await payment.save();

      return res.status(400).json({ message: "Invalid payment signature" });
    }
    if (payment.status === "paid") {
      // already processed by webhook, do not overwrite
      return res.json({ message: "Payment already captured via webhook" });
    }
    // 4️⃣ Mark payment as paid
    payment.status = "verified";
    payment.razorpayPaymentId = paymentId;
    payment.razorpaySignature = signature;
    await payment.save();

    // 5️⃣ Activate enrollment
    await Enrollment.findByIdAndUpdate(payment.enrollmentId, {
      status: "verified",
    });

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    // 1️⃣ Webhook triggered
    console.log("💡 Razorpay Webhook triggered");
    console.log("Headers:", req.headers);
    console.log("Raw body length:", req.body.length);

    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 2️⃣ Signature verification
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body) // RAW buffer
      .digest("hex");

    console.log(`expected ${expectedSignature}, received ${signature}`);

    if (expectedSignature !== signature) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    console.log("✅ Webhook signature verified");

    // 3️⃣ Parse JSON from raw body
    const eventData = JSON.parse(req.body.toString());
    const event = eventData.event;
    const payload = eventData.payload;

    console.log("EVENT TYPE:", event);
    console.log(
      "ORDER ID:",
      payload?.payment?.entity?.order_id,
      "PAYMENT ID:",
      payload?.payment?.entity?.id,
    );

    // 4️⃣ Handle payment captured
    if (event === "payment.captured") {
      console.log("payment captured executed ---------------------------");

      const razorpayPaymentId = payload.payment.entity.id;
      const razorpayOrderId = payload.payment.entity.order_id;

      const payment = await Payment.findOne({ razorpayOrderId });
      console.log("Payment found in DB:", payment ? true : false);
      console.log("Payment status before update:", payment?.status);

      // Idempotency: skip if already paid
      if (!payment || payment.status === "paid") {
        console.log("Payment already processed, skipping DB update");
        return res.json({ ok: true });
      }

      // 5️⃣ Update payment record
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.status = "paid";
      await payment.save();
      console.log("Payment updated:", payment);

      // 6️⃣ Update enrollment
      await Enrollment.findByIdAndUpdate(payment.enrollmentId, {
        status: "paid",
      });
      console.log(
        "Enrollment status updated to 'paid' for ID:",
        payment.enrollmentId,
      );
    }

    // 7️⃣ Handle payment failed
    if (event === "payment.failed") {
      const razorpayOrderId = payload.payment.entity.order_id;
      console.log("Payment failed for order:", razorpayOrderId);

      const payment = await Payment.findOne({ razorpayOrderId });
      if (payment) {
        payment.status = "failed";
        await payment.save();
        console.log("Payment status updated to 'failed' in DB");
      }
    }

    // 8️⃣ Respond to Razorpay
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Webhook processing failed:", err);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};
