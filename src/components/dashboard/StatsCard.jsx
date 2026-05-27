import { memo } from "react";
import { TrendingUp } from "lucide-react";

const StatsCard = memo(({ title, value, icon: Icon, color, trend }) => {
  const colors = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800" },
    green: { bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-600 dark:text-green-400", border: "border-green-100 dark:border-green-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-800" },
    orange: { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "text-orange-600 dark:text-orange-400", border: "border-orange-100 dark:border-orange-800" },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className={`card p-5 flex items-start justify-between group hover:shadow-md transition-shadow`}>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${c.bg}`}>
        <Icon size={22} className={c.icon} />
      </div>
    </div>
  );
});

StatsCard.displayName = "StatsCard";
export default StatsCard;
