"use client"
import React from 'react'
import { motion } from 'framer-motion';
import StatCard from '../components/statCard';
import { DollarSign, ShoppingBag, SquareActivity, Users } from 'lucide-react';
import ProductsTable from '../components/ProductsTable';
import { useState } from 'react';
import { useEffect } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery } from '../features/productsSlice';


function Products() {
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  


  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
        >
          <StatCard name='Total Products' icon={DollarSign} value= {productsLoading ? 'loading...' : products?.data?.length}/>
          <StatCard name='Total Stock' icon={Users} value= {productsLoading ? 'loading...' : products?.data?.reduce((acc, product) => acc + (Number(product.stock) || 0), 0)}/>
          <StatCard name='Total Categories' icon={SquareActivity} value= {categoriesLoading ? 'loading...' : categories?.data?.length}/>
        </motion.div>
        <ProductsTable />
      </main>
    </div>
  )
}

export default Products