import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { jwtDecode } from "jwt-decode";
import ConfirmationModal from "./ConfirmationModal";
import { Menu, X, Car, User, Calendar, Shield, LogOut, LogIn } from "lucide-react";

// Helper function to get user role
const getUserRole = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    return jwtDecode(token).role;
  } catch (e) {
    return null;
  }
};

const Navbar = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const userRole = getUserRole();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoutRequest = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    authService.logout();
    setShowLogoutConfirm(false);
    navigate("/login");
    window.location.reload();
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Enhanced NavLink styling with modern effects
  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-lg font-medium transition-all duration-300 no-underline group ${
      isActive
        ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
        : "text-slate-300 hover:text-white hover:bg-white/10"
    }`;
  
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 no-underline ${
        isActive 
          ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg" 
          : "text-slate-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <NavLink
              to="/"
              className="flex items-center space-x-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-400 transition-all duration-300 no-underline group"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:block">Ignition Hub</span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink to="/" className={navLinkClass}>
                <span className="flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span>Home</span>
                </span>
              </NavLink>
              
              {token && userRole !== "ADMIN" && (
                <>
                  <NavLink to="/my-bookings" className={navLinkClass}>
                    <span className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>My Bookings</span>
                    </span>
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass}>
                    <span className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </span>
                  </NavLink>
                </>
              )}
              
              {userRole === "ADMIN" && (
                <NavLink to="/admin/bookings" className={navLinkClass}>
                  <span className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </span>
                </NavLink>
              )}
            </div>

            {/* Desktop Auth Button */}
            <div className="hidden lg:flex items-center">
              {token ? (
                <button
                  onClick={handleLogoutRequest}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl no-underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Register</span>
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                  }`} 
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 space-y-2 border-t border-slate-700/50">
              <NavLink 
                to="/" 
                onClick={closeMenu} 
                className={mobileNavLinkClass}
              >
                <Car className="w-5 h-5 mr-3" />
                <span>Home</span>
              </NavLink>
              
              {token && userRole !== "ADMIN" && (
                <>
                  <NavLink 
                    to="/my-bookings" 
                    onClick={closeMenu} 
                    className={mobileNavLinkClass}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>My Bookings</span>
                  </NavLink>
                  <NavLink 
                    to="/profile" 
                    onClick={closeMenu} 
                    className={mobileNavLinkClass}
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span>Profile</span>
                  </NavLink>
                </>
              )}
              
              {userRole === "ADMIN" && (
                <NavLink 
                  to="/admin/bookings" 
                  onClick={closeMenu} 
                  className={mobileNavLinkClass}
                >
                  <Shield className="w-5 h-5 mr-3" />
                  <span>Admin Panel</span>
                </NavLink>
              )}

              {/* Mobile Auth Button */}
              <div className="pt-3 border-t border-slate-700/50 mt-3">
                {token ? (
                  <button
                    onClick={() => {
                      handleLogoutRequest();
                      closeMenu();
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold transition-all duration-300 hover:from-red-700 hover:to-pink-700 shadow-lg"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 shadow-lg no-underline"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    <span>Login / Register</span>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showLogoutConfirm}
        onHide={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        body="Are you sure you want to log out of your account?"
        confirmText="Logout"
        confirmVariant="danger"
      />
    </>
  );
};

export default Navbar;