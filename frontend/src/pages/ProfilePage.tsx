import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import apiClient from "@/utils/apiClient";
import axios from "axios";
import { showToast, toastMessages } from "@/config/toastConfig";
import { config } from "@/config/env";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getStateName, getCountryName } from "@/utils/addressUtils";
import { formatOrderPrice } from '@/utils/priceUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logout } from "@/utils/auth";

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
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('account');
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<{ name: string; email: string; phone?: string; addresses?: any[] } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<{ name: string; phone: string }>({ name: '', phone: '' });
  const [phoneError, setPhoneError] = useState<string>('');
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
    country: 'India'
  });
  const [addressPhoneError, setAddressPhoneError] = useState<string>('');
  const [postalCodeError, setPostalCodeError] = useState<string>('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    // Only redirect if authentication check is complete and user is not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Only fetch data if user is authenticated and not loading
    if (!authLoading && isAuthenticated) {
      const fetchData = async () => {
        // Only make API calls if user is authenticated
        const fetchOrders = async () => {
        try {
          const res = await apiClient.post(`${config.api.baseUrl}/order/userorders`, {});
          
          if (res.data?.success && Array.isArray(res.data?.orders)) {
            setOrders(res.data.orders);
          } else if (res.data?.success && Array.isArray(res.data?.data)) {
            // Handle both 'orders' and 'data' response formats for backward compatibility
            setOrders(res.data.data);
          } else if (Array.isArray(res.data)) {
            // In case API returns array directly
            setOrders(res.data as OrderItem[]);
          } else {
            showToast.error(res.data?.message || toastMessages.profile.ordersLoadFailed);
          }
        } catch (err: any) {
          // Error handling is now done by the axios interceptor
          console.error('Failed to load orders:', err);
          if (!err.response || err.response.status !== 401) {
            showToast.error(toastMessages.profile.ordersLoadFailed);
          }
        } finally {
          setLoading(false);
        }
      };

      const fetchProfile = async () => {
        try {
          const res = await apiClient.get(`${config.api.baseUrl}/user/me`);
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
        } catch (err: any) {
          // Error handling is now done by the axios interceptor
          console.error('Failed to load profile', err);
          if (!err.response || err.response.status !== 401) {
            // Only show error if it's not an auth error (which is handled by interceptor)
            console.error('Profile loading failed:', err);
          }
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

      // Execute all API calls
      await Promise.all([
        fetchOrders(),
        fetchProfile(),
        loadCart()
      ]);
    };

      fetchData();
    }
  }, [authLoading, isAuthenticated, navigate, loadUserCartFromBackend]);

  // Update edit form when profile changes
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    await logout(); // Now async function
    clearCart(); // Clear cart state and localStorage
    // Refresh authentication state after logout
    await checkAuth();
    showToast.success(toastMessages.profile.loggedOut);
    navigate('/');
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+91\d{10}|\d{10})$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid phone number. It should be 10 digits long or include the +91 country code.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePostalCode = (postalCode: string): boolean => {
    const postalCodeRegex = /^\d{6}$/;
    if (!postalCode) {
      setPostalCodeError('Postal code is required');
      return false;
    }
    if (!postalCodeRegex.test(postalCode)) {
      setPostalCodeError('Please enter a valid 6-digit postal code');
      return false;
    }
    setPostalCodeError('');
    return true;
  };

  const handleEditProfile = async () => {
    if (!validatePhone(editForm.phone)) {
      return;
    }
    
    try {
      const res = await axios.put(`${config.api.baseUrl}/user/me`, editForm, { withCredentials: true });
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
      country: address.country || 'India'
    });
  };

  const handleUpdateAddress = async () => {
    if (!editingAddressId) return;
    
    if (!validatePhone(addressEditForm.phone)) {
      setAddressPhoneError('Please enter a valid phone number. It should be 10 digits long or include the +91 country code.');
      return;
    }
    
    if (!validatePostalCode(addressEditForm.postalCode)) {
      return;
    }
    
    try {
      const res = await axios.put(
        `${config.api.baseUrl}/user/addresses/${editingAddressId}`,
        { address: addressEditForm },
        { withCredentials: true }
      );
      if (res.data?.success) {
        // Sort addresses: default first, then others
        const sortedAddresses = res.data.addresses.sort((a: any, b: any) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return 0;
        });
        
        setProfile(prev => ({
          ...prev!,
          addresses: sortedAddresses
        }));
        setEditingAddressId(null);
        setAddressPhoneError('');
        setPostalCodeError('');
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
        { withCredentials: true }
      );
      if (res.data?.success) {
        // Sort addresses: default first, then others
        const sortedAddresses = res.data.addresses.sort((a: any, b: any) => {
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
      country: 'India'
    });
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const res = await axios.put(
        `${config.api.baseUrl}/user/addresses/${addressId}`,
        { address: { isDefault: true } },
        { withCredentials: true }
      );
      if (res.data?.success) {
        // Sort addresses: default first, then others
        const sortedAddresses = res.data.addresses.sort((a: any, b: any) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return 0;
        });
        
        setProfile(prev => ({
          ...prev!,
          addresses: sortedAddresses
        }));
        showToast.success('Default address updated successfully');
      } else {
        showToast.error(res.data?.message || 'Failed to update default address');
      }
    } catch (err) {
      showToast.error('Failed to update default address');
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <section className="px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
          <div className="max-w-screen-2xl mx-auto">
            {/* Welcome */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-jost uppercase tracking-widest">
                Welcome, {profileLoading ? '...' : (profile?.name ? profile.name.split(' ')[0] : 'User')}
              </h1>
            </div>

            <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
              {/* Sidebar */}
              <aside className="col-span-12 md:col-span-3">
                <div className="border border-gray-200">
                  <button
                    className={`w-full text-left px-4 sm:px-6 py-4 sm:py-5 uppercase text-xs sm:text-sm tracking-wide ${activeTab === 'account' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('account')}
                  >
                    My Account
                  </button>
                  <div className="border-t border-gray-200" />
                  <button
                    className={`w-full text-left px-4 sm:px-6 py-4 sm:py-5 uppercase text-xs sm:text-sm tracking-wide ${activeTab === 'addresses' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('addresses')}
                  >
                    Addresses
                  </button>
                  <div className="border-t border-gray-200" />
                  <button
                    className={`w-full text-left px-4 sm:px-6 py-4 sm:py-5 uppercase text-xs sm:text-sm tracking-wide ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    My Orders
                  </button>
                  <div className="border-t border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 uppercase text-xs sm:text-sm tracking-wide bg-white text-black hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </aside>

              {/* Content */}
              <section className="col-span-12 md:col-span-9">
                <div className="border border-gray-200 p-4 sm:p-6 lg:p-8 bg-[#f2f2f2]">
                  {activeTab === 'account' && (
                    <div className="space-y-4">
                      <div className="text-lg sm:text-xl font-medium mb-4">My Account</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* My Profile Card */}
                        <div className="border border-gray-200 p-4 bg-white">
                          <div className="text-base sm:text-lg font-medium mb-4">My Profile</div>
                          {profileLoading ? (
                            <div className="text-xs sm:text-sm text-gray-600">Loading profile...</div>
                          ) : isEditing ? (
                            <div className="space-y-3">
                              <div className="text-sm sm:text-base">Profile Information</div>
                              <div>
                                <label className="block text-xs sm:text-sm text-gray-700 mb-1">Name:</label>
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs sm:text-sm text-gray-700 mb-1">Email:</label>
                                <input
                                  type="email"
                                  value={profile?.email || ''}
                                  disabled
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="block text-xs sm:text-sm text-gray-700 mb-1">Mobile:</label>
                                <input
                                  type="tel"
                                  value={editForm.phone}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9+]/g, ''); // Only allow digits and +
                                    if (value.length <= 13) { // +91 + 10 digits = 13 max
                                      setEditForm({ ...editForm, phone: value });
                                      setPhoneError(''); // Clear error when user types
                                    }
                                  }}
                                  className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                                  placeholder="Enter phone number (10 digits or +91XXXXXXXXXX)"
                                />
                                {phoneError && (
                                  <p className="text-xs sm:text-sm text-red-600 mt-1">{phoneError}</p>
                                )}
                              </div>
                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={handleEditProfile}
                                  className="px-4 py-2 bg-black text-white text-xs sm:text-sm hover:bg-gray-800"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 border border-gray-300 text-xs sm:text-sm hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2 text-xs sm:text-sm">
                              <div className="text-sm sm:text-base">Profile Information</div>
                              <div className="text-gray-700">Name: <span className="text-gray-600">{profile?.name || '-'}</span></div>
                              <div className="text-gray-700">Email: <span className="text-gray-600">{profile?.email || '-'}</span></div>
                              <div className="text-gray-700">Mobile: <span className="text-gray-600">{profile?.phone || '-'}</span></div>
                            </div>
                          )}
                          {!isEditing && (
                            <div className="mt-4">
                              <button 
                                onClick={() => setIsEditing(true)}
                                className="text-black hover:opacity-70 text-xs sm:text-sm"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>

                        {/* My Address Book Card */}
                        <div className="border border-gray-200 p-4 bg-white">
                          <div className="text-base sm:text-lg font-medium mb-4">My Address Book</div>
                          {profileLoading ? (
                            <div className="text-xs sm:text-sm text-gray-600">Loading...</div>
                          ) : (
                            <div className="space-y-2 text-xs sm:text-sm">
                              <div className="text-sm sm:text-base">Address Information</div>
                              {profile?.addresses && profile.addresses.length > 0 ? (
                                (() => {
                                  const defaultAddress = profile.addresses.find((addr: any) => addr.isDefault);
                                  if (defaultAddress) {
                                    return (
                                      <div className="space-y-2">
                                        <div className="text-gray-700">Name: <span className="text-gray-600">{defaultAddress.fullName} (Default)</span></div>
                                        <div className="text-gray-700">Address: <span className="text-gray-600">{defaultAddress.line1}{defaultAddress.line2 ? `, ${defaultAddress.line2}` : ''}</span></div>
                                        <div className="text-gray-700">City: <span className="text-gray-600">{defaultAddress.city}, {getStateName(defaultAddress.state)} {defaultAddress.postalCode}, {getCountryName(defaultAddress.country)}</span></div>
                                        <div className="text-gray-700">Phone: <span className="text-gray-600">{defaultAddress.phone}</span></div>
                                      </div>
                                    );
                                  } else {
                                    return <div className="text-gray-700">No Default Address Set</div>;
                                  }
                                })()
                              ) : (
                                <div className="text-gray-700">No Active Address</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'addresses' && (
                    <div>
                      <div className="text-lg sm:text-xl font-medium mb-4">Addresses</div>
                      {profileLoading ? (
                        <div className="text-gray-700 text-xs sm:text-sm">Loading...</div>
                      ) : (
                        <div className="text-gray-700 space-y-4">
                          {profile?.addresses && profile.addresses.length > 0 ? (
                            profile.addresses.map((addr: any) => (
                              <div key={addr.id} className="border border-gray-200 p-4 bg-white">
                                {editingAddressId === addr.id ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">Full Name:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.fullName}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, fullName: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">Phone:</label>
                                        <input
                                          type="tel"
                                          value={addressEditForm.phone}
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9+]/g, ''); // Only allow digits and +
                                            if (value.length <= 13) { // +91 + 10 digits = 13 max
                                              setAddressEditForm({ ...addressEditForm, phone: value });
                                              setAddressPhoneError(''); // Clear error when user types
                                            }
                                          }}
                                          className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm ${addressPhoneError ? 'border-red-500' : 'border-gray-300'}`}
                                          placeholder="Enter phone number (10 digits or +91XXXXXXXXXX)"
                                        />
                                        {addressPhoneError && (
                                          <p className="text-xs sm:text-sm text-red-600 mt-1">{addressPhoneError}</p>
                                        )}
                                      </div>
                                      <div className="md:col-span-2">
                                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">Address Line 1:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.line1}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, line1: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                                        />
                                      </div>
                                      <div className="md:col-span-2">
                                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">Address Line 2:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.line2}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, line2: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">City:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.city}
                                          onChange={(e) => setAddressEditForm({ ...addressEditForm, city: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">State:</label>
                                        <Select 
                                          value={addressEditForm.state} 
                                          onValueChange={(value) => setAddressEditForm({ ...addressEditForm, state: getStateName(value) })}
                                        >
                                          <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm">
                                            <SelectValue placeholder="Select state" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="DL">Delhi</SelectItem>
                                            <SelectItem value="MH">Maharashtra</SelectItem>
                                            <SelectItem value="KA">Karnataka</SelectItem>
                                            <SelectItem value="TN">Tamil Nadu</SelectItem>
                                            <SelectItem value="WB">West Bengal</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">Postal Code:</label>
                                        <input
                                          type="text"
                                          value={addressEditForm.postalCode}
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
                                            if (value.length <= 6) { // Max 6 digits
                                              setAddressEditForm({ ...addressEditForm, postalCode: value });
                                              setPostalCodeError(''); // Clear error when user types
                                            }
                                          }}
                                          className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm ${postalCodeError ? 'border-red-500' : 'border-gray-300'}`}
                                          placeholder="Enter 6-digit postal code"
                                        />
                                        {postalCodeError && (
                                          <p className="text-xs sm:text-sm text-red-600 mt-1">{postalCodeError}</p>
                                        )}
                                      </div>
                                      <div>
                                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">Country:</label>
                                        <Select 
                                          value={addressEditForm.country} 
                                          onValueChange={(value) => setAddressEditForm({ ...addressEditForm, country: getCountryName(value) })}
                                        >
                                          <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm">
                                            <SelectValue placeholder="Select country" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="IN">India</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                      <button
                                        onClick={handleUpdateAddress}
                                        className="px-4 py-2 bg-black text-white text-xs sm:text-sm hover:bg-gray-800"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={handleCancelAddressEdit}
                                        className="px-4 py-2 border border-gray-300 text-xs sm:text-sm hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="font-medium mb-2 text-sm sm:text-base">{addr.fullName} {addr.isDefault ? '(Default)' : ''}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 mb-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 mb-1">{addr.city}, {getStateName(addr.state)} {addr.postalCode}, {getCountryName(addr.country)}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 mb-2">Phone: {addr.phone}</div>
                                    <div className="flex gap-2 flex-wrap">
                                      <button 
                                        onClick={() => handleEditAddress(addr)}
                                        className="text-xs sm:text-sm text-blue-600 hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        className="text-xs sm:text-sm text-red-600 hover:underline"
                                      >
                                        Delete
                                      </button>
                                      {!addr.isDefault && (
                                        <button 
                                          onClick={() => handleSetDefaultAddress(addr.id)}
                                          className="text-xs sm:text-sm text-green-600 hover:underline"
                                        >
                                          Set as Default
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-xs sm:text-sm">No Active Address</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg sm:text-xl font-medium">Order History</h2>
                      </div>

                      {loading ? (
                        <p className="text-xs sm:text-sm">Loading orders...</p>
                      ) : orders.length === 0 ? (
                        <p className="text-gray-600 text-xs sm:text-sm">No orders found.</p>
                      ) : (
                        <div className="space-y-4 sm:space-y-6">
                          {orders.map((order) => (
                            <div key={order._id} className="border border-gray-200 p-4 bg-white">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs sm:text-sm text-gray-600">Order #{order._id.slice(0, 8)}</div>
                                <div className="text-xs sm:text-sm text-gray-600">{new Date(order.date).toLocaleString()}</div>
                              </div>
                              <div className="text-xs sm:text-sm mb-2">Status: <span className="font-medium">{order.status}</span></div>
                              <div className="text-xs sm:text-sm mb-4">Amount: <span className="font-medium">{formatOrderPrice(order.amount)}</span></div>
                              <div className="space-y-2">
                                {order.items?.map((it, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      {it.image ? (
                                        <img src={it.image} alt={it.name || it.productId} className="w-8 h-8 sm:w-10 sm:h-10 object-cover" />
                                      ) : null}
                                      <div>
                                        <div className="font-medium text-xs sm:text-sm">{it.name || it.productId}</div>
                                        <div className="text-gray-600 text-xs sm:text-sm">Size: {it.size || '-'} &nbsp; Color: {it.color || '-'}</div>
                                      </div>
                                    </div>
                                    <div className="text-gray-800 text-xs sm:text-sm">Qty: {it.quantity}</div>
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


