import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import { isAxiosError } from "axios";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post<{ token: string }>("/admin/login", {
        email,
        password,
      });

      localStorage.setItem("admin_token", data.token);
      navigate("/admin/console");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 text-gray-200">
      <div className="max-w-md w-full bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-white text-center">
          Admin Login
        </h1>
        <p className="text-sm text-gray-400 text-center">
          Secure access to the MERN Payment System Admin Console
        </p>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center">
          Forgot password? Contact your system administrator.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
