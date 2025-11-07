import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const CartIcon = ({ count = 0, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 text-primary hover:text-accent transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg",
        className
      )}
    >
      <ApperIcon name="ShoppingBag" className="w-5 h-5" />
      
      {count > 0 && (
        <Badge
          variant="accent"
          size="xs"
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-gradient-to-r from-accent to-yellow-500 text-white text-xs font-bold animate-bounce-subtle"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </button>
  );
};

export default CartIcon;