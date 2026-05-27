import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeLabels = {
  dashboard: "Dashboard",
  users: "Users",
  products: "Products",
  reports: "Reports",
  settings: "Settings",
  add: "Add",
  edit: "Edit",
};

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home size={14} />
        <span>Home</span>
      </Link>

      {segments.map((segment, idx) => {
        const path = "/" + segments.slice(0, idx + 1).join("/");
        const label = routeLabels[segment] || segment;
        const isLast = idx === segments.length - 1;

        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-gray-400" />
            {isLast ? (
              <span className="text-gray-800 dark:text-gray-200 font-medium">{label}</span>
            ) : (
              <Link
                to={path}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
