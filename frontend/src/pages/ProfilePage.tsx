import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast, toastMessages } from "@/config/toastConfig";
import { config } from "@/config/env";
import { useCart } from "@/contexts/CartContext";

interface OrderItem {
  _id: string;
  items: Array<{
    productId: string;
    name?: string;
    price?: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
  }>;
  amount: number;
  status: string;
  payment: boolean;
  date: string | number | Date;
}

type ProfileTab = 'account' | 'addresses' | 'orders';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart, loadUserCartFromBackend } = useCart();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('account');
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<{ name: string; email: string; phone?: string; addresses?: any[] } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<{ name: string; phone: string }>({ name: '', phone: '' });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressEditForm, setAddressEditForm] = useState<{
    fullName: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN'
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.post(
          `${config.api.baseUrl}/order/userorders`,
          {},
          { headers: { token } }
        );
        if (res.data?.success && Array.isArray(res.data?.orders)) {
          setOrders(res.data.orders);
        } else if (Array.isArray(res.data)) {
          // In case API returns array directly
          setOrders(res.data as OrderItem[]);
        } else {
          showToast.error(res.data?.message || toastMessages.profile.ordersLoadFailed);
        }
      } catch (err) {
        showToast.error(toastMessages.profile.ordersLoadFailed);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${config.api.baseUrl}/user/me`, { headers: { token } });
        if (res.data?.success && res.data.user) {
          // Sort addresses: default first, then others
          if (res.data.user.addresses && Array.isArray(res.data.user.addresses)) {
            const sortedAddresses = res.data.user.addresses.sort((a: any, b: any) => {
              if (a.isDefault && !b.isDefault) return -1;
              if (!a.isDefault && b.isDefault) return 1;
              return 0;
            });
            res.data.user.addresses = sortedAddresses;
          }
          setProfile(res.data.user);
        }
      } catch (err) {
        // surface but don't block the page
        console.error('Failed to load profile', err);
      } finally {
        setProfileLoading(false);
      }
    };

    // Load user's persistent cart from backend
    const loadCart = async () => {
      try {
        await loadUserCartFromBackend();
      } catch (error) {
        console.error('Failed to load user cart:', error);
      }
    };

    fetchOrders();
    fetchProfile();
    loadCart();
  }, [navigate, token]); // Removed loadUserCartFromBackend dependency since it's now memoized

  // Update edit form when profile changes
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearCart(); // Clear cart state and localStorage
    showToast.success(toastMessages.profile.loggedOut);
    navigate('/');
  };

  const handleEditProfile = async () => {
    try {
      const res = await axios.put(`${config.api.baseUrl}/user/me`, editForm, { headers: { token } });
      if (res.data?.success) {
        setProfile(res.data.user);
        setIsEditing(false);
        showToast.success(toastMessages.profile.profileUpdated);
      } else {
        showToast.error(res.data?.message || toastMessages.profile.profileUpdateFailed);
      }
    } catch (err) {
      showToast.error(toastMessages.profile.profileUpdateFailed);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: profile?.name || '',
      phone: profile?.phone || ''
    });
    setIsEditing(false);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    setAddressEditForm({
      fullName: address.fullName || '',
      phone: address.phone || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'IN'
    });
  };

  const handleUpdateAddress = async () => {
    if (!editingAddressId) return;
    
    try {
      const res = await axios.put(
        `${config.api.baseUrl}/user/addresses/${editingAddressId}`,
        { address: addressEditForm },
        { headers: { token } }
      );
      if (res.data?.success) {
        // Sort addresses: default first, then others, and remove duplicates
        const uniqueAddresses = res.data.addresses.filter((address: any, index: number, self: any[]) => 
          index === self.findIndex(addr => addr.id === address.id)
        );
        
        const sortedAddresses = uniqueAddresses.sort((a: any, b: any) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return 0;
        });
        
        setProfile(prev => ({
          ...prev!,
          addresses: sortedAddresses
        }));
        setEditingAddressId(null);
        showToast.success(toastMessages.profile.addressUpdated);
      } else {
        showToast.error(res.data?.message || toastMessages.profile.addressUpdateFailed);
      }
    } catch (err) {
      showToast.error(toastMessages.profile.addressUpdateFailed);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const res = await axios.delete(
        `${config.api.baseUrl}/user/addresses/${addressId}`,
        { headers: { token } }
      );
      if (res.data?.success) {
        // Sort addresses: default first, then others, and remove duplicates
        const uniqueAddresses = res.data.addresses.filter((address: any, index: number, self: any[]) => 
          index === self.findIndex(addr => addr.id === address.id)
        );
        
        const sortedAddresses = uniqueAddresses.sort((a: any, b: any) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return 0;
        });
        
        setProfile(prev => ({
          ...prev!,
          addresses: sortedAddresses
        }));
        showToast.success(toastMessages.profile.addressDeleted);
      } else {
        showToast.error(res.data?.message || toastMessages.profile.addressDeleteFailed);
      }
    } catch (err) {
      showToast.error(toastMessages.profile.addressDeleteFailed);
    }
  };

  const handleCancelAddressEdit = () => {
    setEditingAddressId(null);
    setAddressEditForm({
      fullName: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'IN'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <section className="px-16 py-16">
          <div className="max-w-screen-2xl mx-auto">
            {/* Welcome */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-jost uppercase tracking-widest">Welcome,</h1>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Sidebar */}
              <aside className="col-span-12 md:col-span-3">
                <div className="border border-gray-200">
                  <button
                    className={`w-full text-left px-6 py-5 uppercase text-sm tracking-wide ${activeTab === 'account' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('account')}
                  >
                    My Account
                  </button>
                  <div className="border-t border-gray-200" />
                  <button
                    className={`w-full text-left px-6 py-5 uppercase text-sm tracking-wide ${activeTab === 'addresses' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('addresses')}
                  >
                    Addresses
                  </button>
                  <div className="border-t border-gray-200" />
                  <button
                    className={`w-full text-left px-6 py-5 uppercase text-sm tracking-wide ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    My Orders
                  </button>
                  <div className="border-t border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-6 py-5 uppercase text-sm tracking-wide bg-white text-black hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </aside>

              {/* Content */}
              <section className="col-span-12 md:col-span-9">
                <div className="border border-gray-200 p-8 bg-[#fafafa]">
                  {activeTab === 'account' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <div className="text-lg font-medium mb-4">My Profile</div>
                        {profileLoading ? (
                          <div className="text-sm text-gray-600">Loading profile...</div>
                        ) : isEditing ? (
                          <div className="space-y-3">
                            <div>Profile Information</div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">Name:</label>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">Email:</label>
                              <input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">Mobile:</label>
                              <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Enter phone number"
                              />
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={handleEditProfile}
                                className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <div>Profile Information</div>
                            <div className="text-gray-700">Name: <span className="text-gray-600">{profile?.name || '-'}</span></div>
                            <div className="text-gray-700">Email: <span className="text-gray-600">{profile?.email || '-'}</span></div>
                            <div className="text-gray-700">Mobile: <span className="text-gray-600">{profile?.phone || '-'}</span></div>
                          </div>
                        )}
                        {!isEditing && (
                          <div className="mt-4">
                            <button 
                              onClick={() => setIsEditing(true)}
                              className="text-black hover:opacity-70"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-lg font-medium mb-4">My Address Book</div>
                        {profileLoading ? (
                          <div className="text-sm text-gray-600">Loading...</div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <div>Address Information</div>
                            {profile?.addresses && profile.addresses.length > 0 ? (
                              profile.addresses.map((addr: any) => (
                                <div key={addr.id} className="space-y-2">
                                  <div className="text-gray-700">Name: <span className="text-gray-600">{addr.fullName} {addr.isDefault ? '(Default)' : ''}</span></div>
                                  <div className="text-gray-700">Address: <span className="text-gray-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</span></div>
                                  <div className="text-gray-700">City: <span className="text-gray-600">{addr.city}, {addr.state} {addr.postalCode}, {addr.country}</span></div>
                                  <div className="text-gray-700">Phone: <span className="text-gray-600">{addr.phone}</span></div>
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-700">No Active Address</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'addresses' && (
                    <div>
                      <div className="text-xl font-medium mb-4">Addresses</div>
                      {profileLoading ? (
                        <div className="text-gray-700">Loading...</div>
                      ) : (
                        <div className="text-gray-700 space-y-4">
                          {profile?.addresses && profile.addresses.length > 0 ? (
                            profile.addresses.map((addr: any) => (
                              <div key={addr.id} className="border border-gray-200 p-4 bg-white">
                                {editingAddressId === addr.id ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-sm text-gray-700 mb-1">Full Name:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.fullName}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, fullName: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm text-gray-700 mb-1">Phone:</label>
                                        <input
                                          type="tel"
                                          value={addressEditForm.phone}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, phone: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                      <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-700 mb-1">Address Line 1:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.line1}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, line1: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                      <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-700 mb-1">Address Line 2:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.line2}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, line2: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm text-gray-700 mb-1">City:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.city}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, city: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm text-gray-700 mb-1">State:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.state}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, state: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm text-gray-700 mb-1">Postal Code:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.postalCode}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, postalCode: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm text-gray-700 mb-1">Country:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.country}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, country: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                      <button
                                        onClick={handleUpdateAddress}
                                        className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={handleCancelAddressEdit}
                                        className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="font-medium mb-2">{addr.fullName} {addr.isDefault ? '(Default)' : ''}</div>
                                    <div className="text-sm text-gray-600 mb-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</div>
                                    <div className="text-sm text-gray-600 mb-1">{addr.city}, {addr.state} {addr.postalCode}, {addr.country}</div>
                                    <div className="text-sm text-gray-600 mb-2">Phone: {addr.phone}</div>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleEditAddress(addr)}
                                        className="text-sm text-blue-600 hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        className="text-sm text-red-600 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div>No Active Address</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium">Order History</h2>
                      </div>

                      {loading ? (
                        <p>Loading orders...</p>
                      ) : orders.length === 0 ? (
                        <p className="text-gray-600">No orders found.</p>
                      ) : (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <div key={order._id} className="border border-gray-200 p-4 bg-white">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-600">Order ID: {order._id}</div>
                                <div className="text-sm text-gray-600">{new Date(order.date).toLocaleString()}</div>
                              </div>
                              <div className="text-sm mb-2">Status: <span className="font-medium">{order.status}</span></div>
                              <div className="text-sm mb-4">Amount: <span className="font-medium">₹{order.amount}</span></div>
                              <div className="space-y-2">
                                {order.items?.map((it, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                      {it.image ? (
                                        <img src={it.image} alt={it.name || it.productId} className="w-10 h-10 object-cover" />
                                      ) : null}
                                      <div>
                                        <div className="font-medium">{it.name || it.productId}</div>
                                        <div className="text-gray-600">Size: {it.size || '-'} &nbsp; Color: {it.color || '-'}</div>
                                      </div>
                                    </div>
                                    <div className="text-gray-800">Qty: {it.quantity}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;


