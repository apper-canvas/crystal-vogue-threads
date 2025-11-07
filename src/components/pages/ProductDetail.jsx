import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { wishlistService } from "@/services/api/wishlistService";
import { toast } from "react-toastify";
import productsService from "@/services/api/productsService";
import cartService from "@/services/api/cartService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Products from "@/components/pages/Products";
import ProductCard from "@/components/molecules/ProductCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0] || "");
      loadRelatedProducts();
      checkWishlistStatus();
    }
  }, [product]);

  const checkWishlistStatus = async () => {
    if (!product) return;
    try {
      const inWishlist = await wishlistService.isInWishlist(product.Id);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };
  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await productsService.getById(id);
      
      if (result.success) {
        setProduct(result.data);
      } else {
        setError(result.error || "Product not found");
      }
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

const loadRelatedProducts = async () => {
    try {
      const result = await productsService.getRelated(id, 4);
      if (result.success) {
        setRelatedProducts(result.data);
      }
    } catch (error) {
      console.error("Error loading related products:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product || wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.remove(product.Id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.add(product.Id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor && product.colors.length > 0) {
      toast.error("Please select a color");
      return;
    }

    try {
      const cartItem = {
        productId: product.Id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
      };

      const result = await cartService.addToCart(cartItem);
      
      if (result.success) {
        toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleRelatedProductAddToCart = async (relatedProduct) => {
    try {
      const cartItem = {
        productId: relatedProduct.Id,
        productName: relatedProduct.name,
        price: relatedProduct.price,
        quantity: 1,
        selectedSize: relatedProduct.sizes[0] || "",
        selectedColor: relatedProduct.colors[0] || "",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-gray-200 h-96 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-20 w-20 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadProduct} />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => navigate("/products")}
              className="text-gray-500 hover:text-accent transition-colors duration-200"
            >
              Products
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            <button 
              onClick={() => navigate(`/products?category=${encodeURIComponent(product.category)}`)}
              className="text-gray-500 hover:text-accent transition-colors duration-200"
            >
              {product.category}
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            <span className="text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <Badge 
                  variant="accent" 
                  className="absolute top-4 left-4 bg-gradient-to-r from-accent to-yellow-500"
                >
                  Featured
                </Badge>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? "border-accent" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-primary mb-2">
                {product.name}
              </h1>
              <p className="font-display text-2xl font-semibold bg-gradient-to-r from-accent to-yellow-600 bg-clip-text text-transparent">
                ${product.price}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-primary mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block font-medium text-primary mb-3">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "border-accent bg-accent text-white"
                          : "border-gray-300 text-gray-700 hover:border-accent hover:text-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <label className="block font-medium text-primary mb-3">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedColor === color
                          ? "border-accent bg-accent text-white"
                          : "border-gray-300 text-gray-700 hover:border-accent hover:text-accent"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block font-medium text-primary mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </button>
                
                <span className="font-medium text-lg w-16 text-center">
                  {quantity}
                </span>
                
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </button>
              </div>
            </div>

{/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                variant="outline"
                className="flex items-center justify-center px-4 py-4 border-2 hover:scale-105 transition-all duration-200 disabled:opacity-50"
              >
                <ApperIcon 
                  name="Heart" 
                  size={20} 
                  className={cn(
                    "transition-colors duration-200",
                    isInWishlist 
                      ? "text-red-500 fill-red-500" 
                      : "text-gray-600 hover:text-red-500"
                  )} 
                />
              </Button>
              
              <Button
                onClick={handleAddToCart}
                className="flex-1 py-4 text-lg bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent transform hover:scale-105 transition-all duration-200"
              >
                <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>
            {/* Product Details */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Availability</span>
                <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold text-primary mb-8 text-center">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.Id}
                  product={relatedProduct}
                  onAddToCart={handleRelatedProductAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;