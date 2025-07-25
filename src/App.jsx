import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import NewSession from "@/components/pages/NewSession";
import History from "@/components/pages/History";
import SessionDetail from "@/components/pages/SessionDetail";
import Login from "@/components/pages/Login";
import Profile from "@/components/pages/Profile";
import UserManagement from "@/components/pages/UserManagement";
import Certifications from "@/components/pages/Certifications";

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppContent() {
  const { currentTheme } = useTheme();
  
return (
    <div className={`min-h-screen transition-colors duration-300 ${
      currentTheme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : currentTheme === 'dive'
        ? 'bg-gradient-to-br from-ocean-deep to-gray-900 text-sky-100'
        : currentTheme === 'sunset'
        ? 'bg-gradient-to-br from-orange-100 to-yellow-100 text-amber-800'
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Routes>
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/new-session" element={
            <ProtectedRoute>
              <NewSession />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/session/:id" element={
            <ProtectedRoute>
              <SessionDetail />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/certifications" element={
            <ProtectedRoute>
              <Certifications />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={currentTheme === 'light' || currentTheme === 'sunset' ? 'light' : 'dark'}
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;