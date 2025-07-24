import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  gradient = false,
  className 
}) => {
  return (
    <Card className={cn(
      "p-6 relative overflow-hidden",
      gradient && "bg-depth-gradient text-white border-primary-400",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium mb-1",
            gradient ? "text-primary-100" : "text-gray-600"
          )}>
            {title}
          </p>
          <div className="flex items-baseline space-x-1">
            <span className={cn(
              "text-3xl font-bold font-display",
              gradient ? "text-white" : "text-gray-900"
            )}>
              {value}
            </span>
            {unit && (
              <span className={cn(
                "text-lg font-medium",
                gradient ? "text-primary-100" : "text-gray-500"
              )}>
                {unit}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={cn(
            "p-3 rounded-full",
            gradient ? "bg-white/20" : "bg-primary-50"
          )}>
            <ApperIcon 
              name={icon} 
              size={24} 
              className={gradient ? "text-white" : "text-primary-600"} 
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;