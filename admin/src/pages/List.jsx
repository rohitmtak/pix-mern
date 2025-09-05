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
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    bestseller: false,
    colorVariants: []
  })
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showEditColorDropdowns, setShowEditColorDropdowns] = useState({});
  
  // Predefined color options for fashion items
  const colorOptions = [
    "Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple", 
    "Orange", "Brown", "Grey", "Navy", "Maroon", "Cream", "Gold", "Silver",
    "Beige", "Khaki", "Turquoise", "Magenta", "Coral", "Lavender", "Mint",
    "Burgundy", "Teal", "Ivory", "Charcoal", "Rose Gold", "Copper", "Bronze"
  ];
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);

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

  const openEditModal = (product) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      bestseller: product.bestseller || false,
      colorVariants: product.colorVariants ? product.colorVariants.map(variant => ({
        color: variant.color || "",
        price: variant.price || "",
        stock: variant.stock || "",
        sizes: variant.sizes || [],
        video: variant.video || null,
        images: variant.images || {
          image1: false,
          image2: false,
          image3: false,
          image4: false,
          image5: false
        }
      })) : []
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async () => {
    try {
      setLoading(true)
      
      // Prepare form data for multipart upload
      const formData = new FormData()
      formData.append('name', editForm.name)
      formData.append('description', editForm.description)
      formData.append('category', editForm.category)
      formData.append('subCategory', editForm.subCategory)
      formData.append('bestseller', editForm.bestseller)
      formData.append('colorVariants', JSON.stringify(editForm.colorVariants))

      const response = await axios.put(
        `${backendUrl}/api/product/update/${editingProduct._id}`, 
        formData, 
        { 
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          } 
        }
      )

      if (response.data.success) {
        toast.success('Product updated successfully!')
        setShowEditModal(false)
        setEditingProduct(null)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to update product: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const updateEditColorVariant = (index, field, value) => {
    setEditForm(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }))
  }

  const addEditColorVariant = () => {
    setEditForm(prev => ({
      ...prev,
      colorVariants: [...prev.colorVariants, {
        color: "",
        price: "",
        stock: "",
        sizes: [],
        video: null,
        images: {
          image1: false,
          image2: false,
          image3: false,
          image4: false,
          image5: false
        }
      }]
    }))
  }

  const removeEditColorVariant = (index) => {
    setEditForm(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== index)
    }))
  }

  // Fetch categories and subcategories from backend
  const fetchCategories = async () => {
    try {
      const [categoriesResponse, subcategoriesResponse] = await Promise.all([
        axios.get(backendUrl + '/api/product/categories'),
        axios.get(backendUrl + '/api/product/subcategories')
      ]);
      
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data);
      }
      
      if (subcategoriesResponse.data.success) {
        setSubCategories(subcategoriesResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set default categories if API fails
      setCategories(['Signature Collection', 'Bridal Couture', 'Contemporary Drapes', 'Luxury Fusion Lounge']);
      setSubCategories([]); // No subcategories defined yet
    }
  };

  // Update size selection for color variants
  const updateEditColorVariantSizes = (variantIndex, size) => {
    setEditForm(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map((variant, i) => 
        i === variantIndex ? {
          ...variant,
          sizes: variant.sizes.includes(size) 
            ? variant.sizes.filter(s => s !== size)
            : [...variant.sizes, size]
        } : variant
      )
    }))
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

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowCategoryDropdown(false);
        setShowSubCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                        title="Edit product"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">✏️ Edit Product: {editingProduct.name}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-jost text-base font-medium text-gray-800 mb-4">Basic Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => updateEditForm('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all bg-white"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="relative dropdown-container">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <div 
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all cursor-pointer bg-white flex justify-between items-center'
                      >
                        <span className={editForm.category ? 'text-gray-900' : 'text-gray-400'}>{editForm.category || 'Select category'}</span>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {showCategoryDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {categories.map((cat, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                updateEditForm('category', cat);
                                setShowCategoryDropdown(false);
                              }}
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              {cat}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative dropdown-container">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category (Optional)</label>
                      <div 
                        onClick={() => setShowSubCategoryDropdown(!showSubCategoryDropdown)}
                        className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all cursor-pointer bg-white flex justify-between items-center'
                      >
                        <span className={editForm.subCategory ? 'text-gray-900' : 'text-gray-400'}>{editForm.subCategory || 'Select sub category (optional)'}</span>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${showSubCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {showSubCategoryDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div
                            onClick={() => {
                              updateEditForm('subCategory', "");
                              setShowSubCategoryDropdown(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 text-gray-500"
                          >
                            None (Optional)
                          </div>
                          {subCategories.map((subCat, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                updateEditForm('subCategory', subCat);
                                setShowSubCategoryDropdown(false);
                              }}
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              {subCat}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="bestseller"
                        checked={editForm.bestseller}
                        onChange={(e) => updateEditForm('bestseller', e.target.checked)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <label htmlFor="bestseller" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Add to bestseller collection
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => updateEditForm('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all"
                      placeholder="Write detailed product description here..."
                    />
                  </div>
                </div>

                {/* Color Variants */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-jost text-base font-medium text-gray-800">Color Variants</h4>
                    <button
                      onClick={addEditColorVariant}
                      className="bg-black text-white px-3 py-1.5 text-sm hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                    >
                      + Add Variant
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editForm.colorVariants.map((variant, index) => (
                      <div key={index} className="border border-gray-200 p-4 rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium text-gray-900">Color Variant {index + 1}</h5>
                          {editForm.colorVariants.length > 1 && (
                            <button
                              onClick={() => removeEditColorVariant(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="relative dropdown-container">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color Name *</label>
                            <div 
                              onClick={() => setShowEditColorDropdowns(prev => ({...prev, [index]: !prev[index]}))}
                              className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all cursor-pointer bg-white flex justify-between items-center'
                            >
                              <span className={variant.color ? 'text-gray-900' : 'text-gray-400'}>{variant.color || 'Select color'}</span>
                              <svg className={`w-5 h-5 text-gray-400 transition-transform ${showEditColorDropdowns[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            
                            {showEditColorDropdowns[index] && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {colorOptions.map((color, colorIndex) => (
                                  <div
                                    key={colorIndex}
                                    onClick={() => {
                                      updateEditColorVariant(index, 'color', color);
                                      setShowEditColorDropdowns(prev => ({...prev, [index]: false}));
                                    }}
                                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    {color}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                                          <input
                                type="number"
                                value={variant.price}
                                onChange={(e) => updateEditColorVariant(index, 'price', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all bg-white"
                                placeholder="Enter price in ₹"
                              />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                                          <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => updateEditColorVariant(index, 'stock', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all bg-white"
                                placeholder="Enter stock quantity"
                              />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes *</label>
                            <div className="flex gap-1.5 flex-wrap">
                              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => updateEditColorVariantSizes(index, size)}
                                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                                    variant.sizes.includes(size) 
                                      ? "bg-black text-white shadow-md" 
                                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleEditSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

export default List