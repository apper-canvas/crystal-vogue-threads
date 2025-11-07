import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children, 
  className = "", 
  error = false,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-3 py-2 border rounded-md text-sm bg-white transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
        error 
          ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-500" 
          : "border-gray-300 text-gray-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;