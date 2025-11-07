import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FilterSection = ({ 
  title, 
  children, 
  isCollapsed = false, 
  onToggle,
  className = "" 
}) => {
  return (
    <div className={cn("border-b border-gray-200 pb-4 mb-6", className)}>
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-0 text-left font-medium text-primary hover:bg-transparent"
      >
        <span className="font-display text-sm font-semibold">{title}</span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isCollapsed && "rotate-180"
          )} 
        />
      </Button>
      
      {!isCollapsed && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;