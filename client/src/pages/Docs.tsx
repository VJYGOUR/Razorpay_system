import { Link } from "react-router-dom";

const Docs = () => {
  return (
    <div className="min-h-screen bg-[#0b0f1a] px-4 py-16 text-gray-200">
      <div className="max-w-4xl mx-auto bg-[#0f172a] rounded-2xl shadow-2xl border border-white/10 p-8 md:p-12 space-y-16">
        {/* HERO */}
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white">
            Integration Documentation
          </h1>
          <p className="text-lg text-gray-400">
            Production-ready Razorpay payment infrastructure for MERN
            applications. Designed for real-world billing systems.
          </p>
        </section>

        {/* SCOPE */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            What This Kit Includes
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
            <div>✔ One-time payments</div>
            <div>✔ Subscription & recurring billing</div>
            <div>✔ Razorpay order & customer creation</div>
            <div>✔ Secure webhook verification</div>
            <div>✔ JWT authentication</div>
            <div>✔ Role-based access control (RBAC)</div>
            <div>✔ Billing portal session & redirects</div>
            <div>✔ Admin-ready architecture</div>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Architecture Overview
          </h2>

          <p className="text-gray-400">
            The system follows a clean and scalable payment flow:
          </p>

          <div className="bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-gray-200">
            Client (React) → Backend (Express) → Razorpay APIs → Webhooks →
            MongoDB
          </div>
        </section>

        {/* INSTALLATION */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Installation</h2>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-100">Backend Setup</h3>
            <ol className="list-decimal pl-6 text-gray-400 space-y-1">
              <li>Clone the repository</li>
              <li>Navigate to the server directory</li>
              <li>
                Run{" "}
                <code className="bg-black/50 px-2 py-0.5 rounded text-indigo-400">
                  npm install
                </code>
              </li>
              <li>
                Create a{" "}
                <code className="bg-black/50 px-2 py-0.5 rounded text-indigo-400">
                  .env
                </code>{" "}
                file
              </li>
              <li>
                Start server using{" "}
                <code className="bg-black/50 px-2 py-0.5 rounded text-indigo-400">
                  npm start
                </code>
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-100">Frontend Setup</h3>
            <ol className="list-decimal pl-6 text-gray-400 space-y-1">
              <li>Navigate to the client directory</li>
              <li>Update API base URL</li>
              <li>
                Run{" "}
                <code className="bg-black/50 px-2 py-0.5 rounded text-indigo-400">
                  npm install
                </code>
              </li>
              <li>
                Start client using{" "}
                <code className="bg-black/50 px-2 py-0.5 rounded text-indigo-400">
                  npm run dev
                </code>
              </li>
            </ol>
          </div>
        </section>

        {/* ENV VARS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Environment Variables
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-white/10 text-sm">
              <thead className="bg-black/40 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Variable</th>
                  <th className="p-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  ["RAZORPAY_KEY_ID", "Razorpay API key ID"],
                  ["RAZORPAY_KEY_SECRET", "Razorpay API secret"],
                  ["RAZORPAY_WEBHOOK_SECRET", "Webhook signature verification"],
                  ["JWT_SECRET", "JWT authentication secret"],
                  ["MONGO_URI", "MongoDB connection string"],
                  ["CLIENT_URL", "Frontend base URL"],
                ].map(([key, desc]) => (
                  <tr key={key} className="border-t border-white/10">
                    <td className="p-3 text-indigo-400">{key}</td>
                    <td className="p-3">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PAYMENT FLOW */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Payment Flow</h2>

          <div>
            <h3 className="font-semibold text-gray-100 mb-2">
              One-Time Payment
            </h3>
            <ol className="list-decimal pl-6 text-gray-400 space-y-1">
              <li>Create Razorpay order</li>
              <li>Open Razorpay checkout</li>
              <li>Verify payment signature</li>
              <li>Persist transaction securely</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-100 mb-2">
              Subscription Billing
            </h3>
            <ol className="list-decimal pl-6 text-gray-400 space-y-1">
              <li>Create customer</li>
              <li>Attach plan & subscription</li>
              <li>Handle recurring charges</li>
              <li>Confirm events via webhooks</li>
            </ol>
          </div>
        </section>

        {/* WEBHOOKS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Webhooks & Security</h2>

          <p className="text-gray-400">
            All webhook events are verified using Razorpay’s signature mechanism
            to prevent spoofing and unauthorized callbacks.
          </p>
        </section>

        {/* TEST MODE */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Test Mode vs Live Mode
          </h2>

          <p className="text-gray-400">
            Use Razorpay test keys to simulate payments safely. Switch to live
            mode by updating environment variables only.
          </p>
        </section>

        {/* CTA */}
        <section className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
          <Link
            to="/payments/test"
            className="flex-1 text-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            Run Test Payment
          </Link>

          <Link
            to="/admin/login"
            className="flex-1 text-center px-6 py-3 rounded-lg bg-black hover:bg-gray-900 text-white font-semibold transition"
          >
            Open Admin Console
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Docs;
