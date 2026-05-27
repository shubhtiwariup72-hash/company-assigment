import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/common/Loader";

const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Users = lazy(() => import("../pages/users/Users"));
const UserDetail = lazy(() => import("../pages/users/UserDetail"));
const Products = lazy(() => import("../pages/products/Products"));
const Reports = lazy(() => import("../pages/reports/Reports"));
const Settings = lazy(() => import("../pages/settings/Settings"));

const AppRoutes = () => (
  <Suspense fallback={<Loader fullScreen />}>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
