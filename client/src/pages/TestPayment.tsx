import { useState } from "react";
import axios from "../axios/axios";
import { useAuth } from "../context/AuthContext";
import type {
  CreateOrderResponse,
  VerifyPaymentPayload,
} from "../types/razorpay";
import { loadRazorpay } from "../utils/loadRazorpay";

const TEST_AMOUNT = 100; // ₹1.00 (paise)

const TestPayment: React.FC = () => {
  const { user, openLoginModal, loginOpen } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  console.log("componet is executed");
  const logout = async () => {
    const res = await axios.post("/auth/logout");
    console.log(res);
  };
  const startPayment = async (): Promise<void> => {
    if (!user) {
      // Open login modal if not logged in
      console.log("no user");
      console.log(loginOpen);
      console.log(openLoginModal);
      openLoginModal();
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const loaded = await loadRazorpay();
      if (!loaded) {
        setMessage("❌ Razorpay SDK failed to load");
        return;
      }

      // 1️⃣ Create Razorpay order (backend will also create customer if needed)
      const { data } = await axios.post<CreateOrderResponse>(
        "/payments/create-order",
        {
          amount: TEST_AMOUNT,
        },
      );

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "MERN Payment System",
        description: "Test Razorpay Payment (Sandbox)",
        order_id: data.orderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        config: {
          display: {
            blocks: {
              selected_methods: {
                name: "Choose Payment Method",
                instruments: [
                  { method: "wallet" },
                  { method: "card" },
                  { method: "paylater" },
                ],
              },
            },
            sequence: ["block.selected_methods"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },

        handler: async (response: RazorpayPaymentResponse): Promise<void> => {
          const payload: VerifyPaymentPayload = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          const res = await axios.post("/payments/verify", payload);
          if (res.data.success) {
            setMessage("✅ Payment successful and verified");
          } else {
            setMessage("✅ Payment successful and verified");
          }
        },

        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      setMessage("❌ Payment failed or cancelled");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 text-gray-200">
        <div className="max-w-md w-full bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">Test Payment</h1>
            <p className="text-sm text-gray-400">
              Razorpay sandbox checkout (demo only)
            </p>
          </div>

          {/* INFO */}
          <div className="bg-black/40 rounded-lg border border-white/10 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="font-semibold text-white">₹1.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mode</span>
              <span className="text-indigo-400 font-medium">
                Test / Sandbox
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gateway</span>
              <span className="font-medium">Razorpay</span>
            </div>
          </div>

          {/* ACTION */}
          <button
            onClick={startPayment}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold transition"
          >
            {loading
              ? "Opening Checkout..."
              : user
                ? "Pay ₹1 (Test)"
                : "Login to Pay"}
          </button>

          {/* RESULT */}
          {message && (
            <div className="text-center text-sm font-medium">{message}</div>
          )}
        </div>
        <button onClick={logout} className="hover:cursor">
          LOgout
        </button>
      </div>
    </>
  );
};

export default TestPayment;
