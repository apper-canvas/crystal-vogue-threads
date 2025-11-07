import React from "react";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onRetry, 
  onAddToCart,
  viewMode = "grid",
  className = "" 
}) => {
  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry} 
        className={className}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <Empty
        title="No products found"
        message="Try adjusting your filters or search terms to find what you're looking for."
        actionText="Clear Filters"
        onAction={onRetry}
        icon="Package"
        className={className}
      />
    );
  }

  const gridClasses = viewMode === "list" 
    ? "grid grid-cols-1 gap-6"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  return (
    <div className={cn(gridClasses, className)}>
      {products.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          onAddToCart={onAddToCart}
          className={viewMode === "list" ? "flex flex-row" : ""}
        />
      ))}
    </div>
  );
};

export default ProductGrid;