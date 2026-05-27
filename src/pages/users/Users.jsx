import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter } from "lucide-react";
import { getUsers, addUser, updateUser, deleteUser } from "../../api/userApi";
import UserRow from "../../components/users/UserRow";
import UserForm from "../../components/users/UserForm";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import useDebounce from "../../hooks/useDebounce";

const PAGE_SIZE = 6;

const Users = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState({ type: null, data: null });

  const debouncedSearch = useDebounce(search, 400);

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      closeModal();
    },
  });

  const editMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      closeModal();
    },
  });

  const closeModal = useCallback(() => setModal({ type: null, data: null }), []);
  const openAdd = useCallback(() => setModal({ type: "add", data: null }), []);
  const openEdit = useCallback((user) => setModal({ type: "edit", data: user }), []);
  const openDelete = useCallback((user) => setModal({ type: "delete", data: user }), []);

  const filteredUsers = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, debouncedSearch, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  }, []);

  const handleFormSubmit = useCallback((payload) => {
    if (modal.type === "add") {
      createMutation.mutate(payload);
    } else if (modal.type === "edit") {
      editMutation.mutate({ id: modal.data.id, data: payload });
    }
  }, [modal, createMutation, editMutation]);

  const isMutating = createMutation.isPending || editMutation.isPending;

  if (isLoading) return <Loader text="Loading users..." />;

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-medium">Failed to load users.</p>
        <p className="text-gray-400 text-sm mt-1">Check that the backend is running.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400 hidden sm:block" />
          <select
            className="form-input w-36"
            value={roleFilter}
            onChange={handleFilterChange(setRoleFilter)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select
            className="form-input w-36"
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="th-cell">Name</th>
                <th className="th-cell">Email</th>
                <th className="th-cell">Role</th>
                <th className="th-cell">Status</th>
                <th className="th-cell">Created</th>
                <th className="th-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <UserRow key={user.id} user={user} onEdit={openEdit} onDelete={openDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
            </p>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modal.type === "add" || modal.type === "edit"}
        onClose={closeModal}
        title={modal.type === "add" ? "Add New User" : "Edit User"}
      >
        <UserForm
          initialData={modal.data}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isLoading={isMutating}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={modal.type === "delete"} onClose={closeModal} title="Delete User" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{modal.data?.name}</strong>? This action cannot be undone.
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

export default Users;
