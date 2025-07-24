import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  ...props 
}, ref) => {
return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        document.body.classList.contains('theme-dark')
          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400'
          : document.body.classList.contains('theme-dive')
          ? 'bg-ocean-mid border-ocean-surface text-blue-100 placeholder:text-blue-300'
          : 'bg-white border-gray-300 text-gray-900',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;