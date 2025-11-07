import { getApperClient } from "@/services/apperClient";

const wishlistService = {
  tableName: 'wishlist_item_c',

  // Get all wishlist items (returns array of product IDs)
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "product_id_c"}}
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Failed to fetch wishlist:', response.message);
        return [];
      }

      return response.data.map(item => parseInt(item.product_id_c));

    } catch (error) {
      console.error('Error retrieving wishlist:', error);
      return [];
    }
  },

  // Add item to wishlist
  async add(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Check if item already exists
      const current = await this.getAll();
      if (current.includes(parseInt(productId))) {
        return false; // Item already in wishlist
      }

      const params = {
        records: [{
          Name: `Wishlist Item ${productId}`,
          product_id_c: parseInt(productId)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to add to wishlist:', response.message);
        throw new Error('Failed to add item to wishlist');
      }

      return true;

    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Failed to add item to wishlist');
    }
  },

  // Remove item from wishlist
  async remove(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First find the wishlist item to get its ID
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "product_id_c"}}
        ],
        where: [{
          "FieldName": "product_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(productId)]
        }]
      };

      const findResponse = await apperClient.fetchRecords(this.tableName, params);

      if (!findResponse.success || !findResponse.data.length) {
        return true; // Item doesn't exist, consider it removed
      }

      const wishlistItemIds = findResponse.data.map(item => item.Id);

      const deleteParams = {
        RecordIds: wishlistItemIds
      };

      const response = await apperClient.deleteRecord(this.tableName, deleteParams);

      if (!response.success) {
        console.error('Failed to remove from wishlist:', response.message);
        throw new Error('Failed to remove item from wishlist');
      }

      return true;

    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove item from wishlist');
    }
  },

  // Check if item is in wishlist
  async isInWishlist(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        return false;
      }

      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "product_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(productId)]
        }],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        return false;
      }

      return response.data.length > 0;

    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },

  // Clear entire wishlist
  async clear() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Get all wishlist items for current user
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        pagingInfo: {
          limit: 1000,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        return false;
      }

      if (response.data.length === 0) {
        return true; // Already empty
      }

      const itemIds = response.data.map(item => item.Id);

      const deleteParams = {
        RecordIds: itemIds
      };

      const deleteResponse = await apperClient.deleteRecord(this.tableName, deleteParams);

      if (!deleteResponse.success) {
        console.error('Failed to clear wishlist:', deleteResponse.message);
        throw new Error('Failed to clear wishlist');
      }

      return true;

    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw new Error('Failed to clear wishlist');
    }
  },

  // Get wishlist count
  async getCount() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        return 0;
      }

      const params = {
        aggregators: [{
          "id": "wishlistCount",
          "fields": [{"field": {"Name": "Id"}, "Function": "Count"}]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        return 0;
      }

      return response.data.length || 0;

    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }
};

export { wishlistService };