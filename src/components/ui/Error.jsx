import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-display text-xl font-semibold text-primary">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {onRetry && (
          <Button 
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;