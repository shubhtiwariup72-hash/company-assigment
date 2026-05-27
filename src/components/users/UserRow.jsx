import { memo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import { formatDate } from "../../utils/helpers";

const UserRow = memo(({ user, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
      <td className="td-cell">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
          </div>
        </div>
      </td>
      <td className="td-cell text-gray-500 dark:text-gray-400">{user.email}</td>
      <td className="td-cell"><Badge value={user.role} /></td>
      <td className="td-cell"><Badge value={user.status} /></td>
      <td className="td-cell text-gray-500 dark:text-gray-400">{formatDate(user.createdAt)}</td>
      <td className="td-cell">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/dashboard/users/${user.id}`)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            title="View"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onEdit(user)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
});

UserRow.displayName = "UserRow";
export default UserRow;
