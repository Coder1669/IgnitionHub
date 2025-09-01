// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarDetailPage from './pages/CarDetailPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminRoute from './components/AdminRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyBookingsPage from './pages/MyBookingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; 


// Import Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManageCars from './pages/admin/ManageCars';
import ManageUsers from './pages/admin/ManageUsers';

// ✅ IMPORT THE NEW PROFILE PAGE
import ProfilePage from './pages/ProfilePage';


// ✅ 1. IMPORT THE NEW ScrollToTop COMPONENT
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div className="pb-5">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            {/* ✅ ADD THE ROUTE FOR THE PROFILE PAGE */}
            <Route path="/profile" element={<ProfilePage />} />
            {/* You can add more user-protected routes here */}
          </Route>

          {/* --- Admin Routes --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="cars" element={<ManageCars />} />
              <Route path="users" element={<ManageUsers />} />
            </Route>
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;