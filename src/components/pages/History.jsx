import React from "react";
import SessionList from "@/components/organisms/SessionList";

const History = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">
          Dive History
        </h1>
        <p className="text-gray-600">
          Review and analyze your past freediving sessions
        </p>
      </div>
      
      <SessionList />
    </div>
  );
};

export default History;