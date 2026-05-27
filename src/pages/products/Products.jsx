import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../api/productApi";
import ProductForm from "../../components/products/ProductForm";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import useDebounce from "../../hooks/useDebounce";
import { formatCurrency, formatDate } from "../../utils/helpers";

const PAGE_SIZE = 6;

const Products = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState({ type: null, data: null });

  const debouncedSearch = useDebounce(search, 400);

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category))].sort();
    return unique;
  }, [products]);

  const createMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      closeModal();
    },
  });

  const editMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      closeModal();
    },
  });

  const closeModal = useCallback(() => setModal({ type: null, data: null }), []);
  const openAdd = useCallback(() => setModal({ type: "add", data: null }), []);
  const openEdit = useCallback((p) => setModal({ type: "edit", data: p }), []);
  const openDelete = useCallback((p) => setModal({ type: "delete", data: p }), []);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return products.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, debouncedSearch, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFormSubmit = useCallback((payload) => {
    if (modal.type === "add") createMutation.mutate(payload);
    else editMutation.mutate({ id: modal.data.id, data: payload });
  }, [modal, createMutation, editMutation]);

  if (isLoading) return <Loader text="Loading products..." />;

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-medium">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Products</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="form-input w-40"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="form-input w-36"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="th-cell">Product Name</th>
                <th className="th-cell">Price</th>
                <th className="th-cell">Category</th>
                <th className="th-cell">Status</th>
                <th className="th-cell">Created</th>
                <th className="th-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="td-cell font-medium text-gray-800 dark:text-white">{product.name}</td>
                    <td className="td-cell text-green-600 dark:text-green-400 font-medium">{formatCurrency(product.price)}</td>
                    <td className="td-cell"><Badge value={product.category} /></td>
                    <td className="td-cell"><Badge value={product.status} /></td>
                    <td className="td-cell text-gray-500 dark:text-gray-400">{formatDate(product.createdAt)}</td>
                    <td className="td-cell">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => openDelete(product)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modal.type === "add" || modal.type === "edit"}
        onClose={closeModal}
        title={modal.type === "add" ? "Add New Product" : "Edit Product"}
      >
        <ProductForm
          initialData={modal.data}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isLoading={createMutation.isPending || editMutation.isPending}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={modal.type === "delete"} onClose={closeModal} title="Delete Product" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{modal.data?.name}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => deleteMutation.mutate(modal.data?.id)}
              disabled={deleteMutation.isPending}
              className="btn-danger flex-1 justify-center"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
            <button onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
