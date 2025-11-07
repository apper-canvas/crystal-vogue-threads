import React, { useState, useEffect } from "react";
import FilterSection from "@/components/molecules/FilterSection";
import PriceRange from "@/components/molecules/PriceRange";
import Button from "@/components/atoms/Button";
import productsService from "@/services/api/productsService";

const ProductFilter = ({ filters, onFiltersChange, className = "" }) => {
  const [categories, setCategories] = useState([]);
  const [collapsedSections, setCollapsedSections] = useState({});

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "24", "25", "26", "27", "28", "29", "30", "31", "32", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"];
  const availableColors = ["Black", "White", "Gray", "Navy", "Brown", "Camel", "Cream", "Light Blue", "Dark Indigo", "Light Wash", "Emerald", "Burgundy", "Light Gray", "Tan", "Coral Floral", "Blue Floral", "Charcoal", "Ivory", "Blush", "Sage Green", "Navy Stripe", "Gray Stripe"];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await productsService.getCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    
    onFiltersChange({ ...filters, categories: updatedCategories });
  };

  const handleSizeChange = (size) => {
    const updatedSizes = filters.sizes?.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...(filters.sizes || []), size];
    
    onFiltersChange({ ...filters, sizes: updatedSizes });
  };

  const handleColorChange = (color) => {
    const updatedColors = filters.colors?.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...(filters.colors || []), color];
    
    onFiltersChange({ ...filters, colors: updatedColors });
  };

  const handlePriceRangeChange = ({ min, max }) => {
    onFiltersChange({ 
      ...filters, 
      minPrice: min, 
      maxPrice: max 
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = 
    filters.categories?.length > 0 ||
    filters.sizes?.length > 0 ||
    filters.colors?.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-primary">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-accent hover:text-accent/80"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <FilterSection
          title="Categories"
          isCollapsed={collapsedSections.categories}
          onToggle={() => toggleSection("categories")}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category) || false}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          isCollapsed={collapsedSections.price}
          onToggle={() => toggleSection("price")}
        >
          <PriceRange
            min={filters.minPrice}
            max={filters.maxPrice}
            onApply={handlePriceRangeChange}
          />
        </FilterSection>

        {/* Sizes */}
        <FilterSection
          title="Sizes"
          isCollapsed={collapsedSections.sizes}
          onToggle={() => toggleSection("sizes")}
        >
          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map((size) => (
              <label key={size} className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.sizes?.includes(size) || false}
                  onChange={() => handleSizeChange(size)}
                  className="w-3 h-3 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <span className="text-xs text-gray-700">{size}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Colors */}
        <FilterSection
          title="Colors"
          isCollapsed={collapsedSections.colors}
          onToggle={() => toggleSection("colors")}
        >
          <div className="space-y-2">
            {availableColors.map((color) => (
              <label key={color} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.colors?.includes(color) || false}
                  onChange={() => handleColorChange(color)}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <span className="text-sm text-gray-700">{color}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default ProductFilter;