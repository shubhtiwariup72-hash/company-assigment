import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeLabels = {
  dashboard: "Dashboard",
  users: "Users",
  products: "Products",
  reports: "Reports",
  settings: "Settings",
};

// Matches MongoDB ObjectIds, UUIDs, and short IDs like u1, p12, etc.
const isIdSegment = (segment) =>
  /^[0-9a-f]{24}$/.test(segment) ||          // MongoDB ObjectId
  /^[0-9a-f-]{36}$/.test(segment) ||          // UUID v4
  /^[0-9a-f-]{8,}$/.test(segment) ||          // UUID partial / other hex
  /^[up]\d+$/.test(segment);                  // legacy short IDs: u1, p12

// Derive a readable label for an ID segment based on its parent segment
const idLabel = (prevSegment) => {
  if (prevSegment === "users") return "User Detail";
  if (prevSegment === "products") return "Product Detail";
  return "Detail";
};

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home size={14} />
        <span>Home</span>
      </Link>

      {segments.map((segment, idx) => {
        const path = "/" + segments.slice(0, idx + 1).join("/");
        const isId = isIdSegment(segment);
        const label = isId
          ? idLabel(segments[idx - 1])
          : routeLabels[segment] || segment;
        const isLast = idx === segments.length - 1;

        // Don't make ID segments clickable links (they don't have their own index page)
        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-gray-400" />
            {isLast || isId ? (
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
