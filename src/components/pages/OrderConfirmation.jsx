import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
            <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="font-display text-4xl font-bold text-primary mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          <p className="text-sm text-gray-500">
            Order Number: <span className="font-mono font-semibold text-accent">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-display text-xl font-semibold text-primary">
              Order Details
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-primary mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{format(new Date(order.orderDate), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="capitalize bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold bg-gradient-to-r from-accent to-yellow-600 bg-clip-text text-transparent">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-primary mb-3">Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-medium text-primary mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                    <img
                      src="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=80&h=80&fit=crop"
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary">{item.productName}</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                        {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-br from-accent/5 to-yellow-500/5 rounded-lg p-6 mb-8">
          <h3 className="font-display text-lg font-semibold text-primary mb-4">
            What happens next?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Package" className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-primary">Order Processing</h4>
                <p className="text-sm text-gray-600">We're preparing your order for shipment.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Truck" className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-primary">Shipping</h4>
                <p className="text-sm text-gray-600">Your order will be shipped within 1-2 business days.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Home" className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-primary">Delivery</h4>
                <p className="text-sm text-gray-600">Estimated delivery: 3-5 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            onClick={() => navigate("/products")}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Continue Shopping
          </Button>
          
          <Button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;