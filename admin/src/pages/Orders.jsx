import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null)

  const statusOptions = [
    { value: "Order Placed", label: "📋 Order Placed", color: "bg-blue-100 text-blue-800" },
    { value: "Packing", label: "📦 Packing", color: "bg-yellow-100 text-yellow-800" },
    { value: "Shipped", label: "🚚 Shipped", color: "bg-purple-100 text-purple-800" },
    { value: "Out for delivery", label: "🚛 Out for delivery", color: "bg-orange-100 text-orange-800" },
    { value: "Delivered", label: "✅ Delivered", color: "bg-green-100 text-green-800" }
  ]

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      setLoading(true);
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  const statusHandler = async ( orderId, newStatus ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId, status: newStatus}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
        toast.success('Order status updated successfully')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800'
      case 'Packing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Shipped':
        return 'bg-purple-100 text-purple-800'
      case 'Out for delivery':
        return 'bg-orange-100 text-orange-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (payment) => {
    return payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const toggleStatusDropdown = (orderId) => {
    setOpenStatusDropdown(openStatusDropdown === orderId ? null : orderId)
  }

  const handleStatusChange = (orderId, newStatus) => {
    statusHandler(orderId, newStatus)
    setOpenStatusDropdown(null)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown-container')) {
        setOpenStatusDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, [token])

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
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <button
          onClick={fetchAllOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-lg font-bold text-gray-900 mr-12">
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 mr-12">
                      {new Date(order.orderDate || order.date).toLocaleDateString()} • {new Date(order.orderDate || order.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </div>
                    <div className="text-sm text-gray-600 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                      {order.items.length} items
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {currency}{order.total || order.amount}
                      </div>
                    </div>
                    
                    <span className={cn(
                      "inline-flex px-3 py-1 text-sm font-semibold rounded-full",
                      order.paymentStatus === 'paid' || order.payment ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}>
                      {order.paymentStatus === 'paid' || order.payment ? 'Paid' : 'Pending'}
                    </span>
                    
                    <div className="relative status-dropdown-container">
                      <div 
                        onClick={() => toggleStatusDropdown(order._id)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md cursor-pointer bg-white flex justify-between items-center hover:bg-gray-50 transition-colors min-w-[140px]"
                      >
                        <span className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                          getStatusColor(order.status)
                        )}>
                          {statusOptions.find(option => option.value === order.status)?.label || order.status}
                        </span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${openStatusDropdown === order._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {openStatusDropdown === order._id && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          {statusOptions.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              onClick={() => handleStatusChange(order._id, option.value)}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center"
                            >
                              <span className={cn(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                option.color
                              )}>
                                {option.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Items Table */}
                  <div className="lg:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Order Items
                    </h4>
                    
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.items.map((item, itemIndex) => (
                            <tr key={itemIndex} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                    <img 
                                      src={item.image || item.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyNEgzMlYzM0gxNlYyNFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTIwIDI4SDI4VjMxSDIwVjI4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyNEgzMlYzM0gxNlYyNFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTIwIDI4SDI4VjMxSDIwVjI4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                                      }}
                                    />
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm text-gray-900">
                                  {item.size && `Size: ${item.size}`}
                                  {item.size && item.color && ' • '}
                                  {item.color && `Color: ${item.color}`}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-sm text-gray-900">{item.quantity}</span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-sm font-semibold text-gray-900">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="lg:col-span-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Customer Details
                    </h4>
                    
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {order.shippingAddress?.fullName || order.address?.firstName || order.customer?.firstName || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {order.shippingAddress?.phone || order.customerPhone || order.address?.phone || order.customer?.phone || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="space-y-1">
                                <div>{order.shippingAddress?.line1 || order.address?.street || order.customer?.street || 'N/A'}</div>
                                {order.shippingAddress?.line2 && (
                                  <div>{order.shippingAddress.line2}</div>
                                )}
                                <div>
                                  {order.shippingAddress?.city || order.address?.city || order.customer?.city || 'N/A'}, {order.shippingAddress?.state || order.address?.state || order.customer?.state || 'N/A'}
                                </div>
                                <div>
                                  {order.shippingAddress?.country || order.address?.country || order.customer?.country || 'IN'} {order.shippingAddress?.postalCode || order.address?.zipcode || order.customer?.zipcode || 'N/A'}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && orders.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">📊 Total Orders: {orders.length}</span>
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default Orders
