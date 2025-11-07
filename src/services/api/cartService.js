const CART_STORAGE_KEY = "vogue-threads-cart";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CartService {
  constructor() {
    this.cart = this.loadCart();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  }

  saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.cart = cart;
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }

  async getCart() {
    await delay(100);
    return {
      success: true,
      data: [...this.cart]
    };
  }

  async addToCart(item) {
    await delay(200);
    
    const existingIndex = this.cart.findIndex(cartItem =>
      cartItem.productId === item.productId &&
      cartItem.selectedSize === item.selectedSize &&
      cartItem.selectedColor === item.selectedColor
    );

    let updatedCart;
    if (existingIndex >= 0) {
      updatedCart = [...this.cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + item.quantity
      };
    } else {
      updatedCart = [...this.cart, { ...item, id: Date.now() }];
    }

    this.saveCart(updatedCart);
    
    return {
      success: true,
      data: updatedCart
    };
  }

  async updateQuantity(itemId, quantity) {
    await delay(150);
    
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    const updatedCart = this.cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );

    this.saveCart(updatedCart);
    
    return {
      success: true,
      data: updatedCart
    };
  }

  async removeFromCart(itemId) {
    await delay(150);
    
    const updatedCart = this.cart.filter(item => item.id !== itemId);
    this.saveCart(updatedCart);
    
    return {
      success: true,
      data: updatedCart
    };
  }

  async clearCart() {
    await delay(100);
    
    this.saveCart([]);
    
    return {
      success: true,
      data: []
    };
  }

  async getCartTotal() {
    await delay(50);
    
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      success: true,
      data: total
    };
  }

  async getCartItemCount() {
    await delay(50);
    
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      success: true,
      data: count
    };
  }
}

export default new CartService();