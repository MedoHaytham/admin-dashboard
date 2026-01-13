"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { House, DollarSign , Settings, ShoppingBag, ShoppingCart , Mail, Users, Bell, Info, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const sidebatItems = [
  {
    id: 1,
    icon: <House size={20} className='min-w-5'/>,
    name: 'Dashboard',
    path: '/',
  },
  {
    id: 2,
    icon: <ShoppingBag size={20} className='min-w-5'/>,
    name: 'Products',
    path: '/products',
  },
  {
    id: 3,
    icon: <Users size={20} className='min-w-5'/>,
    name: 'Clients',
    path: '/clients',
  },
  {
    id: 4,
    icon: <DollarSign size={20} className='min-w-5'/>,
    name: 'Sales',
    path: '/sales',
  },
  {
    id: 5,
    icon: <ShoppingCart size={20} className='min-w-5'/>,
    name: 'Orders',
    path: '/orders',
  },
  {
    id: 6,
    icon: <Settings size={20} className='min-w-5'/>,
    name: 'Settings',
    path: '/settings',
  },
  {
    id: 7,
    icon: <Mail size={20} className='min-w-5'/>,
    name: 'Messages',
    path: '/messages',
  },
  {
    id: 8,
    icon: <Bell size={20} className='min-w-5'/>,
    name: 'Notifications',
    path: '/notifications',
  },
  {
    id: 9,
    icon: <Info size={20} className='min-w-5'/>,
    name: 'Help',
    path: '/help',
  },
];


function Sidebar() {
  const pahtname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-21'} transition-all duration-300 ease-in-out shrink-0 relative z-10 `}>
      <div className='h-full bg-[#1e1e1e] backdrop-blur-md p-4 flex flex-col border-r border-[#2f2f2f]'>
        <button onClick={() => setIsSidebarOpen((prev) => !prev)} className='rounded-full p-2 hover:bg-[#2f2f2f] transition-colors max-w-fit cursor-pointer'><Menu size={24}/></button>
        <nav className='mt-8 grow'>
          {
            sidebatItems.map((item) => (
              <Link key={item.id} href={item.path}>
                <div className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#2f2f2f] transition-colors mb-2 ${pahtname === item.path ? 'bg-[#2f2f2f]' : ''}`}>
                  {item.icon}
                  {isSidebarOpen && <span className='ml-4 whitespace-nowrap'>{item.name}</span>}
                </div>
              </Link>
            ))
          }
        </nav>
      </div>
    </div>
  )
}

export default Sidebar