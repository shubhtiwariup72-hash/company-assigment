import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatK = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`);

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Revenue Trend</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Monthly revenue overview</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatK} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
            contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }}
          />
          <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
