import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productsService from "@/services/api/productsService";
import cartService from "@/services/api/cartService";
import { wishlistService } from "@/services/api/wishlistService";
import ApperIcon from "@/components/ApperIcon";
import CartIcon from "@/components/molecules/CartIcon";
import CategoryDropdown from "@/components/molecules/CategoryDropdown";
import SearchBar from "@/components/molecules/SearchBar";
const Header = ({ onCartClick }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartCount();
    loadWishlistCount();
    loadCategories();
  }, []);

  const loadWishlistCount = async () => {
    try {
      const count = await wishlistService.getCount();
      setWishlistCount(count);
    } catch (error) {
      console.error("Error loading wishlist count:", error);
    }
  };

  const loadCartCount = async () => {
    try {
      const result = await cartService.getCartItemCount();
      if (result.success) {
        setCartCount(result.data);
      }
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

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

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/products");
    }
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    onCartClick();
  };

  const navigation = [
    { name: "Collections", href: "/products" },
    { name: "Sale", href: "/products?sale=true" },
    { name: "About", href: "/about" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-yellow-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vogue Threads
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <CategoryDropdown categories={categories} />
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium text-primary hover:text-accent transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>
{/* Right Section */}
<div className="flex items-center space-x-4">
              {/* User Profile Link */}
              <Link
                to="/profile"
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-primary hover:text-accent transition-colors duration-200"
              >
                <ApperIcon name="User" className="w-4 h-4" />
              </Link>
              
              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-primary hover:text-accent transition-colors duration-200 relative"
              >
                <ApperIcon name="Heart" className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <CartIcon count={cartCount} onClick={handleCartClick} />
              {/* Mobile Menu Button */}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-primary hover:text-accent transition-colors duration-200"
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-30 overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Search */}
            <SearchBar 
              onSearch={handleSearch} 
              className="w-full"
            />

            {/* Mobile Navigation */}
            <nav className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-primary">Categories</h3>
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/products?category=${encodeURIComponent(category)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-600 hover:text-accent py-2 transition-colors duration-200"
                  >
                    {category}
                  </Link>
                ))}
              </div>
<div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-accent py-2 transition-colors duration-200"
                >
                  <ApperIcon name="User" className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-accent py-2 transition-colors duration-200"
                >
                  <ApperIcon name="Heart" className="w-4 h-4" />
                  <span>My Wishlist ({wishlistCount})</span>
                </Link>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-600 hover:text-accent py-2 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;