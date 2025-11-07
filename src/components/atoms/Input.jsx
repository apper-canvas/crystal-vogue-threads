import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className = "", 
  type = "text", 
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 border rounded-md text-sm placeholder-gray-500 transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
        error 
          ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-500" 
          : "border-gray-300 bg-white text-gray-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;