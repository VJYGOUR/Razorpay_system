import { useEffect, useState } from "react";
import axios from "../axios/axios";

interface Order {
  _id: string;
  amount: number;
  currency: string;
  status: "paid" | "failed" | "pending";
  createdAt: string;
  razorpay_payment_id?: string;
}

interface Subscription {
  _id: string;
  plan: string;
  customer: string;
  status: "active" | "inactive" | "cancelled";
  current_period_end: string;
}

const AdminConsole: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, subsRes] = await Promise.all([
          axios.get<Order[]>("/admin/orders"),
          axios.get<Subscription[]>("/admin/subscriptions"),
        ]);
        setOrders(ordersRes.data);
        setSubs(subsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-200 p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Console</h1>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold">
          Logout
        </button>
      </header>

      {/* STATS CARDS */}
      <section className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0f172a] p-4 rounded-xl shadow border border-white/10 text-center">
          <h2 className="text-sm text-gray-400">Total Orders</h2>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </div>
        <div className="bg-[#0f172a] p-4 rounded-xl shadow border border-white/10 text-center">
          <h2 className="text-sm text-gray-400">Total Revenue</h2>
          <p className="text-2xl font-bold text-white">
            ₹
            {orders.reduce(
              (acc, o) => (o.status === "paid" ? acc + o.amount : acc),
              0,
            )}
          </p>
        </div>
        <div className="bg-[#0f172a] p-4 rounded-xl shadow border border-white/10 text-center">
          <h2 className="text-sm text-gray-400">Active Subscriptions</h2>
          <p className="text-2xl font-bold text-white">
            {subs.filter((s) => s.status === "active").length}
          </p>
        </div>
      </section>

      {/* ORDERS TABLE */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">Orders</h2>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#111827] text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-400">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-3">{o._id}</td>
                    <td className="p-3">₹{o.amount}</td>
                    <td
                      className={`p-3 font-semibold ${
                        o.status === "paid"
                          ? "text-green-400"
                          : o.status === "failed"
                            ? "text-red-500"
                            : "text-yellow-400"
                      }`}
                    >
                      {o.status.toUpperCase()}
                    </td>
                    <td className="p-3">{o.razorpay_payment_id || "-"}</td>
                    <td className="p-3">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SUBSCRIPTIONS TABLE */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-white">Subscriptions</h2>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#111827] text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Period End</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-400">
                    No subscriptions yet.
                  </td>
                </tr>
              ) : (
                subs.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-3">{s._id}</td>
                    <td className="p-3">{s.plan}</td>
                    <td className="p-3">{s.customer}</td>
                    <td
                      className={`p-3 font-semibold ${
                        s.status === "active"
                          ? "text-green-400"
                          : s.status === "inactive"
                            ? "text-gray-400"
                            : "text-red-500"
                      }`}
                    >
                      {s.status.toUpperCase()}
                    </td>
                    <td className="p-3">
                      {new Date(s.current_period_end).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminConsole;
