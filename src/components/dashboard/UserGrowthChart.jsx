import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserGrowthChart = ({ data = [] }) => {
  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">User Growth</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Monthly registered users</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }}
          />
          <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#userGradient)" dot={{ fill: "#3b82f6", r: 3 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
