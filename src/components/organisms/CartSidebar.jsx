import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import cartService from "@/services/api/cartService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const CartSidebar = ({ isOpen, onClose, className = "" }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const [cartResult, totalResult] = await Promise.all([
        cartService.getCart(),
        cartService.getCartTotal()
      ]);

      if (cartResult.success) {
        setCartItems(cartResult.data);
      }
      if (totalResult.success) {
        setTotal(totalResult.data);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const result = await cartService.updateQuantity(itemId, newQuantity);
      if (result.success) {
        loadCart();
        toast.success("Cart updated");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const result = await cartService.removeFromCart(itemId);
      if (result.success) {
        loadCart();
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-display text-lg font-semibold text-primary">
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-3 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <Empty
                title="Your cart is empty"
                message="Add some amazing products to get started!"
                actionText="Start Shopping"
                onAction={() => {
                  onClose();
                  navigate("/products");
                }}
                icon="ShoppingBag"
                className="h-full"
              />
            ) : (
              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={`https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=100&h=100&fit=crop`}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm text-primary line-clamp-1">
                        {item.productName || "Product"}
                      </h4>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        {item.selectedSize && <div>Size: {item.selectedSize}</div>}
                        {item.selectedColor && <div>Color: {item.selectedColor}</div>}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-accent">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                          >
                            <ApperIcon name="Minus" className="w-3 h-3" />
                          </button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                          >
                            <ApperIcon name="Plus" className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-display text-lg font-semibold">Total</span>
                <span className="font-display text-xl font-bold bg-gradient-to-r from-accent to-yellow-600 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;