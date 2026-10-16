import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import InternList from './pages/admin/InternList';
import TaskList from './pages/admin/TaskList';

// Intern Pages
import InternDashboard from './pages/intern/InternDashboard';
import InternTasks from './pages/intern/InternTasks';
import InternProgress from './pages/intern/InternProgress';
import InternProfile from './pages/intern/InternProfile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <LoadingSpinner label="Checking workspace credentials..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return (
      <Navigate
        to={role === 'admin' ? '/admin/dashboard' : '/intern/dashboard'}
        replace
      />
    );
  }

  return children;
};

// Root Redirect Component
const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <LoadingSpinner label="Loading InternPulse..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={role === 'admin' ? '/admin/dashboard' : '/intern/dashboard'}
      replace
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '500',
              boxShadow: '0 10px 25px -3px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="interns" element={<InternList />} />
            <Route path="tasks" element={<TaskList />} />
          </Route>

          {/* Intern Protected Routes */}
          <Route
            path="/intern"
            element={
              <ProtectedRoute allowedRole="intern">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/intern/dashboard" replace />} />
            <Route path="dashboard" element={<InternDashboard />} />
            <Route path="tasks" element={<InternTasks />} />
            <Route path="progress" element={<InternProgress />} />
            <Route path="profile" element={<InternProfile />} />
          </Route>

          {/* Catch-all and Root Redirect */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
