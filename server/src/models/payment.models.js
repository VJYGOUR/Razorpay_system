import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    /* ───────────── RELATION ───────────── */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ───────────── PAYMENT TYPE ───────────── */
    type: {
      type: String,
      enum: ["one_time", "subscription"],
      required: true,
    },

    purpose: {
      type: String,
      // examples: "starter_plan", "pro_plan", "credits", "lifetime_access"
    },

    /* ───────────── RAZORPAY IDS ───────────── */
    razorpayOrderId: {
      type: String,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      index: true,
    },

    razorpaySignature: String,

    razorpaySubscriptionId: {
      type: String,
      index: true,
    },

    razorpayCustomerId: {
      type: String,
      index: true,
    },

    /* ───────────── MONEY ───────────── */
    amount: {
      type: Number,
      required: true, // in paise
    },

    currency: {
      type: String,
      default: "INR",
    },

    /* ───────────── STATUS ───────────── */
    status: {
      type: String,
      enum: [
        "created", // order created
        "authorized", // payment authorized
        "paid", // payment successful
        "failed",
        "refunded",
      ],
      default: "created",
      index: true,
    },

    /* ───────────── REFUND (OPTIONAL) ───────────── */
    refund: {
      refundId: String,
      amount: Number,
      refundedAt: Date,
    },

    /* ───────────── METADATA ───────────── */
    notes: {
      type: Map,
      of: String,
    },

    /* ───────────── AUDIT ───────────── */
    paidAt: Date,
    failureReason: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Payment", paymentSchema);
