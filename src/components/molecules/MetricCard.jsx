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
const isDark = document.body.classList.contains('theme-dark');
  const isDive = document.body.classList.contains('theme-dive');
  
  return (
    <Card className={cn(
      "p-6 relative overflow-hidden transition-colors",
      gradient && (isDark 
        ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white border-gray-600"
        : isDive
        ? "bg-depth-gradient text-white border-ocean-surface"
        : "bg-depth-gradient text-white border-primary-400"),
      !gradient && (isDark
        ? "bg-gray-800 border-gray-700"
        : isDive
        ? "bg-ocean-deep border-ocean-mid"
        : "bg-white border-gray-200"),
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium mb-1",
            gradient 
              ? isDark 
                ? "text-gray-300" 
                : "text-primary-100"
              : isDark
                ? "text-gray-300"
                : isDive
                ? "text-blue-200"
                : "text-gray-600"
          )}>
            {title}
          </p>
          <div className="flex items-baseline space-x-1">
            <span className={cn(
              "text-3xl font-bold font-display",
              gradient 
                ? "text-white" 
                : isDark
                  ? "text-gray-100"
                  : isDive
                  ? "text-blue-100"
                  : "text-gray-900"
            )}>
              {value}
            </span>
            {unit && (
              <span className={cn(
                "text-lg font-medium",
                gradient 
                  ? isDark 
                    ? "text-gray-300" 
                    : "text-primary-100"
                  : isDark
                    ? "text-gray-400"
                    : isDive
                    ? "text-blue-300"
                    : "text-gray-500"
              )}>
                {unit}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={cn(
            "p-3 rounded-full",
            gradient 
              ? "bg-white/20" 
              : isDark
                ? "bg-gray-700"
                : isDive
                ? "bg-ocean-mid"
                : "bg-primary-50"
          )}>
            <ApperIcon 
              name={icon} 
              size={24} 
              className={cn(
                gradient 
                  ? "text-white" 
                  : isDark
                    ? "text-blue-400"
                    : isDive
                    ? "text-blue-200"
                    : "text-primary-600"
              )} 
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;