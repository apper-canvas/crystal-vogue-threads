const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  constructor() {
    this.orders = [];
    this.initializeMockOrders();
  }

  initializeMockOrders() {
    // Mock orders for demonstration
    const mockOrders = [
      {
        Id: 1001,
        orderNumber: "VT001001",
        orderDate: "2024-01-15T10:30:00Z",
        status: "delivered",
        total: 299.99,
        items: [
          { id: 1, name: "Classic Denim Jacket", price: 149.99, quantity: 1, image: "/api/placeholder/80/80" },
          { id: 2, name: "Cotton T-Shirt", price: 29.99, quantity: 5, image: "/api/placeholder/80/80" }
        ],
        shippingAddress: {
          name: "John Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001"
        },
        tracking: {
          carrier: "FedEx",
          trackingNumber: "1234567890",
          events: [
            { date: "2024-01-15T10:30:00Z", status: "Order placed", location: "Online" },
            { date: "2024-01-16T09:00:00Z", status: "Processing", location: "Warehouse" },
            { date: "2024-01-16T15:30:00Z", status: "Shipped", location: "New York, NY" },
            { date: "2024-01-18T14:20:00Z", status: "Out for delivery", location: "New York, NY" },
            { date: "2024-01-18T16:45:00Z", status: "Delivered", location: "New York, NY" }
          ]
        }
      },
      {
        Id: 1002,
        orderNumber: "VT001002", 
        orderDate: "2024-01-20T14:15:00Z",
        status: "shipped",
        total: 189.98,
        items: [
          { id: 3, name: "Leather Boots", price: 189.98, quantity: 1, image: "/api/placeholder/80/80" }
        ],
        shippingAddress: {
          name: "John Doe",
          address: "123 Main St",
          city: "New York", 
          state: "NY",
          zip: "10001"
        },
        tracking: {
          carrier: "UPS",
          trackingNumber: "9876543210",
          events: [
            { date: "2024-01-20T14:15:00Z", status: "Order placed", location: "Online" },
            { date: "2024-01-21T10:00:00Z", status: "Processing", location: "Warehouse" },
            { date: "2024-01-22T08:30:00Z", status: "Shipped", location: "Chicago, IL" },
            { date: "2024-01-23T12:00:00Z", status: "In transit", location: "Cleveland, OH" }
          ]
        }
      },
      {
        Id: 1003,
        orderNumber: "VT001003",
        orderDate: "2024-01-25T11:45:00Z", 
        status: "processing",
        total: 459.97,
        items: [
          { id: 4, name: "Winter Coat", price: 299.99, quantity: 1, image: "/api/placeholder/80/80" },
          { id: 5, name: "Wool Scarf", price: 79.99, quantity: 2, image: "/api/placeholder/80/80" }
        ],
        shippingAddress: {
          name: "John Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY", 
          zip: "10001"
        },
        tracking: {
          carrier: "DHL",
          trackingNumber: "5555666677",
          events: [
            { date: "2024-01-25T11:45:00Z", status: "Order placed", location: "Online" },
            { date: "2024-01-26T09:30:00Z", status: "Processing", location: "Warehouse" }
          ]
        }
      }
    ];
    
    this.orders = [...mockOrders];
  }

  async createOrder(orderData) {
    await delay(500);
    
    const order = {
      Id: Date.now(),
      ...orderData,
      status: "confirmed",
      orderDate: new Date().toISOString(),
      orderNumber: `VT${Date.now().toString().slice(-6)}`,
      tracking: {
        carrier: "FedEx",
        trackingNumber: `TRK${Date.now().toString().slice(-8)}`,
        events: [
          { date: new Date().toISOString(), status: "Order placed", location: "Online" }
        ]
      }
    };

    this.orders.unshift(order);
    
    return {
      success: true,
      data: order
    };
  }

  async getOrderById(id) {
    await delay(200);
    
    const order = this.orders.find(o => o.Id === parseInt(id));
    
    if (!order) {
      return {
        success: false,
        error: "Order not found"
      };
    }

    return {
      success: true,
      data: order
    };
  }

  async getUserOrders(filters = {}) {
    await delay(300);
    
    let filteredOrders = [...this.orders];
    
    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    return {
      success: true,
      data: filteredOrders
    };
  }

  async getOrderTracking(orderId) {
    await delay(200);
    
    const order = this.orders.find(o => o.Id === parseInt(orderId));
    
    if (!order) {
      return {
        success: false,
        error: "Order not found"
      };
    }
    
    return {
      success: true,
      data: order.tracking
    };
  }

  async updateOrderStatus(orderId, newStatus) {
    await delay(300);
    
    const orderIndex = this.orders.findIndex(o => o.Id === parseInt(orderId));
    
    if (orderIndex === -1) {
      return {
        success: false,
        error: "Order not found"
      };
    }
    
    this.orders[orderIndex].status = newStatus;
    
    // Add tracking event
    const trackingEvent = {
      date: new Date().toISOString(),
      status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
      location: "Warehouse"
    };
    
    this.orders[orderIndex].tracking.events.push(trackingEvent);
    
    return {
      success: true,
      data: this.orders[orderIndex]
    };
  }

  async processPayment(paymentData) {
    await delay(1000);
    
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    
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
  }
}

export default new OrderService();