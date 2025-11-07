import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent/10 to-yellow-500/10 rounded-full flex items-center justify-center mb-6">
            <ApperIcon name="ShoppingBag" className="w-16 h-16 text-accent" />
          </div>
          
          <h1 className="font-display text-6xl font-bold text-primary mb-2">
            404
          </h1>
          
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-yellow-500 mx-auto mb-6"></div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          
          <Button
            onClick={() => navigate("/products")}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            <ApperIcon name="Package" className="w-4 h-4 mr-2" />
            Browse Products
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-4 bg-white rounded-lg border border-gray-100">
          <h3 className="font-medium text-primary mb-2">Looking for something specific?</h3>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <button
              onClick={() => navigate("/products")}
              className="text-accent hover:underline"
            >
              All Products
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate("/products?featured=true")}
              className="text-accent hover:underline"
            >
              Featured Items
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate("/products?sale=true")}
              className="text-accent hover:underline"
            >
              Sale Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;