import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ApperIcon from "@/components/ApperIcon";
import Certifications from "@/components/pages/Certifications";
import Profile from "@/components/pages/Profile";
import DashboardStats from "@/components/organisms/DashboardStats";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
const Dashboard = () => {
  const { user, isAdmin, isInstructor } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className={`text-3xl font-bold font-display mb-2 transition-colors ${
          document.body.classList.contains('theme-dark') 
            ? 'text-gray-100' 
            : document.body.classList.contains('theme-dive')
            ? 'text-blue-100'
            : 'text-gray-900'
        }`}>
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className={`transition-colors ${
          document.body.classList.contains('theme-dark') 
            ? 'text-gray-300' 
            : document.body.classList.contains('theme-dive')
            ? 'text-blue-200'
            : 'text-gray-600'
        }`}>
          Welcome to your freediving portal - track your progress and connect with the community
        </p>
      </div>

      {/* Profile Completion Alert */}
      {!user?.profileComplete && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ApperIcon name="User" size={20} className="text-blue-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Complete Your Profile</h3>
                <p className="text-sm text-blue-700">
                  Add your bio, emergency contact, and safety information to get the most out of DeepBlue Log
                </p>
              </div>
            </div>
            <Link to="/profile">
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Complete Profile
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Role-specific Quick Actions */}
      {(isAdmin || isInstructor) && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">
            {isAdmin ? 'Admin Tools' : 'Instructor Tools'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isAdmin && (
              <Link to="/users">
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="Users" size={16} className="mr-2" />
                  Manage Users
                </Button>
              </Link>
            )}
            <Link to="/new-session">
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                New Training Session
              </Button>
            </Link>
            <Link to="/certifications">
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="Award" size={16} className="mr-2" />
                View Certifications
              </Button>
            </Link>
          </div>
        </Card>
)}
      
      <DashboardStats />
      {/* Quick Start for New Users */}
{user?.certifications?.length === 0 && (
        <Card className={`p-6 border transition-colors ${
          document.body.classList.contains('theme-dark') 
            ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
            : document.body.classList.contains('theme-dive')
            ? 'bg-gradient-to-br from-ocean-deep to-ocean-mid border-ocean-surface'
            : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
        }`}>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              document.body.classList.contains('theme-dark') 
                ? 'bg-gray-700' 
                : document.body.classList.contains('theme-dive')
                ? 'bg-ocean-mid'
                : 'bg-blue-100'
            }`}>
              <ApperIcon name="Waves" size={32} className={
                document.body.classList.contains('theme-dark') 
                  ? 'text-blue-400' 
                  : document.body.classList.contains('theme-dive')
                  ? 'text-blue-200'
                  : 'text-blue-600'
              } />
            </div>
            <h3 className={`text-lg font-semibold font-display mb-2 transition-colors ${
              document.body.classList.contains('theme-dark') 
                ? 'text-gray-100' 
                : document.body.classList.contains('theme-dive')
                ? 'text-blue-100'
                : 'text-gray-900'
            }`}>
              Ready to start your freediving journey?
            </h3>
            <p className={`mb-4 transition-colors ${
              document.body.classList.contains('theme-dark') 
                ? 'text-gray-300' 
                : document.body.classList.contains('theme-dive')
                ? 'text-blue-200'
                : 'text-gray-600'
            }`}>
              Add your certifications and log your first dive session to begin tracking your progress
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/certifications">
                <Button>
                  <ApperIcon name="Award" size={16} className="mr-2" />
                  Add Certifications
                </Button>
              </Link>
              <Link to="/new-session">
                <Button variant="outline">
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Log First Dive
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;