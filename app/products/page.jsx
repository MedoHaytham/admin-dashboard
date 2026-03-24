"use client"
import React from 'react'
import { motion } from 'framer-motion';
import StatCard from '../components/statCard';
import { DollarSign, ShoppingBag, SquareActivity, Users } from 'lucide-react';
import ProductsTable from '../components/ProductsTable';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';


function Products() {
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState('loading...');
  const [totalCategories, setTotalCategories] = useState('loading...');
  const [totalStock, setTotalStock] = useState('loading...');

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const response = await axios.get('https://e-commerce-backend-geri.onrender.com/api/products?limit=0');
        const data = response.data.data;
        setTotalProducts(data.length);
        setTotalStock(data.reduce((acc, product) => acc + (Number(product.stock) || 0), 0));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://e-commerce-backend-geri.onrender.com/api/categories?limit=0');
        const data = response.data.data;
        setTotalCategories(data.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
        >
          <StatCard name='Total Products' icon={DollarSign} value= {totalProducts}/>
          <StatCard name='Total Stock' icon={Users} value= {totalStock}/>
          <StatCard name='Total Categories' icon={SquareActivity} value= {totalCategories}/>
        </motion.div>
        <ProductsTable />
      </main>
    </div>
  )
}

export default Products