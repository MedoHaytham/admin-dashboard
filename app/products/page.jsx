"use client"
import React from 'react'
import { motion } from 'framer-motion';
import StatCard from '../components/statCard';
import { DollarSign, ShoppingBag, SquareActivity, Users } from 'lucide-react';
import ProductsTable from '../components/ProductsTable';

function Products() {
  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
        >
          <StatCard name='Total Products' icon={DollarSign} value='4,352'/>
          <StatCard name='Total Stock' icon={Users} value='18,450'/>
          <StatCard name='Total Sold' icon={ShoppingBag} value='12,780'/>
          <StatCard name='Total Categories' icon={SquareActivity} value='8'/>        
        </motion.div>
        <ProductsTable />
      </main>
    </div>
  )
}

export default Products