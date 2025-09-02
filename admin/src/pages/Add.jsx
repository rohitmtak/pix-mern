import React, { useState, useEffect } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Signature Collection");
  const [subCategory, setSubCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [colorVariants, setColorVariants] = useState([
    {
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
    }
  ]);

  const addColorVariant = () => {
    setColorVariants(prev => [...prev, {
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
    }]);
  };

  const removeColorVariant = (index) => {
    setColorVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateColorVariant = (index, field, value) => {
    setColorVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  const updateColorVariantImage = (variantIndex, imageIndex, file) => {
    setColorVariants(prev => prev.map((variant, i) => 
      i === variantIndex ? {
        ...variant,
        images: {
          ...variant.images,
          [`image${imageIndex}`]: file
        }
      } : variant
    ));
  };

  const getImagePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

  const getVideoPreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

  const updateColorVariantSizes = (variantIndex, size) => {
    setColorVariants(prev => prev.map((variant, i) => 
      i === variantIndex ? {
        ...variant,
        sizes: variant.sizes.includes(size) 
          ? variant.sizes.filter(s => s !== size)
          : [...variant.sizes, size]
      } : variant
    ));
  };

  const updateColorVariantVideo = (variantIndex, videoFile) => {
    setColorVariants(prev => prev.map((variant, i) => 
      i === variantIndex ? {
        ...variant,
        video: videoFile
      } : variant
    ));
  };

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
      setSubCategories(['Bridal', 'Lehenga', 'Saree', 'Anarkali']);
    }
  };

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

  // Cleanup object URLs when component unmounts or colorVariants change
  useEffect(() => {
    const urls = [];
    colorVariants.forEach(variant => {
      Object.values(variant.images).forEach(image => {
        if (image && typeof image === 'object') {
          urls.push(URL.createObjectURL(image));
        }
      });
      // Add video URLs to cleanup
      if (variant.video && typeof variant.video === 'object') {
        urls.push(URL.createObjectURL(variant.video));
      }
    });

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [colorVariants]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate color variants
      if (colorVariants.length === 0) {
        toast.error("At least one color variant is required");
        return;
      }

      for (let variant of colorVariants) {
        if (!variant.color || !variant.price || variant.sizes.length === 0) {
          toast.error("All color variants must have color, price, and sizes");
          return;
        }
        if (variant.images.image1 === false) {
          toast.error("Each color variant must have at least one image");
          return;
        }
      }

      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("colorVariants", JSON.stringify(colorVariants))

      // Append images and videos for each color variant
      colorVariants.forEach((variant, variantIndex) => {
        Object.keys(variant.images).forEach(imageKey => {
          if (variant.images[imageKey]) {
            formData.append(`image_${variant.color}_${imageKey.slice(-1)}`, variant.images[imageKey])
          }
        });
        
        // Append video for this variant if it exists
        if (variant.video) {
          formData.append(`video_${variant.color}`, variant.video)
        }
      });

      const response = await axios.post(backendUrl + "/api/product/add", formData, {headers: {token}})

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setSubCategory('')
        setColorVariants([{
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
        }])
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-jost text-3xl font-light text-gray-800 mb-2">Add New Product</h1>
        <p className="text-gray-600">Create a new product listing with multiple color variants</p>
      </div>

      <form onSubmit={onSubmitHandler} className='space-y-8'>
        {/* Basic Product Information */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="font-jost text-xl font-medium text-gray-800 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input 
                onChange={(e)=>setName(e.target.value)} 
                value={name} 
                className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all' 
                type="text" 
                placeholder='Enter product name' 
                required
                disabled={loading}
              />
            </div>

                         <div className="relative dropdown-container">
               <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
               <div 
                 onClick={() => !loading && setShowCategoryDropdown(!showCategoryDropdown)}
                 className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all cursor-pointer bg-white flex justify-between items-center'
               >
                 <span className={category ? 'text-gray-900' : 'text-gray-500'}>{category || 'Select category'}</span>
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
                         setCategory(cat);
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
                 onClick={() => !loading && setShowSubCategoryDropdown(!showSubCategoryDropdown)}
                 className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all cursor-pointer bg-white flex justify-between items-center'
               >
                 <span className={subCategory ? 'text-gray-900' : 'text-gray-500'}>{subCategory || 'Select sub category (optional)'}</span>
                 <svg className={`w-5 h-5 text-gray-400 transition-transform ${showSubCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
               
               {showSubCategoryDropdown && (
                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                   <div
                     onClick={() => {
                       setSubCategory("");
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
                         setSubCategory(subCat);
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
                onChange={() => setBestseller(prev => !prev)} 
                checked={bestseller} 
                type="checkbox" 
                id='bestseller' 
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                disabled={loading}
              />
              <label className='text-sm font-medium text-gray-700 cursor-pointer' htmlFor="bestseller">
                Add to bestseller collection
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
            <textarea 
              onChange={(e)=>setDescription(e.target.value)} 
              value={description} 
              className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all min-h-[120px]' 
              placeholder='Write detailed product description here...' 
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Color Variants Section */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <div className='flex justify-between items-center mb-6'>
            <h2 className="font-jost text-xl font-medium text-gray-800">Color Variants</h2>
            <button 
              type="button" 
              onClick={addColorVariant}
              className='bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors duration-200 rounded-lg'
              disabled={loading}
            >
              + Add Variant
            </button>
          </div>

          <div className="space-y-6">
            {colorVariants.map((variant, variantIndex) => (
              <div key={variantIndex} className='border border-gray-200 p-6 rounded-lg bg-gray-100'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-medium text-gray-800 text-lg'>Color Variant {variantIndex + 1}</h3>
                  {colorVariants.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeColorVariant(variantIndex)}
                      className='bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors'
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Name *</label>
                    <input 
                      onChange={(e) => updateColorVariant(variantIndex, 'color', e.target.value)} 
                      value={variant.color} 
                      className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all' 
                      type="text" 
                      placeholder='e.g., Black, Red, Blue' 
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                    <input 
                      onChange={(e) => updateColorVariant(variantIndex, 'price', e.target.value)} 
                      value={variant.price} 
                      className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all' 
                      type="number" 
                      placeholder='2500' 
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <input 
                      onChange={(e) => updateColorVariant(variantIndex, 'stock', e.target.value)} 
                      value={variant.stock} 
                      className='w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg transition-all' 
                      type="number" 
                      placeholder='100' 
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes *</label>
                    <div className='flex gap-2 flex-wrap'>
                      {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updateColorVariantSizes(variantIndex, size)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            variant.sizes.includes(size) 
                              ? "bg-black text-white shadow-md" 
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                          }`}
                          disabled={loading}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                                 <div className='mb-6'>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Images {variant.color ? `for ${variant.color}` : ''} *</label>
                                     <div className='flex gap-3 flex-wrap'>
                     {[1, 2, 3, 4, 5].map((imageNum) => (
                      <label key={imageNum} htmlFor={`image_${variantIndex}_${imageNum}`} className="cursor-pointer">
                        <div className="w-20 h-20 border border-gray-300 rounded flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden relative">
                          {variant.images[`image${imageNum}`] ? (
                            <img 
                              src={getImagePreview(variant.images[`image${imageNum}`])} 
                              alt={`Image ${imageNum}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <div className="text-gray-400 text-xs mb-1">+</div>
                              <div className="text-gray-500 text-xs">Image {imageNum}</div>
                            </>
                          )}
                        </div>
                        <input 
                          onChange={(e) => updateColorVariantImage(variantIndex, imageNum, e.target.files[0])} 
                          type="file" 
                          id={`image_${variantIndex}_${imageNum}`} 
                          className="hidden"
                          accept="image/*"
                          disabled={loading}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                                 {/* Video Upload */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Video (Optional)</label>
                   <div className='flex items-center gap-3'>
                     <label htmlFor={`video_${variantIndex}`} className='cursor-pointer'>
                       <div className='w-20 h-20 border border-gray-300 rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden relative'>
                         {variant.video ? (
                           <video 
                             src={getVideoPreview(variant.video)} 
                             className="w-full h-full object-cover"
                             muted
                             loop
                             onMouseEnter={(e) => e.target.play()}
                             onMouseLeave={(e) => e.target.pause()}
                           />
                         ) : (
                           <div className="text-gray-400 text-xs">🎥</div>
                         )}
                       </div>
                     </label>
                     <input
                       id={`video_${variantIndex}`}
                       type="file"
                       accept="video/*"
                       onChange={(e) => updateColorVariantVideo(variantIndex, e.target.files[0])}
                       className='hidden'
                       disabled={loading}
                     />
                     {variant.video && (
                       <div className="text-xs text-gray-600">
                         {variant.video.name}
                       </div>
                     )}
                     {variant.video && (
                       <button
                         type="button"
                         onClick={() => updateColorVariantVideo(variantIndex, null)}
                         className='text-red-500 text-xs hover:text-red-700'
                         disabled={loading}
                       >
                         Remove
                       </button>
                     )}
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className={`bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors duration-200 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add