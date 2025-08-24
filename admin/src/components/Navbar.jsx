import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <h1 className='text-xl font-semibold text-gray-800'>Admin Panel</h1>
        <img className='w-20 h-12 object-contain' src={assets.logo} alt="PIX Logo" />
        <button onClick={()=>setToken('')} className='bg-black text-white px-5 py-2 sm:px-7 sm:py-2 text-xs sm:text-sm hover:bg-gray-800 transition-colors duration-200'>Logout</button>
    </div>
  )
}

export default Navbar