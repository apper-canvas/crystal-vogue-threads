const WISHLIST_KEY = 'vogue-threads-wishlist';

// Simulate API delay for realistic user experience
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const wishlistService = {
  // Get all wishlist items (returns array of product IDs)
  async getAll() {
    await delay(100);
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving wishlist:', error);
      return [];
    }
  },

  // Add item to wishlist
  async add(productId) {
    await delay(150);
    try {
      const current = await this.getAll();
      if (!current.includes(productId)) {
        const updated = [...current, productId];
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
        return true;
      }
      return false; // Item already in wishlist
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Failed to add item to wishlist');
    }
  },

  // Remove item from wishlist
  async remove(productId) {
    await delay(150);
    try {
      const current = await this.getAll();
      const updated = current.filter(id => id !== productId);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove item from wishlist');
    }
  },

  // Check if item is in wishlist
  async isInWishlist(productId) {
    await delay(50);
    try {
      const current = await this.getAll();
      return current.includes(productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },

  // Clear entire wishlist
  async clear() {
    await delay(100);
    try {
      localStorage.removeItem(WISHLIST_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw new Error('Failed to clear wishlist');
    }
  },

  // Get wishlist count
  async getCount() {
    await delay(50);
    try {
      const items = await this.getAll();
      return items.length;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }
};

export { wishlistService };