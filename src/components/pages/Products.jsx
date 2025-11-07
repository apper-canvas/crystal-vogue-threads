import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ProductFilter from "@/components/organisms/ProductFilter";
import ProductGrid from "@/components/organisms/ProductGrid";
import SearchBar from "@/components/molecules/SearchBar";
import productsService from "@/services/api/productsService";
import cartService from "@/services/api/cartService";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const urlFilters = {};
    
    if (params.get("category")) {
      urlFilters.category = params.get("category");
    }
    if (params.get("search")) {
      urlFilters.search = params.get("search");
    }
    
    setFilters(urlFilters);
    loadProducts(urlFilters);
  }, [location.search]);

  const loadProducts = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError("");
      
      const result = await productsService.getAll(currentFilters);
      
      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.error || "Failed to load products");
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    loadProducts(newFilters);
    
    // Update URL without the category/search params from URL
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.category) params.set("category", newFilters.category);
    
    navigate(`/products${params.toString() ? "?" + params.toString() : ""}`, { replace: true });
  };

  const handleSortChange = (sortBy) => {
    const updatedFilters = { ...filters, sortBy };
    setFilters(updatedFilters);
    loadProducts(updatedFilters);
  };

  const handleSearch = (query) => {
    const updatedFilters = { ...filters, search: query };
    handleFiltersChange(updatedFilters);
  };

  const handleAddToCart = async (product) => {
    try {
      const cartItem = {
        productId: product.Id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        selectedSize: product.sizes[0] || "",
        selectedColor: product.colors[0] || "",
      };

      const result = await cartService.addToCart(cartItem);
      
      if (result.success) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary mb-2">
              {filters.category ? `${filters.category}` : "All Products"}
            </h1>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <SearchBar 
              onSearch={handleSearch}
              className="w-full sm:w-80"
            />
            
            <div className="flex items-center space-x-3">
              {/* Sort */}
              <Select
                value={filters.sortBy || ""}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-40"
              >
                <option value="">Sort by</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price Low-High</option>
                <option value="price-high">Price High-Low</option>
              </Select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" 
                    ? "bg-white shadow-sm text-accent" 
                    : "text-gray-600 hover:text-primary"
                  } transition-all duration-200`}
                >
                  <ApperIcon name="Grid" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" 
                    ? "bg-white shadow-sm text-accent" 
                    : "text-gray-600 hover:text-primary"
                  } transition-all duration-200`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="secondary"
                className="lg:hidden"
              >
                <ApperIcon name="SlidersHorizontal" className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <ProductFilter
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="sticky top-24"
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onRetry={() => loadProducts()}
              onAddToCart={handleAddToCart}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;