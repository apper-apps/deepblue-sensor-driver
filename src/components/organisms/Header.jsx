import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, logout, isAdmin, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { to: "/", label: "Dashboard", icon: "BarChart3" },
    { to: "/new-session", label: "New Session", icon: "Plus" },
    { to: "/history", label: "History", icon: "Clock" },
    { to: "/certifications", label: "Certifications", icon: "Award" }
  ];

  if (isAdmin) {
    navItems.push({ to: "/users", label: "Users", icon: "Users" });
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
    setShowProfileMenu(false);
  };

  const ProfileDropdown = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
      </div>
      <button
        onClick={() => {
          navigate("/profile");
          setShowProfileMenu(false);
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
      >
        <ApperIcon name="User" size={16} className="mr-2" />
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
      >
        <ApperIcon name="LogOut" size={16} className="mr-2" />
        Logout
      </button>
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-depth-gradient rounded-lg flex items-center justify-center">
              <ApperIcon name="Waves" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold font-display text-gray-900">
              DeepBlue Log
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700 border border-primary-200"
                      : "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                  )
                }
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
</nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-primary-700 hover:bg-primary-50"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-primary-600" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium">
                  {user?.firstName}
                </span>
                <ApperIcon name="ChevronDown" size={16} />
              </button>
              {showProfileMenu && <ProfileDropdown />}
            </div>

            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-600 hover:text-primary-700 hover:bg-primary-50">
                <ApperIcon name="Menu" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary-700 bg-primary-50"
                    : "text-gray-600 hover:text-primary-700"
                )
              }
            >
              <ApperIcon name={item.icon} size={20} className="mb-1" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;