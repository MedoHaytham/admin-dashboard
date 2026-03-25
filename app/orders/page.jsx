/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React from 'react'
import { motion } from 'framer-motion';
import StatCard from '../components/statCard';
import { Ban, CheckCheck, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import OrdersTable from '../components/OrdersTable';
import { useState } from 'react';
import { useEffect } from 'react';
import { useGetOrdersQuery } from '../features/orderSlice';



function Orders() {

  const { data: orders, isLoading } = useGetOrdersQuery();
  const ordersData = orders?.data?.orders || [];

  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [canceledOrders, setCanceledOrders] = useState(0);

  useEffect(() => {
    if (ordersData) {
      setTotalOrders(isLoading ? 'loading...' : ordersData.length);
      setCompletedOrders(isLoading ? 'loading...' : ordersData.filter(o => o.orderStatus === 'confirmed').length);
      setPendingOrders(isLoading ? 'loading...' : ordersData.filter(o => o.orderStatus === 'pending').length);
      setCanceledOrders(isLoading ? 'loading...' : ordersData.filter(o => o.orderStatus === 'cancelled').length);
    }
  }, [ordersData, isLoading]);

  
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