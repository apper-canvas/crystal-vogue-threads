import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import orderService from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [trackingDetails, setTrackingDetails] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getUserOrders();
      
      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.error || 'Failed to load orders');
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(query) ||
        order.items?.some(item => item.name?.toLowerCase().includes(query))
      );
    }

    // Filter by date
    if (dateFilter) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case '1year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      if (dateFilter !== '') {
        filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
      }
    }

    setFilteredOrders(filtered);
  };
  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    
    // Load tracking details
    try {
      const trackingResult = await orderService.getOrderTracking(order.Id);
      if (trackingResult.success) {
        setTrackingDetails(trackingResult.data);
      }
    } catch (err) {
      console.error('Error loading tracking details:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { variant: 'outline', className: 'border-yellow-300 text-yellow-700' },
      confirmed: { variant: 'outline', className: 'border-blue-300 text-blue-700' },
      shipped: { variant: 'outline', className: 'border-purple-300 text-purple-700' },
      delivered: { variant: 'outline', className: 'border-green-300 text-green-700' },
      cancelled: { variant: 'outline', className: 'border-red-300 text-red-700' }
    };

    const config = statusConfig[status] || statusConfig.processing;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

const getStatusIcon = (status) => {
    const icons = {
      processing: 'Clock',
      confirmed: 'CheckCircle',
      shipped: 'Truck',
      delivered: 'Package',
      cancelled: 'X'
    };
    return icons[status] || icons.processing;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading />
      </div>
    );
  }

if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error} onRetry={loadOrders} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your orders and account information</p>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">John Doe</h3>
                <p className="text-gray-500 text-sm">john@example.com</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => {
                  toast.info('Profile settings coming soon!');
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name="Settings" className="w-4 h-4 inline mr-2" />
                Settings
              </button>
              <button 
                onClick={() => {
                  navigate('/orders');
                  toast.info('Navigating to Orders');
                }}
                className="w-full text-left px-4 py-2 rounded-lg bg-accent text-white font-medium"
              >
                <ApperIcon name="Package" className="w-4 h-4 inline mr-2" />
                My Orders
              </button>
              <button 
onClick={() => {
                  navigate('/wishlist');
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name="Heart" className="w-4 h-4 inline mr-2" />
                Wishlist
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Orders Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-primary">Order History</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64"
                  />
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-40"
                  >
                    <option value="all">All Orders</option>
                    <option value="processing">Processing</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  <Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full sm:w-40"
                  >
                    <option value="">All Time</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="1year">Last Year</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="p-6">
              {filteredOrders.length === 0 ? (
                <Empty
                  icon="Package"
                  title="No orders found"
                  description={searchQuery || statusFilter !== 'all' 
                    ? "No orders match your current filters" 
                    : "You haven't placed any orders yet"
                  }
                  action={
                    searchQuery || statusFilter !== 'all' ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                        }}
                      >
                        Clear Filters
</Button>
                    ) : (
                      <Button onClick={() => navigate('/products')}>
                        Start Shopping
                      </Button>
                    )
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                      <div
                        key={order.Id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleOrderClick(order)}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="font-semibold text-primary">
                                Order #{order.orderNumber}
                              </h3>
                              {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Order Date:</span>{' '}
                                {format(new Date(order.orderDate), 'MMM d, yyyy')}
                              </div>
                              <div>
                                <span className="font-medium">Total:</span>{' '}
                                <span className="font-semibold text-primary">
                                  ${order.total.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Items:</span>{' '}
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </div>
                              {order.tracking && (
                                <div>
                                  <span className="font-medium">Tracking:</span>{' '}
                                  {order.tracking.trackingNumber}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center mt-4 space-x-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <img
                                  key={index}
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                />
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600">
                                    +{order.items.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center text-accent">
                            <ApperIcon name="ChevronRight" className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-primary">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Placed on {format(new Date(selectedOrder.orderDate), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedOrder.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowOrderDetails(false);
                      setSelectedOrder(null);
                      setTrackingDetails(null);
                    }}
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-primary mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-primary">{item.name}</h4>
                          <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 mt-6 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary">Order Total:</span>
                      <span className="font-bold text-xl text-primary">
                        ${selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div>
                  <h3 className="font-semibold text-primary mb-4">Order Tracking</h3>
                  
                  {trackingDetails ? (
                    <div className="space-y-6">
                      {/* Tracking Header */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-primary">Carrier:</span>
                          <span className="text-gray-600">{trackingDetails.carrier}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-primary">Tracking Number:</span>
                          <span className="text-gray-600 font-mono text-sm">
                            {trackingDetails.trackingNumber}
                          </span>
                        </div>
                      </div>

                      {/* Tracking Timeline */}
                      <div className="space-y-4">
                        {trackingDetails.events.map((event, index) => {
                          const isLast = index === trackingDetails.events.length - 1;
                          const isLatest = index === 0;
                          
                          return (
                            <div key={index} className="relative flex items-start space-x-4">
                              <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white",
                                isLatest 
                                  ? "border-accent text-accent" 
                                  : "border-gray-300 text-gray-400"
                              )}>
                                <ApperIcon 
                                  name={getStatusIcon(event.status.toLowerCase())} 
                                  className="w-4 h-4" 
                                />
                              </div>
                              
                              {!isLast && (
                                <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200" />
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={cn(
                                    "font-medium",
                                    isLatest ? "text-accent" : "text-primary"
                                  )}>
                                    {event.status}
                                  </p>
                                  <time className="text-sm text-gray-600">
                                    {format(new Date(event.date), 'MMM d, h:mm a')}
                                  </time>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {event.location}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="Package" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Loading tracking information...</p>
                    </div>
                  )}
                  
                  {/* Shipping Address */}
                  <div className="mt-8">
                    <h4 className="font-semibold text-primary mb-3">Shipping Address</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-primary">{selectedOrder.shippingAddress.name}</p>
                      <p className="text-gray-600">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;