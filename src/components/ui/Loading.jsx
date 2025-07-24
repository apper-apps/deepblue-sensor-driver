import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List Items Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full max-w-md"></div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;