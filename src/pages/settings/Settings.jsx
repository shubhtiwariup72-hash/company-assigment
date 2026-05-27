import { useState, useContext } from "react";
import { Sun, Moon, Bell, BellOff, User, Save, Check } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import useAuth from "../../hooks/useAuth";

const Settings = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    if (!profile.name.trim()) e.name = "Name is required";
    if (!profile.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) e.email = "Invalid email";
    return e;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <User size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Profile Information</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update your personal details</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
              {profile.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">{profile.name || "Admin"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>

          <div>
            <label className="form-label">Full Name</label>
            <input
              className={`form-input ${errors.name ? "border-red-500" : ""}`}
              value={profile.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              className={`form-input ${errors.email ? "border-red-500" : ""}`}
              type="email"
              value={profile.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <button type="submit" className="btn-primary">
            {saved ? (
              <><Check size={15} /> Saved!</>
            ) : (
              <><Save size={15} /> Save Changes</>
            )}
          </button>
        </form>
      </div>

      {/* Theme Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            {isDark ? <Moon size={18} className="text-yellow-500" /> : <Sun size={18} className="text-yellow-500" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Appearance</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Customize the look of the dashboard</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isDark ? "Currently using dark theme" : "Currently using light theme"}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isDark ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}`}
            role="switch"
            aria-checked={isDark}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${isDark ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Bell size={18} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Configure notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive notifications via email" },
            { label: "Push Notifications", desc: "Receive in-app notifications" },
            { label: "Activity Alerts", desc: "Get alerts for important system events" },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications((p) => !p)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${i === 0 && notifications ? "bg-blue-600" : i > 0 ? "bg-blue-600" : "bg-gray-200"}`}
                role="switch"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 translate-x-6`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
