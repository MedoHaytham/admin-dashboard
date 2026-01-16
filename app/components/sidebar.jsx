"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { House, DollarSign , Settings, ShoppingBag, ShoppingCart , Mail, Users, Bell, Info, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const sidebarItems  = [
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
];


function Sidebar() {
  const pathname  = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // if (isSidebarOpen === null) return null;

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-21'} transition-all duration-300 ease-in-out shrink-0 relative z-10 `}>
      <div className='h-full bg-primary backdrop-blur-md p-4 flex flex-col border-r border-secondary'>
        <button  onClick={() => setIsSidebarOpen((prev) => !prev)} className={`hidden md:block rounded-full p-2 hover:bg-secondary transition-colors max-w-fit cursor-pointer ${isSidebarOpen ? '' : 'ml-1.5'}`}><Menu size={24}/></button>
        <nav className='mt-8 grow'>
          {
            sidebarItems.map((item) => (
              <Link key={item.id} href={item.path}>
                <div className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-secondary transition-colors mb-2 ${pathname === item.path ? 'bg-secondary' : ''}`}>
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