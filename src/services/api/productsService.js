import { getApperClient } from "@/services/apperClient";

class ProductsService {
  constructor() {
    this.tableName = 'product_c';
  }

  async getAll(filters = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "subcategory_c"}}
        ],
        where: [],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      // Apply filters
      if (filters.category) {
        params.where.push({
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [filters.category]
        });
      }

      if (filters.search) {
        params.whereGroups = [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {
                "fieldName": "name_c",
                "operator": "Contains",
                "values": [filters.search]
              },
              {
                "fieldName": "description_c",
                "operator": "Contains",
                "values": [filters.search]
              }
            ],
            "operator": "OR"
          }]
        }];
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            params.orderBy = [{"fieldName": "price_c", "sorttype": "ASC"}];
            break;
          case "price-high":
            params.orderBy = [{"fieldName": "price_c", "sorttype": "DESC"}];
            break;
          case "name":
            params.orderBy = [{"fieldName": "name_c", "sorttype": "ASC"}];
            break;
          default:
            break;
        }
      }

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Failed to fetch products:', response.message);
        return {
          success: false,
          error: response.message
        };
      }

      // Transform data to match expected format
      const transformedData = response.data.map(item => ({
        Id: item.Id,
        name: item.name_c || item.Name,
        category: item.category_c,
        description: item.description_c,
        price: parseFloat(item.price_c) || 0,
        stock: parseInt(item.stock_c) || 0,
        featured: item.featured_c || false,
        images: item.images_c ? item.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: item.sizes_c ? item.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: item.colors_c ? item.colors_c.split('\n').filter(color => color.trim()) : [],
        subcategory: item.subcategory_c
      }));

      // Apply client-side filters for complex operations
      let filteredProducts = transformedData;

      if (filters.sizes && filters.sizes.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          filters.sizes.some(size => p.sizes.includes(size))
        );
      }

      if (filters.colors && filters.colors.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          filters.colors.some(color => p.colors.includes(color))
        );
      }

      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
      }

      return {
        success: true,
        data: filteredProducts
      };

    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch products'
      };
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "subcategory_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        return {
          success: false,
          error: "Product not found"
        };
      }

      // Transform data to match expected format
      const item = response.data;
      const transformedData = {
        Id: item.Id,
        name: item.name_c || item.Name,
        category: item.category_c,
        description: item.description_c,
        price: parseFloat(item.price_c) || 0,
        stock: parseInt(item.stock_c) || 0,
        featured: item.featured_c || false,
        images: item.images_c ? item.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: item.sizes_c ? item.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: item.colors_c ? item.colors_c.split('\n').filter(color => color.trim()) : [],
        subcategory: item.subcategory_c
      };

      return {
        success: true,
        data: transformedData
      };

    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch product'
      };
    }
  }

  async getFeatured() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "subcategory_c"}}
        ],
        where: [{
          "FieldName": "featured_c",
          "Operator": "EqualTo",
          "Values": [true]
        }],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        return {
          success: false,
          error: response.message
        };
      }

      // Transform data to match expected format
      const transformedData = response.data.map(item => ({
        Id: item.Id,
        name: item.name_c || item.Name,
        category: item.category_c,
        description: item.description_c,
        price: parseFloat(item.price_c) || 0,
        stock: parseInt(item.stock_c) || 0,
        featured: item.featured_c || false,
        images: item.images_c ? item.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: item.sizes_c ? item.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: item.colors_c ? item.colors_c.split('\n').filter(color => color.trim()) : [],
        subcategory: item.subcategory_c
      }));

      return {
        success: true,
        data: transformedData
      };

    } catch (error) {
      console.error('Error fetching featured products:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch featured products'
      };
    }
  }

  async getRelated(productId, limit = 4) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First get the product to find its category
      const productResponse = await this.getById(productId);
      if (!productResponse.success) {
        return { success: false, error: "Product not found" };
      }

      const product = productResponse.data;

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "subcategory_c"}}
        ],
        where: [
          {
            "FieldName": "category_c",
            "Operator": "EqualTo",
            "Values": [product.category]
          },
          {
            "FieldName": "Id",
            "Operator": "NotEqualTo",
            "Values": [parseInt(productId)]
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        return {
          success: false,
          error: response.message
        };
      }

      // Transform data to match expected format
      const transformedData = response.data.map(item => ({
        Id: item.Id,
        name: item.name_c || item.Name,
        category: item.category_c,
        description: item.description_c,
        price: parseFloat(item.price_c) || 0,
        stock: parseInt(item.stock_c) || 0,
        featured: item.featured_c || false,
        images: item.images_c ? item.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: item.sizes_c ? item.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: item.colors_c ? item.colors_c.split('\n').filter(color => color.trim()) : [],
        subcategory: item.subcategory_c
      }));

      return {
        success: true,
        data: transformedData
      };

    } catch (error) {
      console.error('Error fetching related products:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch related products'
      };
    }
  }

  async getCategories() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [{"field": {"Name": "category_c"}}],
        groupBy: ["category_c"],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        return {
          success: false,
          error: response.message
        };
      }

      const categories = response.data
        .map(item => item.category_c)
        .filter(category => category && category.trim())
        .sort();

      return {
        success: true,
        data: categories
      };

    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch categories'
      };
    }
  }
}

export default new ProductsService();