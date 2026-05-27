import { useState, useEffect } from "react";
import { isValidEmail } from "../../utils/helpers";

const ROLES = ["admin", "user"];
const STATUSES = ["active", "inactive"];

const defaultForm = { name: "", email: "", role: "user", status: "active", password: "" };

const UserForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name || "", email: initialData.email || "", role: initialData.role || "user", status: initialData.status || "active", password: "" });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [initialData]);

  const set = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Invalid email format";
    if (!form.role) e.role = "Role is required";
    if (!form.status) e.status = "Status is required";
    if (!isEdit && !form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status };
    if (!isEdit) payload.password = form.password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Full Name</label>
        <input className={`form-input ${errors.name ? "border-red-500" : ""}`} placeholder="John Doe" value={form.name} onChange={(e) => set("name", e.target.value)} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="form-label">Email</label>
        <input className={`form-input ${errors.email ? "border-red-500" : ""}`} type="email" placeholder="john@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      {!isEdit && (
        <div>
          <label className="form-label">Password</label>
          <input className={`form-input ${errors.password ? "border-red-500" : ""}`} type="password" placeholder="••••••••" value={form.password} onChange={(e) => set("password", e.target.value)} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Role</label>
          <select className="form-input" value={form.role} onChange={(e) => set("role", e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Status</label>
          <select className="form-input" value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? "Saving…" : isEdit ? "Update User" : "Create User"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
