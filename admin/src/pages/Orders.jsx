import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

// Helper function for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Helper function to format price with proper comma separators
const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null)
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [shippingForm, setShippingForm] = useState({
    courier: 'Shiprocket',
    trackingNumber: '',
    estimatedDelivery: '',
    shippingNotes: ''
  })

  const getRelevantStatusOptions = (order) => {
    const { status, paymentStatus, payment } = order;
    
    let options = [];
    
    // If payment is pending, only show payment-related options
    if (paymentStatus === 'pending' || !payment) {
      options = [
        { value: "pending", label: "⏳ Payment Pending", color: "bg-orange-100 text-orange-800" },
        { value: "cancelled", label: "❌ Cancel Order", color: "bg-red-100 text-red-800" }
      ];
    }
    // If payment is confirmed, show progression options
    else if (status === 'confirmed') {
      options = [
        { value: "confirmed", label: "✅ Order Confirmed", color: "bg-green-100 text-green-800" },
        { value: "shipped", label: "🚚 Ship Order", color: "bg-purple-100 text-purple-800" },
        { value: "cancelled", label: "❌ Cancel Order", color: "bg-red-100 text-red-800" }
      ];
    }
    // If order is shipped, show delivery options
    else if (status === 'shipped') {
      options = [
        { value: "shipped", label: "🚚 Shipped", color: "bg-purple-100 text-purple-800" },
        { value: "delivered", label: "✅ Mark Delivered", color: "bg-green-100 text-green-800" },
        { value: "cancelled", label: "❌ Cancel Order", color: "bg-red-100 text-red-800" }
      ];
    }
    // If order is delivered, show completion options
    else if (status === 'delivered') {
      options = [
        { value: "delivered", label: "✅ Delivered", color: "bg-green-100 text-green-800" }
      ];
    }
    // If order is cancelled, show limited options
    else if (status === 'cancelled') {
      options = [
        { value: "cancelled", label: "❌ Cancelled", color: "bg-red-100 text-red-800" }
      ];
    }
    // Default fallback
    else {
      options = [
        { value: "confirmed", label: "✅ Order Confirmed", color: "bg-green-100 text-green-800" },
        { value: "cancelled", label: "❌ Cancel Order", color: "bg-red-100 text-red-800" }
      ];
    }
    
    // Filter out the current status to prevent same-status updates
    return options.filter(option => option.value !== status);
  }

  const fetchAllOrders = async () => {
    if (!token) {
      console.log('No authentication available')
      setOrders([])
      setLoading(false)
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(backendUrl + '/api/order/list', {}, { 
        withCredentials: true // Include httpOnly cookies
      })
      if (response.data.success) {
        // Handle both 'orders' and 'data' response formats for backward compatibility
        const ordersData = response.data.orders || response.data.data || []
        setOrders(ordersData.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
      setOrders([]) // Set empty array on error
    } finally {
      setLoading(false);
    }
  }

  const statusHandler = async ( orderId, newStatus ) => {
    // Find the current order to check if status is actually changing
    const currentOrder = orders.find(o => o._id === orderId)
    if (currentOrder && currentOrder.status === newStatus) {
      console.log('Status unchanged, skipping update')
      return
    }
    
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId, status: newStatus}, { 
        withCredentials: true // Include httpOnly cookies
      })
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

  const getStatusColor = (status, paymentStatus, payment) => {
    // If payment is pending, show orange color for payment pending status
    if (paymentStatus === 'pending' || !payment) {
      return 'bg-orange-100 text-orange-800'
    }
    
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'placed':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
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
    if (newStatus === 'shipped') {
      // Find the order details
      const order = orders.find(o => o._id === orderId)
      setSelectedOrder(order)
      setShowShippingModal(true)
      setOpenStatusDropdown(null)
    } else {
      statusHandler(orderId, newStatus)
      setOpenStatusDropdown(null)
    }
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

  const handleShippingSubmit = async () => {
    try {
      // Demo: Simulate API call
      console.log('Shipping details:', {
        orderId: selectedOrder._id,
        courier: shippingForm.courier,
        trackingNumber: shippingForm.trackingNumber,
        estimatedDelivery: shippingForm.estimatedDelivery,
        notes: shippingForm.shippingNotes
      })
      
      // Update order status with shipping info
      await statusHandler(selectedOrder._id, 'shipped')
      
      // Send shipping notification via WhatsApp
      try {
        await axios.post(`${backendUrl}/api/test/send-shipping-notification`, {
          orderId: selectedOrder._id,
          trackingNumber: shippingForm.trackingNumber,
          courier: shippingForm.courier
        }, {
          withCredentials: true // Include httpOnly cookies
        })
      } catch (whatsappError) {
        console.log('WhatsApp notification failed:', whatsappError)
      }
      
      // Reset form and close modal
      setShippingForm({
        courier: 'Shiprocket',
        trackingNumber: '',
        estimatedDelivery: '',
        shippingNotes: ''
      })
      setShowShippingModal(false)
      setSelectedOrder(null)
      
      toast.success('Order shipped successfully! Customer will be notified via WhatsApp.')
    } catch (error) {
      toast.error('Failed to process shipping')
    }
  }

  const generateTrackingNumber = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    return `SR${random}${timestamp}`
  }

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

      {/* Summary - Moved to top */}
      {!loading && orders.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-300 p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">📊 Total Orders: {orders.length}</span>
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                      {new Date(order.orderDate || order.date).toLocaleDateString()} • {new Date(order.orderDate || order.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </div>
                    <div className="text-sm text-gray-600 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                      {order.items.length} items
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
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
                           getStatusColor(order.status, order.paymentStatus, order.payment)
                        )}>
                           {order.paymentStatus === 'pending' || !order.payment ? 
                             '⏳ Payment Pending' : 
                             getRelevantStatusOptions(order).find(option => option.value === order.status)?.label || order.status
                           }
                        </span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${openStatusDropdown === order._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {openStatusDropdown === order._id && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                           {getRelevantStatusOptions(order).map((option, optionIndex) => (
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Items Table */}
                  <div className="">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Order Items
                    </h4>
                    
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100">
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
                                <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Customer Details
                    </h4>
                    
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100">
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

      {/* Shipping Modal */}
      {showShippingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">🚚 Ship Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 mb-2">📦 Shipping to:</h4>
                <div className="text-sm text-gray-700">
                  <div><strong>{selectedOrder.shippingAddress?.fullName || selectedOrder.customer?.firstName || 'N/A'}</strong></div>
                  <div>{selectedOrder.shippingAddress?.line1 || selectedOrder.address?.street || 'N/A'}</div>
                  <div>{selectedOrder.shippingAddress?.city || selectedOrder.address?.city || 'N/A'}, {selectedOrder.shippingAddress?.state || selectedOrder.address?.state || 'N/A'}</div>
                  <div>📞 {selectedOrder.shippingAddress?.phone || selectedOrder.customerPhone || 'N/A'}</div>
                </div>
              </div>

              {/* Shipping Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Courier Service</label>
                  <select
                    value={shippingForm.courier}
                    onChange={(e) => setShippingForm({...shippingForm, courier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Shiprocket">🚚 Shiprocket (Recommended)</option>
                    <option value="Delhivery">📦 Delhivery</option>
                    <option value="Blue Dart">✈️ Blue Dart</option>
                    <option value="DTDC">🚛 DTDC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shippingForm.trackingNumber}
                      onChange={(e) => setShippingForm({...shippingForm, trackingNumber: e.target.value})}
                      placeholder="Enter tracking number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setShippingForm({...shippingForm, trackingNumber: generateTrackingNumber()})}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery</label>
                  <input
                    type="date"
                    value={shippingForm.estimatedDelivery}
                    onChange={(e) => setShippingForm({...shippingForm, estimatedDelivery: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Notes</label>
                  <textarea
                    value={shippingForm.shippingNotes}
                    onChange={(e) => setShippingForm({...shippingForm, shippingNotes: e.target.value})}
                    placeholder="Any special instructions for delivery..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Demo Features */}
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-blue-900 mb-2">🎯 Demo Features:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 📧 Customer will receive SMS/Email notification</li>
                  <li>• 🏷️ Shipping label will be generated automatically</li>
                  <li>• 📱 Tracking link will be sent to customer</li>
                  <li>• 📊 Order analytics will be updated</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleShippingSubmit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  🚚 Ship Order & Notify Customer
                </button>
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
