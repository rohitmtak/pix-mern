import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

// Helper function to format price with proper comma separators
const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/product/list')
      
      if (response.data.success) {
        setList(response.data.data.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // Helper function to get the first image from a product
  const getProductImage = (item) => {
    if (item.colorVariants && item.colorVariants.length > 0 && item.colorVariants[0].images) {
      return item.colorVariants[0].images[0]
    }
    if (item.image && item.image.length > 0) {
      return item.image[0]
    }
    return '' // Return empty string if no image found
  }

  // Helper function to get the price from a product
  const getProductPrice = (item) => {
    if (item.colorVariants && item.colorVariants.length > 0) {
      return item.colorVariants[0].price
    }
    return item.price || 0
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-jost text-3xl font-light text-gray-800 mb-2">Product Management</h1>
        <p className="text-gray-600">Manage your product catalog and inventory</p>
      </div>

      {/* Summary */}
      {!loading && list.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total Products: {list.length}</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Products Found</h3>
          <p className="text-gray-600">Start by adding your first product to the catalog.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-2">Image</div>
              <div className="col-span-3">Product Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-2">Variants</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Action</div>
            </div>
          </div>

          {/* Product List */}
          <div className="divide-y divide-gray-200">
            {list.map((item, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Product Image */}
                  <div className="col-span-2">
                    <img 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200" 
                      src={getProductImage(item)} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTI4IDI4SDM2VjM2SDI4VjI4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                      }}
                    />
                  </div>

                  {/* Product Name */}
                  <div className="col-span-3">
                    <h3 className="font-medium text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="col-span-1">
                    <span className="font-medium text-gray-800">{formatPrice(getProductPrice(item))}</span>
                  </div>

                  {/* Variants */}
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {item.colorVariants && item.colorVariants.length > 0 ? (
                        item.colorVariants.map((variant, vIndex) => (
                          <span 
                            key={vIndex} 
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              variant.video 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {variant.color} {variant.video && '🎥'}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.bestseller 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.bestseller ? 'Featured' : 'Standard'}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                      title="Delete product"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default List