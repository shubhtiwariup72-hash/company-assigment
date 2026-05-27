import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/users", icon: Users, label: "Users" },
  { to: "/dashboard/products", icon: Package, label: "Products" },
  { to: "/dashboard/reports", icon: BarChart3, label: "Reports" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-800 z-30 flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-white font-bold text-lg">Nopser</span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">
            Main Menu
          </p>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => window.innerWidth < 768 && onClose()}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            © 2026 Nopser Research Pvt Ltd
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
