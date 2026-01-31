import { useState } from "react";
import axios from "../axios/axios";
import type {
  CreateOrderResponse,
  VerifyPaymentPayload,
} from "../types/razorpay";

const TEST_AMOUNT = 100; // ₹1.00 (paise)

const TestPayment: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const startPayment = async (): Promise<void> => {
    try {
      setLoading(true);
      setMessage("");

      // 1. Create order
      const { data } = await axios.post<CreateOrderResponse>(
        "/payments/create-order",
        { amount: TEST_AMOUNT },
      );

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
        amount: data.amount,
        currency: "INR",
        name: "MERN Payment System",
        description: "Test Razorpay Payment (Sandbox)",
        order_id: data.orderId,

        handler: async (response: RazorpayPaymentResponse): Promise<void> => {
          const payload: VerifyPaymentPayload = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          await axios.post("/payments/verify", payload);
          setMessage("✅ Payment successful and verified");
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
            <span className="text-indigo-400 font-medium">Test / Sandbox</span>
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
          {loading ? "Opening Checkout..." : "Pay ₹1 (Test)"}
        </button>

        {/* RESULT */}
        {message && (
          <div className="text-center text-sm font-medium">{message}</div>
        )}

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center">
          No real money is charged. Payments use Razorpay test credentials.
        </p>
      </div>
    </div>
  );
};

export default TestPayment;
