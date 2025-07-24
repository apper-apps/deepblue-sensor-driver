import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const isDark = document.body.classList.contains('theme-dark');
  const isDive = document.body.classList.contains('theme-dive');
  
  const variants = {
    primary: isDark 
      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      : isDive
      ? "bg-gradient-to-r from-ocean-surface to-ocean-mid text-white hover:from-ocean-mid hover:to-ocean-deep focus:ring-ocean-surface shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      : "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    secondary: isDark
      ? "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-blue-500 border border-gray-600"
      : isDive
      ? "bg-ocean-mid text-blue-100 hover:bg-ocean-deep focus:ring-ocean-surface border border-ocean-surface"
      : "bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-500 border border-primary-200",
    outline: isDark
      ? "border border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-blue-500"
      : isDive
      ? "border border-ocean-surface text-blue-200 hover:bg-ocean-mid/50 focus:ring-ocean-surface"
      : "border border-primary-300 text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    ghost: isDark
      ? "text-gray-300 hover:bg-gray-700 focus:ring-blue-500"
      : isDive
      ? "text-blue-200 hover:bg-ocean-mid/50 focus:ring-ocean-surface"
      : "text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;