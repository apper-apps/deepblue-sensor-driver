import React from "react";
import DashboardStats from "@/components/organisms/DashboardStats";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">
          Your Freediving Journey
        </h1>
        <p className="text-gray-600">
          Track your progress and dive deeper into your freediving practice
        </p>
      </div>
      
      <DashboardStats />
    </div>
  );
};

export default Dashboard;