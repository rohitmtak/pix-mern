import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      console.log('Fetching products from:', backendUrl + '/api/product/list')
      const response = await axios.get(backendUrl + '/api/product/list')
      console.log('API Response:', response.data)
      
      if (response.data.success) {
        setList(response.data.data.reverse());
        console.log('Products set:', response.data.data)
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log('Error fetching products:', error)
      toast.error(error.message)
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
      console.log(error)
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
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Variants</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {list.length === 0 ? (
          <div className='text-center py-4 text-gray-500'>
            No products found. Loading...
          </div>
        ) : (
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12 h-12 object-cover' src={getProductImage(item)} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{getProductPrice(item)}</p>
              <div className='text-center'>
                {item.colorVariants && item.colorVariants.length > 0 ? (
                  <div className='text-xs'>
                    {item.colorVariants.map((variant, vIndex) => (
                      <div key={vIndex} className='mb-1'>
                        <span className={`px-2 py-1 rounded text-xs ${
                          variant.video ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {variant.color} {variant.video ? '🎥' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className='text-gray-400'>-</span>
                )}
              </div>
              <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        )}

      </div>
    </>
  )
}

export default List