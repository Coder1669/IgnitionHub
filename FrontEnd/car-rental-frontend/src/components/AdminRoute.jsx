import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const getUserRole = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role; // This assumes your JWT has a 'role' claim
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const AdminRoute = () => {
  const userRole = getUserRole();

  // If the user is not an admin, redirect them to the login page.
  if (userRole !== 'ADMIN') {
    return <Navigate to="/login" />;
  }

  // If the user is an admin, show the content of the admin page.
  return <Outlet />;
};

export default AdminRoute;