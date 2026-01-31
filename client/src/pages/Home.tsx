import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import PersonalIllustration from "../assets/personal.svg";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Checking backend...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get("/health");
        setStatus(res.data.message);
      } catch {
        setStatus("Backend not reachable");
        setError(true);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 overflow-x-hidden text-gray-200">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <span className="mx-auto md:mx-0 w-fit px-4 py-1 rounded-full text-sm font-medium bg-indigo-700/30 text-indigo-400">
            Production-Ready Payment Infrastructure
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Razorpay Payment System
            <span className="text-indigo-400"> for MERN Apps</span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto md:mx-0">
            Secure, scalable, and drop-in payment gateway with subscriptions,
            webhooks, and role-based access control — built for real projects.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300 max-w-xl mx-auto md:mx-0">
            <div>✅ One-time & recurring payments</div>
            <div>✅ Razorpay orders & customers</div>
            <div>✅ Webhook verification</div>
            <div>✅ JWT auth & RBAC</div>
            <div>✅ Billing portal sessions</div>
            <div>✅ Plug-and-play structure</div>
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-center md:justify-start gap-3 text-sm mt-2">
            <span
              className={`h-2 w-2 rounded-full ${
                error ? "bg-red-500" : "bg-green-500"
              }`}
            />
            <span className="font-medium text-gray-400">Backend:</span>
            <span
              className={`font-semibold ${
                error ? "text-red-500" : "text-green-400"
              }`}
            >
              {status}
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/docs")}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-800/30 transition"
            >
              Integration Docs
            </button>

            <button
              onClick={() => navigate("/payments/test")}
              className="px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-200 font-semibold shadow-sm transition"
            >
              Test Payment Flow
            </button>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative flex justify-center">
          {/* Glow only on md+ */}
          <div className="hidden md:block absolute -inset-6 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-3xl opacity-20" />

          <div className="relative bg-[#111827] rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700 max-w-md w-full">
            <div className="aspect-square flex items-center justify-center">
              <img
                src={PersonalIllustration}
                alt="Payment System"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="mt-6 text-center">
              <h3 className="font-semibold text-white">
                Admin & Billing Console
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Secure control over customers, subscriptions, and payments
              </p>

              <button
                onClick={() => navigate("/admin/login")}
                className="mt-4 w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
              >
                Open Admin Console
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
