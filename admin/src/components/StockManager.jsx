
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const StockManager = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdates, setStockUpdates] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/stock/low?threshold=5');
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
    }
    return [];
  };

  const updateStock = async (productId, colorVariantIndex, newStock) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/stock/update',
        {
          productId,
          colorVariantIndex,
          newStock: parseInt(newStock)
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Stock updated successfully');
        fetchProducts(); // Refresh the list
        setStockUpdates({}); // Clear any pending updates
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update stock');
      console.error(error);
    }
  };

  const handleStockChange = (productId, variantIndex, newValue) => {
    setStockUpdates(prev => ({
      ...prev,
      [`${productId}-${variantIndex}`]: newValue
    }));
  };

  const handleSaveStock = (productId, variantIndex) => {
    const newStock = stockUpdates[`${productId}-${variantIndex}`];
    if (newStock !== undefined && newStock >= 0) {
      updateStock(productId, variantIndex, newStock);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">Low Stock Alert</h3>
        <LowStockAlert token={token} />
      </div>

      {/* Product Stock Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Products Stock</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                product.colorVariants.map((variant, variantIndex) => (
                  <tr key={`${product._id}-${variantIndex}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category} - {product.subCategory}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{
                            backgroundColor: getColorHex(variant.color)
                          }}
                        ></div>
                        <span className="text-sm text-gray-900">{variant.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        variant.stock === 0 && "bg-red-100 text-red-800",
                        variant.stock > 0 && variant.stock <= 5 && "bg-orange-100 text-orange-800",
                        variant.stock > 5 && variant.stock <= 15 && "bg-yellow-100 text-yellow-800",
                        variant.stock > 15 && "bg-green-100 text-green-800"
                      )}>
                        {variant.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                        placeholder={variant.stock}
                        value={stockUpdates[`${product._id}-${variantIndex}`] || ''}
                        onChange={(e) => handleStockChange(product._id, variantIndex, e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleSaveStock(product._id, variantIndex)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color hex values
const getColorHex = (color) => {
  const colorMap = {
    Black: "#000000",
    White: "#FFFFFF",
    Navy: "#000080",
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#008000",
    Yellow: "#FFFF00",
    Pink: "#FFC0CB",
    Purple: "#800080",
    Orange: "#FFA500",
    Brown: "#A52A2A",
    Gray: "#808080",
  };
  return colorMap[color] || "#CCCCCC";
};

// Helper function for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Low Stock Alert Component
const LowStockAlert = ({ token }) => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        setLoading(true);
        const response = await axios.get(backendUrl + '/api/product/stock/low?threshold=5');
        if (response.data.success) {
          setLowStockProducts(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch low stock products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  if (loading) {
    return <div className="text-sm text-orange-600">Loading low stock items...</div>;
  }

  if (lowStockProducts.length === 0) {
    return <div className="text-sm text-green-600">No low stock items found!</div>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-orange-700">
        {lowStockProducts.length} product(s) have low stock:
      </p>
      <div className="space-y-1">
        {lowStockProducts.slice(0, 5).map((product) => (
          <div key={product._id} className="text-sm text-orange-600">
            • {product.name}: {product.lowStockVariants.map(v => `${v.color} (${v.stock})`).join(', ')}
          </div>
        ))}
        {lowStockProducts.length > 5 && (
          <div className="text-sm text-orange-600">
            ... and {lowStockProducts.length - 5} more
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManager;
