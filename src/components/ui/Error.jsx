import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold font-display text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="w-full">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;