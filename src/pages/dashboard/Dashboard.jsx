import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, Package, DollarSign } from "lucide-react";
import { getStats } from "../../api/statsApi";
import StatsCard from "../../components/dashboard/StatsCard";
import UserGrowthChart from "../../components/dashboard/UserGrowthChart";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Loader from "../../components/common/Loader";
import { formatCurrency } from "../../utils/helpers";

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <Loader text="Loading dashboard..." />;

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-medium">Failed to load dashboard data.</p>
        <p className="text-gray-400 text-sm mt-1">Unable to reach the server. Please try again shortly.</p>
      </div>
    );
  }

  const cards = [
    { title: "Total Users", value: data?.totalUsers ?? 0, icon: Users, color: "blue", trend: "+12% this month" },
    { title: "Active Users", value: data?.activeUsers ?? 0, icon: UserCheck, color: "green", trend: "+8% this month" },
    { title: "Total Products", value: data?.totalProducts ?? 0, icon: Package, color: "purple", trend: "+5% this month" },
    { title: "Revenue", value: formatCurrency(data?.revenue ?? 0), icon: DollarSign, color: "orange", trend: "+18% this month" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Overview</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <UserGrowthChart data={data?.monthlyStats} />
        <RevenueChart data={data?.monthlyStats} />
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Admin Users", value: "3", color: "text-purple-600" },
            { label: "Inactive Users", value: String((data?.totalUsers ?? 0) - (data?.activeUsers ?? 0)), color: "text-red-500" },
            { label: "Active Products", value: String(data?.totalProducts ?? 0), color: "text-green-600" },
            { label: "Avg. Revenue/Month", value: formatCurrency((data?.revenue ?? 0) / 8), color: "text-blue-600" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
