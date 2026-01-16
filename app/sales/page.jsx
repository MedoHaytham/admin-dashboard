"use client"
import React from 'react'
import StatCard from '../components/statCard'
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import RevenueChart from '../components/RevenueChart';
import SalesOverview from '../components/SalesOverview';
import SalesByCategory from '../components/SalesByCatecogry';

function Sales() {
  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{opacity:0, y:20 }}
          animate={{opacity:1, y:0 }}
          transition={{duration: 1}}
        >
          <StatCard name='Total Revenue' icon={DollarSign} value='42,300'/>
          <StatCard name='Avg. Order Value' icon={ShoppingCart} value='$78,50'/>
          <StatCard name='Total Sales' icon={CreditCard} value='$128,500'/>
          <StatCard name='Total Growth' icon={TrendingUp} value='36.2%'/>
        </motion.div>
        <RevenueChart />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-5'>
          <SalesOverview />
          <SalesByCategory />
        </div>
      </main>
    </div>
  )
}

export default Sales