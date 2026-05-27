import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/statsApi";
import { getUsers } from "../../api/userApi";
import { getProducts } from "../../api/productApi";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import Loader from "../../components/common/Loader";
import { formatCurrency } from "../../utils/helpers";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

const Reports = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,
  });
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
  });
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = statsLoading || usersLoading || productsLoading;
  if (isLoading) return <Loader text="Loading reports..." />;

  // User role distribution
  const roleData = [
    { name: "Admin", value: users.filter((u) => u.role === "admin").length },
    { name: "User", value: users.filter((u) => u.role === "user").length },
  ];

  // User status distribution
  const statusData = [
    { name: "Active", value: users.filter((u) => u.status === "active").length },
    { name: "Inactive", value: users.filter((u) => u.status === "inactive").length },
  ];

  // Product category distribution
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  // Top products by price
  const topProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 6)
    .map((p) => ({ name: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name, price: p.price }));

  const summaryCards = [
    { label: "Total Users", value: String(users.length), sub: `${users.filter((u) => u.status === "active").length} active` },
    { label: "Total Products", value: String(products.length), sub: `${products.filter((p) => p.status === "active").length} active` },
    { label: "Total Revenue", value: formatCurrency(products.filter((p) => p.status === "active").reduce((s, p) => s + p.price, 0)), sub: "Active products" },
    { label: "Avg Product Price", value: formatCurrency(products.length ? products.reduce((s, p) => s + p.price, 0) / products.length : 0), sub: "All products" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Overview of system activity and metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{card.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Roles Pie */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Status Pie */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">User Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products by Price */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-5">Top Products by Price</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topProducts} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v) => [formatCurrency(v), "Price"]}
              contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }}
            />
            <Bar dataKey="price" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trend */}
      {stats?.monthlyStats && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-5">Monthly Revenue vs User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.monthlyStats} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              <Bar yAxisId="right" dataKey="users" name="Users" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Reports;
