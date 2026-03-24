"use client"
import React from 'react'
import { motion } from 'framer-motion';
import StatCard from '../components/statCard';
import { Ban, CheckCheck, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import OrdersTable from '../components/OrdersTable';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';



function Orders() {

  const [totalOrders, setTotalOrders] = useState('loading...');
  const [completedOrders, setCompletedOrders] = useState('loading...');
  const [pendingOrders, setPendingOrders] = useState('loading...');
  const [canceledOrders, setCanceledOrders] = useState('loading...');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get('https://e-commerce-backend-geri.onrender.com/api/orders/all?limit=0', {
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` }
        });
        const orders = response.data.data.orders;
        setTotalOrders(orders.length);
        setCompletedOrders(orders.filter(o => o.orderStatus === 'confirmed').length);
        setPendingOrders(orders.filter(o => o.orderStatus === 'pending').length);
        setCanceledOrders(orders.filter(o => o.orderStatus === 'cancelled').length);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
    fetchOrders();
  }, []);

  
  
  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
        >
          <StatCard name='Total Orders' icon={ShoppingBag} value={totalOrders}/>
          <StatCard name='Confirmed Orders' icon={CheckCircle} value={completedOrders}/>
          <StatCard name='Pending Orders' icon={Clock} value={pendingOrders}/>
          <StatCard name='Canceled Orders' icon={Ban} value={canceledOrders}/> 
        </motion.div>
        <OrdersTable />
      </main>
    </div>
  )
}

export default Orders