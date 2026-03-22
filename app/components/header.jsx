'use client'
import { CircleUser, Settings, LogOut, UserRound } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import ThemeToggle from './ThemeMode'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '../features/authSlice'
import { useDispatch } from 'react-redux'
import apiSlice from '../api/apiSlice'
import Cookies from 'js-cookie'
import { useGetMeQuery } from '../features/userSlice'
import { MdOutlineArrowDropDown } from 'react-icons/md'

const countries = [
  { name: 'egypt', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ea-1f1ec.svg' },
  { name: 'saudi arabia', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f8-1f1e6.svg' },
  { name: 'uae', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e6-1f1ea.svg' },
  { name: 'qatar', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f6-1f1e6.svg' },
  { name: 'american', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1fa-1f1f8.svg' },
  { name: 'british', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ec-1f1e7.svg' },
  { name: 'yemen', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1fe-1f1ea.svg' },
  { name: 'syria', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f8-1f1fe.svg' },
  { name: 'lebanon', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f1-1f1e7.svg' },
  { name: 'jordan', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ef-1f1f4.svg' },
  { name: 'palestine', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f5-1f1f8.svg' },
  { name: 'iraq', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ee-1f1f6.svg' },
  { name: 'morocco', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f2-1f1e6.svg' },
  { name: 'algeria', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e9-1f1ff.svg' },
  { name: 'tunisia', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f9-1f1f3.svg' },
  { name: 'libya', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f1-1f1fe.svg' },
  { name: 'sudan', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f8-1f1e9.svg' },
  { name: 'somalia', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f8-1f1f4.svg' },
  { name: 'djibouti', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e9-1f1ef.svg' },
  { name: 'comoros', flag: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f0-1f1f2.svg' },
]

function Header() {
  const router = useRouter()
  const { data: meData } = useGetMeQuery()
  const fullName = meData.data.firstName + " " + meData.data.lastName
  const dispatch = useDispatch()
  const [logout] = useLogoutMutation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch (err) {
      console.log(err)
    } finally {
      Cookies.remove('accessToken')
      dispatch(apiSlice.util.resetApiState())
      setIsDropdownOpen(false)
      router.push('/');
    }
  }

  return (
    <header className='bg-primary shadow-lg border-b border-border-primary mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg'>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 flex justify-between items-center'>
        <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold text-text-secondary'>Dashboard</h1>
        <div className='flex items-center space-x-3 sm:space-x-6'>
          <ThemeToggle />
          <div className='flex items-center space-x-3 sm:space-x-4'>
            {
              countries.map((country) => (
                country.name === meData.data.country && (
                  <Image
                    key={country.name}
                    src={country.flag}
                    alt={country.name}
                    width={20}
                  height={20}
                  className='shadow-md cursor-pointer'
                />
                )
              ))
            }
            <div className='relative' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className='flex items-center space-x-2 sm:space-x-3 cursor-pointer'>
                <CircleUser className='w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-text-primary hover:text-text-theme transition-colors' />
                <span className='hidden sm:block text-text-secondary font-medium capitalize'>{fullName}</span>
                <MdOutlineArrowDropDown />
              </div>
              {isDropdownOpen && (
                <div className='absolute right-0 top-full mt-2 w-44 bg-primary border border-border-primary rounded-lg shadow-xl z-50 overflow-hidden'>
                  <Link href="/profile" className='w-full flex items-center space-x-3 px-4 py-3 text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors text-sm' onClick={() => setIsDropdownOpen(false)}>
                    <UserRound className='w-4 h-4' />
                    <span>My Profile</span>
                  </Link>
                  <div className='border-t border-border-primary' />
                  <Link href="/settings" className='w-full flex items-center space-x-3 px-4 py-3 text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors text-sm' onClick={() => setIsDropdownOpen(false)}>
                    <Settings className='w-4 h-4' />
                    <span>Settings</span>
                  </Link>
                  <div className='border-t border-border-primary' />
                  <button
                    className='w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-secondary hover:text-red-300 transition-colors text-sm'
                    onClick={handleLogout}
                  >
                    <LogOut className='w-4 h-4' />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header