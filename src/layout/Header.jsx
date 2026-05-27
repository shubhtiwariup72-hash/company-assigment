import { Menu, Sun, Moon, Bell, LogOut, ChevronDown } from "lucide-react";
import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import useAuth from "../hooks/useAuth";

const Header = ({ onMenuToggle }) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 flex items-center justify-between">
      <button
        onClick={onMenuToggle}
        className="md:hidden btn-ghost p-2"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:flex items-center">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2 rounded-lg"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="btn-ghost p-2 rounded-lg relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                {user?.role || "admin"}
              </p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
