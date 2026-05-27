import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen((p) => !p)} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-6 py-4">
            <div className="mb-4">
              <Breadcrumb />
            </div>
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
