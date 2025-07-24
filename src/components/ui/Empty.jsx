import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  message = "No data found", 
  description = "Get started by creating your first dive session",
  actionLabel = "New Session",
  actionLink = "/new-session"
}) => {
  return (
    <Card className="p-12 text-center max-w-lg mx-auto bg-surface-gradient">
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="Waves" size={40} className="text-primary-600" />
      </div>
      
      <h3 className="text-xl font-semibold font-display text-gray-900 mb-2">
        {message}
      </h3>
      
      <p className="text-gray-600 mb-8">
        {description}
      </p>
      
      <Link to={actionLink}>
        <Button className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      </Link>
    </Card>
  );
};

export default Empty;