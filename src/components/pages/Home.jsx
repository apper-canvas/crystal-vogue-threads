import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productsService from "@/services/api/productsService";
import cartService from "@/services/api/cartService";
import { toast } from "react-toastify";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await productsService.getFeatured();
      
      if (result.success) {
        setFeaturedProducts(result.data);
      } else {
        setError(result.error || "Failed to load products");
      }
    } catch (err) {
      console.error("Error loading featured products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
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

  const categories = [
    {
      name: "Shirts",
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=400&fit=crop",
      count: "25+ items"
    },
    {
      name: "Dresses",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=400&fit=crop",
      count: "18+ items"
    },
    {
      name: "Outerwear",
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=400&fit=crop",
      count: "12+ items"
    },
    {
      name: "Shoes",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=400&fit=crop",
      count: "30+ items"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
        
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop')"
          }}
        />
        
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Define Your
            <span className="block bg-gradient-to-r from-accent to-yellow-500 bg-clip-text text-transparent">
              Style Story
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Discover curated fashion pieces that blend timeless elegance with contemporary design
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              onClick={() => navigate("/products")}
              className="px-8 py-4 text-lg bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent transform hover:scale-105 transition-all duration-300"
            >
              Shop Collection
            </Button>
            
            <Button
              onClick={() => navigate("/about")}
              variant="ghost"
              className="px-8 py-4 text-lg border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-primary mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our carefully curated collections designed for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-display text-xl font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-200">{category.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-primary mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked favorites that define this season's trends
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : error ? (
            <Error message={error} onRetry={loadFeaturedProducts} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.Id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/products")}
              variant="secondary"
              className="px-8 py-3 text-lg"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <ApperIcon name="Sparkles" className="w-16 h-16 mx-auto text-accent mb-6" />
            <h2 className="font-display text-4xl font-bold mb-4">
              Join the Style Revolution
            </h2>
            <p className="text-xl text-gray-200">
              Be the first to discover new arrivals and exclusive collections
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              onClick={() => navigate("/products")}
              className="px-8 py-4 text-lg bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;