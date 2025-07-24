import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
// Get theme-aware colors
  const getCardStyles = () => {
    const isDark = document.body.classList.contains('theme-dark');
    const isDive = document.body.classList.contains('theme-dive');
    const isSunset = document.body.classList.contains('theme-sunset');
    
    if (isDark) {
      return "rounded-lg border border-gray-700 bg-gray-800 text-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-600";
    } else if (isDive) {
      return "rounded-lg border border-ocean-surface/30 bg-gradient-to-br from-ocean-deep/90 to-ocean-deeper/90 text-sky-100 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-ocean-surface/50";
    } else if (isSunset) {
      return "rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 text-amber-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-orange-300";
    } else {
      return "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        getCardStyles(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;