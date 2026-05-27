import { memo } from "react";

const variants = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  user: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  electronics: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  accessories: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  audio: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  furniture: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  storage: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const Badge = memo(({ value }) => {
  const key = value?.toLowerCase() || "default";
  const cls = variants[key] || variants.default;
  return (
    <span className={`badge ${cls} capitalize`}>{value || "—"}</span>
  );
});

Badge.displayName = "Badge";
export default Badge;
