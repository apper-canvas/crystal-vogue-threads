import mockProducts from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductsService {
  constructor() {
    this.products = [...mockProducts];
  }

  async getAll(filters = {}) {
    await delay(300);
    
    let filteredProducts = [...this.products];

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply size filter
    if (filters.sizes && filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        filters.sizes.some(size => p.sizes.includes(size))
      );
    }

    // Apply color filter
    if (filters.colors && filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        filters.colors.some(color => p.colors.includes(color))
      );
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "name":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return {
      success: true,
      data: filteredProducts
    };
  }

  async getById(id) {
    await delay(200);
    
    const product = this.products.find(p => p.Id === parseInt(id));
    
    if (!product) {
      return {
        success: false,
        error: "Product not found"
      };
    }

    return {
      success: true,
      data: product
    };
  }

  async getFeatured() {
    await delay(250);
    
    const featured = this.products.filter(p => p.featured);
    
    return {
      success: true,
      data: featured
    };
  }

  async getRelated(productId, limit = 4) {
    await delay(200);
    
    const product = this.products.find(p => p.Id === parseInt(productId));
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const related = this.products
      .filter(p => p.Id !== parseInt(productId) && p.category === product.category)
      .slice(0, limit);

    return {
      success: true,
      data: related
    };
  }

  async getCategories() {
    await delay(150);
    
    const categories = [...new Set(this.products.map(p => p.category))];
    
    return {
      success: true,
      data: categories
    };
  }
}

export default new ProductsService();