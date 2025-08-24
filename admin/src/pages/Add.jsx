import React, { useState, useEffect } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Signature Collection");
  const [subCategory, setSubCategory] = useState("Bridal");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [colorVariants, setColorVariants] = useState([
    {
      color: "Black",
      price: "",
      stock: "",
      sizes: [],
      video: null, // Video for this color variant
      images: {
        image1: false,
        image2: false,
        image3: false,
        image4: false
      }
    }
  ]);

  const addColorVariant = () => {
    setColorVariants(prev => [...prev, {
      color: "",
      price: "",
      stock: "",
      sizes: [],
      video: null, // Video for this color variant
      images: {
        image1: false,
        image2: false,
        image3: false,
        image4: false
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
      setSubCategories(['Bridal', 'Lehenga', 'Saree', 'Anarkali', 'Gown', 'Kurta', 'Palazzo', 'Dress', 'Top', 'Bottom', 'Jewelry', 'Bags', 'Shoes']);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

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
        setColorVariants([{
          color: "Black",
          price: "",
          stock: "",
          sizes: [],
          video: null, // Reset video
          images: {
            image1: false,
            image2: false,
            image3: false,
            image4: false
          }
        }])
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-6'>
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required/>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat} Collection
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
            {subCategories.map((subCat, index) => (
              <option key={index} value={subCat}>
                {subCat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Color Variants Section */}
      <div className='w-full'>
        <div className='flex justify-between items-center mb-4'>
          <p className='text-lg font-semibold'>Color Variants</p>
          <button 
            type="button" 
            onClick={addColorVariant}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Add Color Variant
          </button>
        </div>

        {colorVariants.map((variant, variantIndex) => (
          <div key={variantIndex} className='border p-4 rounded-lg mb-4'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='font-medium'>Color Variant {variantIndex + 1}</h3>
              {colorVariants.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeColorVariant(variantIndex)}
                  className='bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600'
                >
                  Remove
                </button>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='mb-2'>Color Name</p>
                <input 
                  onChange={(e) => updateColorVariant(variantIndex, 'color', e.target.value)} 
                  value={variant.color} 
                  className='w-full px-3 py-2 border rounded' 
                  type="text" 
                  placeholder='e.g., Black, Red, Blue' 
                  required
                />
              </div>

              <div>
                <p className='mb-2'>Price</p>
                <input 
                  onChange={(e) => updateColorVariant(variantIndex, 'price', e.target.value)} 
                  value={variant.price} 
                  className='w-full px-3 py-2 border rounded' 
                  type="number" 
                  placeholder='25' 
                  required
                />
              </div>

              <div>
                <p className='mb-2'>Stock</p>
                <input 
                  onChange={(e) => updateColorVariant(variantIndex, 'stock', e.target.value)} 
                  value={variant.stock} 
                  className='w-full px-3 py-2 border rounded' 
                  type="number" 
                  placeholder='100' 
                />
              </div>

              <div>
                <p className='mb-2'>Product Sizes</p>
                <div className='flex gap-2 flex-wrap'>
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <div 
                      key={size}
                      onClick={() => updateColorVariantSizes(variantIndex, size)}
                      className={`${variant.sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer rounded`}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <p className='mb-2'>Upload Images for {variant.color}</p>
              <div className='flex gap-2'>
                {[1, 2, 3, 4].map((imageNum) => (
                  <label key={imageNum} htmlFor={`image_${variantIndex}_${imageNum}`}>
                    <img 
                      className='w-20 h-20 object-cover border rounded' 
                      src={!variant.images[`image${imageNum}`] ? assets.upload_area : URL.createObjectURL(variant.images[`image${imageNum}`])} 
                      alt="" 
                    />
                    <input 
                      onChange={(e) => updateColorVariantImage(variantIndex, imageNum, e.target.files[0])} 
                      type="file" 
                      id={`image_${variantIndex}_${imageNum}`} 
                      hidden
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Color Variant Video Upload Section */}
            <div className='mt-4'>
              <p className='mb-2'>Upload Video for {variant.color} (Optional)</p>
              <div className='flex gap-2 items-center'>
                <label htmlFor={`video_${variantIndex}`} className='cursor-pointer'>
                  <div className='w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors'>
                    {variant.video ? (
                      <div className='text-center'>
                        <div className='text-green-500 text-4xl mb-2'>✓</div>
                        <p className='text-sm text-gray-600'>Video Selected</p>
                        <p className='text-xs text-gray-500 truncate max-w-24'>{variant.video.name}</p>
                      </div>
                    ) : (
                      <div className='text-center'>
                        <div className='text-gray-400 text-4xl mb-2'>🎥</div>
                        <p className='text-sm text-gray-600'>Upload Video</p>
                        <p className='text-xs text-gray-500'>MP4, WebM, MOV</p>
                      </div>
                    )}
                  </div>
                </label>
                <input
                  id={`video_${variantIndex}`}
                  type="file"
                  accept="video/*"
                  onChange={(e) => updateColorVariantVideo(variantIndex, e.target.files[0])}
                  className='hidden'
                />
                {variant.video && (
                  <button
                    type="button"
                    onClick={() => updateColorVariantVideo(variantIndex, null)}
                    className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm'
                  >
                    Remove Video
                  </button>
                )}
              </div>
              
              {/* Video Preview for Color Variant */}
              {variant.video && (
                <div className='mt-3'>
                  <p className='text-sm text-gray-600 mb-2'>Video Preview:</p>
                  <video 
                    className='max-w-md rounded-lg border' 
                    controls
                    preload="metadata"
                  >
                    <source src={URL.createObjectURL(variant.video)} type={variant.video.type} />
                    Your browser does not support the video tag.
                  </video>
                  <p className='text-xs text-gray-500 mt-1'>
                    File: {variant.video.name} | Size: {(variant.video.size / (1024 * 1024)).toFixed(2)} MB | Type: {variant.video.type}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add