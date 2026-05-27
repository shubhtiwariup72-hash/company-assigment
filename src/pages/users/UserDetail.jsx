import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, Shield, Calendar, Activity } from "lucide-react";
import { getUserById } from "../../api/userApi";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import { formatDate } from "../../utils/helpers";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg mt-0.5">
      <Icon size={15} className="text-gray-500 dark:text-gray-400" />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white mt-0.5">{value}</p>
    </div>
  </div>
);

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <Loader text="Loading user..." />;

  if (isError || !user) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-medium">User not found.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <button onClick={() => navigate(-1)} className="btn-ghost gap-2">
        <ArrowLeft size={16} />
        Back to Users
      </button>

      <div className="card p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-5 pb-5 border-b border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold flex-shrink-0">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge value={user.role} />
              <Badge value={user.status} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-0">
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
          <InfoRow icon={Shield} label="Role" value={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} />
          <InfoRow icon={Activity} label="Account Status" value={user.status?.charAt(0).toUpperCase() + user.status?.slice(1)} />
          <InfoRow icon={Calendar} label="Registered On" value={formatDate(user.createdAt)} />
          {user.updatedAt && (
            <InfoRow icon={Calendar} label="Last Updated" value={formatDate(user.updatedAt)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
