import { getApperClient } from "@/services/apperClient";

class OrderService {
  constructor() {
    this.tableName = 'order_c';
  }

  async createOrder(orderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const orderRecord = {
        Name: orderData.orderNumber || `Order-${Date.now()}`,
        order_number_c: orderData.orderNumber || `VT${Date.now().toString().slice(-6)}`,
        order_date_c: new Date().toISOString(),
        status_c: "confirmed",
        total_c: parseFloat(orderData.totalAmount) || 0,
        items_c: JSON.stringify(orderData.items || []),
        shipping_address_c: JSON.stringify(orderData.shippingAddress || {}),
        tracking_c: JSON.stringify({
          carrier: "FedEx",
          trackingNumber: `TRK${Date.now().toString().slice(-8)}`,
          events: [
            { date: new Date().toISOString(), status: "Order placed", location: "Online" }
          ]
        })
      };

      const params = {
        records: [orderRecord]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to create order:', response.message);
        return {
          success: false,
          error: response.message
        };
      }

      // Transform response data
      const createdOrder = response.results[0].data;
      const transformedData = {
        Id: createdOrder.Id,
        orderNumber: createdOrder.order_number_c,
        orderDate: createdOrder.order_date_c,
        status: createdOrder.status_c,
        total: parseFloat(createdOrder.total_c),
        items: JSON.parse(createdOrder.items_c || '[]'),
        shippingAddress: JSON.parse(createdOrder.shipping_address_c || '{}'),
        tracking: JSON.parse(createdOrder.tracking_c || '{}'),
        totalAmount: parseFloat(createdOrder.total_c)
      };

      return {
        success: true,
        data: transformedData
      };

    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    }
  }

  async getOrderById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "order_number_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "tracking_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        return {
          success: false,
          error: "Order not found"
        };
      }

      // Transform data
      const item = response.data;
      const transformedData = {
        Id: item.Id,
        orderNumber: item.order_number_c,
        orderDate: item.order_date_c,
        status: item.status_c,
        total: parseFloat(item.total_c) || 0,
        items: JSON.parse(item.items_c || '[]'),
        shippingAddress: JSON.parse(item.shipping_address_c || '{}'),
        tracking: JSON.parse(item.tracking_c || '{}')
      };

      return {
        success: true,
        data: transformedData
      };

    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch order'
      };
    }
  }

  async getUserOrders(filters = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "order_number_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "tracking_c"}}
        ],
        where: [],
        orderBy: [{"fieldName": "order_date_c", "sorttype": "DESC"}],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        params.where.push({
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [filters.status]
        });
      }

      if (filters.search) {
        params.whereGroups = [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {
                "fieldName": "order_number_c",
                "operator": "Contains",
                "values": [filters.search]
              },
              {
                "fieldName": "items_c",
                "operator": "Contains",
                "values": [filters.search]
              }
            ],
            "operator": "OR"
          }]
        }];
      }

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Failed to fetch user orders:', response.message);
        return {
          success: false,
          error: response.message
        };
      }

      // Transform data
      const transformedData = response.data.map(item => ({
        Id: item.Id,
        orderNumber: item.order_number_c,
        orderDate: item.order_date_c,
        status: item.status_c,
        total: parseFloat(item.total_c) || 0,
        items: JSON.parse(item.items_c || '[]'),
        shippingAddress: JSON.parse(item.shipping_address_c || '{}'),
        tracking: JSON.parse(item.tracking_c || '{}')
      }));

      return {
        success: true,
        data: transformedData
      };

    } catch (error) {
      console.error('Error fetching user orders:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch orders'
      };
    }
  }

  async getOrderTracking(orderId) {
    try {
      const orderResponse = await this.getOrderById(orderId);
      
      if (!orderResponse.success) {
        return {
          success: false,
          error: "Order not found"
        };
      }

      return {
        success: true,
        data: orderResponse.data.tracking
      };

    } catch (error) {
      console.error('Error fetching order tracking:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch tracking information'
      };
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First get current order to update tracking
      const currentOrderResponse = await this.getOrderById(orderId);
      if (!currentOrderResponse.success) {
        return {
          success: false,
          error: "Order not found"
        };
      }

      const currentOrder = currentOrderResponse.data;
      const tracking = currentOrder.tracking || { events: [] };

      // Add new tracking event
      const trackingEvent = {
        date: new Date().toISOString(),
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        location: "Warehouse"
      };

      tracking.events = tracking.events || [];
      tracking.events.push(trackingEvent);

      const params = {
        records: [{
          Id: parseInt(orderId),
          status_c: newStatus,
          tracking_c: JSON.stringify(tracking)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to update order status:', response.message);
        return {
          success: false,
          error: response.message
        };
      }

      // Get updated order
      return await this.getOrderById(orderId);

    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update order status'
      };
    }
  }

  async processPayment(paymentData) {
    try {
      // Simulate async payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate payment processing with 90% success rate
      const success = Math.random() > 0.1;
      
      if (success) {
        return {
          success: true,
          data: {
            transactionId: `txn_${Date.now()}`,
            status: "completed"
          }
        };
      } else {
        return {
          success: false,
          error: "Payment failed. Please try again."
        };
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  }
}

export default new OrderService();