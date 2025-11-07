import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const PriceRange = ({ min = 0, max = 500, onApply, className = "" }) => {
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

  const handleApply = () => {
    onApply({ min: minPrice, max: maxPrice });
  };

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Min</label>
          <Input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            placeholder="0"
            className="text-sm"
          />
        </div>
        
        <div className="flex-shrink-0 text-gray-400">-</div>
        
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Max</label>
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            placeholder="500"
            className="text-sm"
          />
        </div>
      </div>
      
      <Button
        onClick={handleApply}
        variant="secondary"
        size="sm"
        className="w-full"
      >
        Apply
      </Button>
    </div>
  );
};

export default PriceRange;