import { Bell, CircleUser } from 'lucide-react'
import Image from 'next/image'
import React from 'react'


function Header() {
  return (
    <header className='bg-[#1e1e1e] shadow-lg border-b border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg'>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 flex justify-between items-center'>
        <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100'>Dashboard</h1>
        <div className='flex items-center space-x-3 sm:space-x-6'>
          <Image
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ea-1f1ec.svg"
            alt="Egypt Flag"
            width={25}
            height={18}
            className='shadow-md cursor-pointer'
          />
          <Bell className='w-5 sm:w-6 h-5 sm:h-6 text-gray-300 cursor-pointer hover:text-white'/>
          <div className='flex items-center space-x-2 sm:space-x-3'>
            <CircleUser className='w-8 h-8 text-gray-300 hover:text-white'/>
            <span className='hidden sm:block text-gray-100 font-medium'>Mohamed Haytham</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header