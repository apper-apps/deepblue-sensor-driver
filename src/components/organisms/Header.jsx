import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: "BarChart3" },
    { to: "/new-session", label: "New Session", icon: "Plus" },
    { to: "/history", label: "History", icon: "Clock" }
  ];

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

          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-primary-700 hover:bg-primary-50">
              <ApperIcon name="Menu" size={24} />
            </button>
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