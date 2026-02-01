import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* ───────────────── AUTH ───────────────── */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    // Google OAuth
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows email+password users later
    },

    // Password auth (optional, future-proof)
    password: {
      type: String,
      select: false,
    },

    authProvider: {
      type: String,
      enum: ["google", "password"],
      default: "google",
    },

    /* ─────────────── BILLING CORE ─────────────── */
    razorpayCustomerId: {
      type: String,
      index: true,
    },

    /* ───────────── SUBSCRIPTION (SaaS) ───────────── */
    subscription: {
      plan: {
        type: String,
        enum: ["free", "starter", "pro", "enterprise"],
        default: "free",
      },

      subscriptionId: String, // Razorpay subscription ID
      status: {
        type: String,
        enum: ["active", "paused", "cancelled", "expired"],
      },

      currentPeriodEnd: Date,
    },

    /* ───────────── ONE-TIME PAYMENTS ───────────── */
    purchases: [
      {
        orderId: String,
        paymentId: String,
        amount: Number,
        currency: {
          type: String,
          default: "INR",
        },
        purpose: String, // "ebook", "credits", "lifetime_access"
        paidAt: Date,
      },
    ],

    /* ───────────── ACCOUNT STATE ───────────── */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
