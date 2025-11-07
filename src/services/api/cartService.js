import { getApperClient } from "@/services/apperClient";

class CartService {
  constructor() {
    this.tableName = 'cart_item_c';
  }

  async getCart() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "product_name_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "selected_size_c"}},
          {"field": {"Name": "selected_color_c"}}
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Failed to fetch cart:', response.message);
        return {
          success: false,
          error: response.message
        };
      }

      // Transform data to match expected format
      const transformedData = response.data.map(item => ({
        id: item.Id,
        productId: parseInt(item.product_id_c),
        productName: item.product_name_c,
        price: parseFloat(item.price_c) || 0,
        quantity: parseInt(item.quantity_c) || 1,
        selectedSize: item.selected_size_c || '',
        selectedColor: item.selected_color_c || ''
      }));

      return {
        success: true,
        data: transformedData
      };

    } catch (error) {
      console.error('Error fetching cart:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch cart'
      };
    }
  }

  async addToCart(item) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First check if item already exists
      const existingParams = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "quantity_c"}}
        ],
        where: [
          {
            "FieldName": "product_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(item.productId)]
          },
          {
            "FieldName": "selected_size_c",
            "Operator": "EqualTo",
            "Values": [item.selectedSize || '']
          },
          {
            "FieldName": "selected_color_c",
            "Operator": "EqualTo",
            "Values": [item.selectedColor || '']
          }
        ]
      };

      const existingResponse = await apperClient.fetchRecords(this.tableName, existingParams);

      if (existingResponse.success && existingResponse.data.length > 0) {
        // Update existing item quantity
        const existingItem = existingResponse.data[0];
        const updateParams = {
          records: [{
            Id: existingItem.Id,
            quantity_c: parseInt(existingItem.quantity_c) + parseInt(item.quantity)
          }]
        };

        const updateResponse = await apperClient.updateRecord(this.tableName, updateParams);
        
        if (!updateResponse.success) {
          console.error('Failed to update cart item:', updateResponse.message);
          return {
            success: false,
            error: updateResponse.message
          };
        }
      } else {
        // Create new cart item
        const createParams = {
          records: [{
            Name: `Cart Item - ${item.productName}`,
            product_id_c: parseInt(item.productId),
            product_name_c: item.productName,
            price_c: parseFloat(item.price),
            quantity_c: parseInt(item.quantity),
            selected_size_c: item.selectedSize || '',
            selected_color_c: item.selectedColor || ''
          }]
        };

        const createResponse = await apperClient.createRecord(this.tableName, createParams);
        
        if (!createResponse.success) {
          console.error('Failed to add to cart:', createResponse.message);
          return {
            success: false,
            error: createResponse.message
          };
        }
      }

      return await this.getCart();

    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        error: error.message || 'Failed to add to cart'
      };
    }
  }

  async updateQuantity(itemId, quantity) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      if (quantity <= 0) {
        return await this.removeFromCart(itemId);
      }

      const params = {
        records: [{
          Id: parseInt(itemId),
          quantity_c: parseInt(quantity)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to update cart item quantity:', response.message);
        return {
          success: false,
          error: response.message
        };
      }

      return await this.getCart();

    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return {
        success: false,
        error: error.message || 'Failed to update cart'
      };
    }
  }

  async removeFromCart(itemId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(itemId)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to remove cart item:', response.message);
        return {
          success: false,
          error: response.message
        };
      }

      return await this.getCart();

    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove from cart'
      };
    }
  }

  async clearCart() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Get all cart items for current user
      const cartResponse = await this.getCart();
      
      if (!cartResponse.success || cartResponse.data.length === 0) {
        return {
          success: true,
          data: []
        };
      }

      const itemIds = cartResponse.data.map(item => item.id);

      const params = {
        RecordIds: itemIds
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to clear cart:', response.message);
        return {
          success: false,
          error: response.message
        };
      }

      return {
        success: true,
        data: []
      };

    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        error: error.message || 'Failed to clear cart'
      };
    }
  }

  async getCartTotal() {
    try {
      const cartResponse = await this.getCart();
      
      if (!cartResponse.success) {
        return {
          success: false,
          error: cartResponse.error
        };
      }

      const total = cartResponse.data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        success: true,
        data: total
      };

    } catch (error) {
      console.error('Error calculating cart total:', error);
      return {
        success: false,
        error: error.message || 'Failed to calculate cart total'
      };
    }
  }

  async getCartItemCount() {
    try {
      const cartResponse = await this.getCart();
      
      if (!cartResponse.success) {
        return {
          success: false,
          error: cartResponse.error
        };
      }

      const count = cartResponse.data.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        success: true,
        data: count
      };

    } catch (error) {
      console.error('Error getting cart item count:', error);
      return {
        success: false,
        error: error.message || 'Failed to get cart count'
      };
    }
  }
}

export default new CartService();