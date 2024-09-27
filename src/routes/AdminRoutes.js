import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard';
import AdminSignUp from '../pages/Admin/Signup/Signup';
import AdminLogin from '../pages/Admin/Login/Login';

const AdminRoutes = ({ setUserRole }) => {
  const isAuthenticated = localStorage.getItem('userToken') !== null;

  return (
    <Routes>
      <Route path="signup" element={<AdminSignUp setUserRole={setUserRole} />} />
      <Route path="login" element={<AdminLogin setUserRole={setUserRole} />} />
      {isAuthenticated ? (
        <Route path="dashboard" element={<AdminDashboard />} />
      ) : (
        <Route path="dashboard" element={<Navigate to="/admin/login" replace />} />
      )}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;