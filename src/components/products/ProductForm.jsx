import { useState, useEffect } from "react";

const CATEGORIES = ["Electronics", "Accessories", "Audio", "Furniture", "Storage", "Other"];
const STATUSES = ["active", "inactive"];

const defaultForm = { name: "", price: "", category: "Electronics", status: "active" };

const ProductForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name || "", price: initialData.price?.toString() || "", category: initialData.category || "Electronics", status: initialData.status || "active" });
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
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price) e.price = "Price is required";
    else if (isNaN(form.price) || parseFloat(form.price) < 0) e.price = "Price must be a non-negative number";
    if (!form.category) e.category = "Category is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSubmit({ name: form.name.trim(), price: parseFloat(form.price), category: form.category, status: form.status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Product Name</label>
        <input className={`form-input ${errors.name ? "border-red-500" : ""}`} placeholder="Laptop Pro 15" value={form.name} onChange={(e) => set("name", e.target.value)} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="form-label">Price ($)</label>
        <input className={`form-input ${errors.price ? "border-red-500" : ""}`} type="number" step="0.01" min="0" placeholder="0.00" value={form.price} onChange={(e) => set("price", e.target.value)} />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
          {isLoading ? "Saving…" : initialData ? "Update Product" : "Add Product"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
      </div>
    </form>
  );
};

export default ProductForm;
