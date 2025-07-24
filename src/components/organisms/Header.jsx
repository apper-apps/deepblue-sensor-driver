import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
const Header = () => {
  const { user, logout, isAdmin, isInstructor } = useAuth();
  const { currentTheme, themes, switchTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
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

const ThemeDropdown = () => (
    <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg border py-2 z-50 transition-colors ${
      currentTheme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : currentTheme === 'dive'
        ? 'bg-ocean-deep border-ocean-mid'
        : currentTheme === 'sunset'
        ? 'bg-orange-50 border-orange-200'
        : 'bg-white border-gray-200'
    }`}>
<div className={`px-4 py-2 border-b mb-2 ${
        currentTheme === 'dark' 
          ? 'border-gray-700' 
          : currentTheme === 'dive'
          ? 'border-ocean-mid'
          : currentTheme === 'sunset'
          ? 'border-orange-200'
          : 'border-gray-100'
      }`}>
        <p className={`text-sm font-medium ${
          currentTheme === 'dark' 
            ? 'text-gray-100' 
            : currentTheme === 'dive'
            ? 'text-blue-100'
            : currentTheme === 'sunset'
            ? 'text-orange-900'
            : 'text-gray-900'
        }`}>Choose Theme</p>
      </div>
      {Object.values(themes).map((theme) => (
        <button
          key={theme.value}
          onClick={() => {
            switchTheme(theme.value);
            setShowThemeMenu(false);
            toast.success(`Switched to ${theme.name}`);
          }}
className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
            currentTheme === theme.value
              ? currentTheme === 'dark'
                ? 'bg-gray-700 text-gray-100'
                : currentTheme === 'dive'
                ? 'bg-ocean-mid text-blue-100'
                : currentTheme === 'sunset'
                ? 'bg-orange-200 text-orange-900'
                : 'bg-primary-50 text-primary-700'
              : currentTheme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : currentTheme === 'dive'
                ? 'text-blue-200 hover:bg-ocean-mid/50'
                : currentTheme === 'sunset'
                ? 'text-orange-700 hover:bg-orange-100'
                : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <ApperIcon name={theme.icon} size={16} className="mr-3" />
            <div>
              <div className="font-medium">{theme.name}</div>
<div className={`text-xs ${
                currentTheme === 'dark' 
                  ? 'text-gray-400' 
                  : currentTheme === 'dive'
                  ? 'text-blue-300'
                  : currentTheme === 'sunset'
                  ? 'text-orange-600'
                  : 'text-gray-500'
              }`}>
                {theme.description}
              </div>
            </div>
          </div>
          {currentTheme === theme.value && (
            <ApperIcon name="Check" size={16} className="text-green-500" />
          )}
        </button>
      ))}
    </div>
  );

const ProfileDropdown = () => (
    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-50 transition-colors ${
      currentTheme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : currentTheme === 'dive'
        ? 'bg-ocean-deep border-ocean-mid'
        : currentTheme === 'sunset'
        ? 'bg-orange-50 border-orange-200'
        : 'bg-white border-gray-200'
    }`}>
<div className={`px-4 py-2 border-b ${
        currentTheme === 'dark' 
          ? 'border-gray-700' 
          : currentTheme === 'dive'
          ? 'border-ocean-mid'
          : currentTheme === 'sunset'
          ? 'border-orange-200'
          : 'border-gray-100'
      }`}>
        <p className={`text-sm font-medium ${
          currentTheme === 'dark' 
            ? 'text-gray-100' 
            : currentTheme === 'dive'
            ? 'text-blue-100'
            : currentTheme === 'sunset'
            ? 'text-orange-900'
            : 'text-gray-900'
        }`}>{user?.firstName} {user?.lastName}</p>
<p className={`text-xs capitalize ${
          currentTheme === 'dark' 
            ? 'text-gray-400' 
            : currentTheme === 'dive'
            ? 'text-blue-300'
            : currentTheme === 'sunset'
            ? 'text-orange-600'
            : 'text-gray-500'
        }`}>{user?.role}</p>
      </div>
      <button
        onClick={() => {
          navigate("/profile");
          setShowProfileMenu(false);
        }}
className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
          currentTheme === 'dark' 
            ? 'text-gray-300 hover:bg-gray-700' 
            : currentTheme === 'dive'
            ? 'text-blue-200 hover:bg-ocean-mid/50'
            : currentTheme === 'sunset'
            ? 'text-orange-700 hover:bg-orange-100'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <ApperIcon name="User" size={16} className="mr-2" />
        Profile
      </button>
      <button
        onClick={handleLogout}
className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
          currentTheme === 'dark' 
            ? 'text-gray-300 hover:bg-gray-700' 
            : currentTheme === 'dive'
            ? 'text-blue-200 hover:bg-ocean-mid/50'
            : currentTheme === 'sunset'
            ? 'text-orange-700 hover:bg-orange-100'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
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
<header className={`border-b sticky top-0 z-40 backdrop-blur-sm transition-colors ${
      currentTheme === 'dark' 
        ? 'bg-gray-800/95 border-gray-700' 
        : currentTheme === 'dive'
        ? 'bg-ocean-deep/95 border-ocean-mid'
        : currentTheme === 'sunset'
        ? 'bg-orange-50/95 border-orange-200'
        : 'bg-white/95 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
<div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-depth-gradient rounded-lg flex items-center justify-center">
              <ApperIcon name="Waves" size={20} className="text-white" />
            </div>
            <h1 className={`text-xl font-bold font-display transition-colors ${
              currentTheme === 'dark' 
                ? 'text-gray-100' 
                : currentTheme === 'dive'
                ? 'text-blue-100'
                : currentTheme === 'sunset'
                ? 'text-orange-900'
                : 'text-gray-900'
            }`}>
              My Freediving Journey
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
            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  currentTheme === 'dark' 
                    ? 'text-gray-300 hover:text-blue-300 hover:bg-gray-700' 
                    : currentTheme === 'dive'
                    ? 'text-blue-200 hover:text-blue-100 hover:bg-ocean-mid/50'
                    : currentTheme === 'sunset'
                    ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-100'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                }`}
                title="Switch Theme"
              >
                <ApperIcon name={themes[currentTheme].icon} size={20} />
                <ApperIcon name="ChevronDown" size={14} />
              </button>
              {showThemeMenu && <ThemeDropdown />}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  currentTheme === 'dark' 
                    ? 'text-gray-300 hover:text-blue-300 hover:bg-gray-700' 
                    : currentTheme === 'dive'
                    ? 'text-blue-200 hover:text-blue-100 hover:bg-ocean-mid/50'
                    : currentTheme === 'sunset'
                    ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-100'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                }`}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
<div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700' 
                      : currentTheme === 'dive'
                      ? 'bg-ocean-mid'
                      : currentTheme === 'sunset'
                      ? 'bg-orange-200'
                      : 'bg-primary-100'
                  }`}>
<ApperIcon name="User" size={16} className={
                      currentTheme === 'dark' 
                        ? 'text-gray-300' 
                        : currentTheme === 'dive'
                        ? 'text-blue-200'
                        : currentTheme === 'sunset'
                        ? 'text-orange-700'
                        : 'text-primary-600'
                    } />
                  </div>
                )}
<span className={`hidden md:block text-sm font-medium ${
                  currentTheme === 'dark' 
                    ? 'text-gray-200' 
                    : currentTheme === 'dive'
                    ? 'text-blue-100'
                    : currentTheme === 'sunset'
                    ? 'text-orange-900'
                    : 'text-gray-900'
                }`}>
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