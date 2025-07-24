import React from "react";
import SessionForm from "@/components/organisms/SessionForm";

const NewSession = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">
          New Dive Session
        </h1>
        <p className="text-gray-600">
          Record your dives and track your freediving progress
        </p>
      </div>
      
      <SessionForm />
    </div>
  );
};

export default NewSession;