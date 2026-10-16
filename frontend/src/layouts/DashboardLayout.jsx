import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const routeTitles = {
  '/admin/dashboard': 'Admin Overview',
  '/admin/interns': 'Intern Management',
  '/admin/tasks': 'Task Management',
  '/intern/dashboard': 'Intern Dashboard',
  '/intern/tasks': 'My Assigned Tasks',
  '/intern/progress': 'My Progress & Milestones',
  '/intern/profile': 'My Profile & Settings',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Match title from map or default
  const title = routeTitles[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
