import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found", 
  message = "We couldn't find what you're looking for.",
  actionText = "Browse Products",
  onAction,
  icon = "Package",
  className = ""
}) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent/10 to-accent/20 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-accent" />
        </div>
        
        <div className="space-y-3">
          <h3 className="font-display text-2xl font-semibold text-primary">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {onAction && (
          <Button 
            onClick={onAction}
            className="bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent transform hover:scale-105 transition-all duration-200"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;