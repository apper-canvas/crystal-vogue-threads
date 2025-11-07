import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { wishlistService } from '@/services/api/wishlistService';
import productsService from '@/services/api/productsService';

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const wishlistIds = await wishlistService.getAll();
      
      if (wishlistIds.length === 0) {
        setWishlistItems([]);
        setProducts([]);
        setLoading(false);
        return;
}

      const productsResponse = await productsService.getAll();
      if (!productsResponse.success) {
        throw new Error('Failed to fetch products');
      }
      
      const wishlistProducts = productsResponse.data.filter(product => 
        wishlistIds.includes(product.Id)
      );
      setWishlistItems(wishlistIds);
      setProducts(wishlistProducts);
    } catch (err) {
      setError('Failed to load wishlist items');
      toast.error('Failed to load your wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistService.remove(productId);
      setWishlistItems(prev => prev.filter(id => id !== productId));
      setProducts(prev => prev.filter(product => product.Id !== productId));
      toast.success('Item removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item from wishlist');
    }
  };

const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-primary mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadWishlist} className="mr-2">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="ArrowLeft" size={16} />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-display font-bold text-primary">My Wishlist</h1>
                <p className="text-gray-600">Your saved items</p>
              </div>
            </div>
          </div>

          <Empty 
            title="Your wishlist is empty"
            description="Save items you love to see them here"
            actionText="Browse Products"
            onAction={() => navigate('/products')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-primary">My Wishlist</h1>
              <p className="text-gray-600">{products.length} saved {products.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add More Items</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.Id}
              className="group bg-surface rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                <button
                  onClick={() => handleRemoveFromWishlist(product.Id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ApperIcon name="X" size={16} className="text-gray-600" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-primary group-hover:text-accent transition-colors duration-200 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-accent">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Star" size={14} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleViewProduct(product.Id)}
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="Eye" size={16} />
                    <span>View</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveFromWishlist(product.Id)}
                    className="flex items-center justify-center px-3"
                  >
                    <ApperIcon name="Trash2" size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/products')}
            className="flex items-center space-x-2 mx-auto"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Continue Shopping</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;