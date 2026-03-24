'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion';
import { Search, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import OrdersTableLoading from './OrdersTableLoading';

const STATUS_STYLES = {
  confirmed:  'bg-green-400/20 text-green-400',
  pending:    'bg-yellow-400/20 text-yellow-400',
  cancelled:  'bg-red-400/20 text-red-400',
  delivered:  'bg-blue-400/20 text-blue-400',
  processing: 'bg-purple-400/20 text-purple-400',
};

function OrdersTable() {
  const [orderData, setOrderData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Filter
  const filteredOrders = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    if (!term) return orderData;
    return orderData.filter((order) => {
      const nameMatch = `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase().includes(term);
      const emailMatch = order.user?.email?.toLowerCase().includes(term);
      const idMatch = order._id?.toLowerCase().includes(term);
      const merchantIdMatch = order.merchantOrderId?.toLowerCase().includes(term);
      return nameMatch || emailMatch || idMatch || merchantIdMatch;
    });
  }, [debouncedTerm, orderData]);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          'https://e-commerce-backend-geri.onrender.com/api/orders/all?limit=0',
          { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } }
        );
        setOrderData(response.data.data.orders);
      } catch (error) {
        toast.error('Error fetching orders: ' + error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Update order status

  // Delete order

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  if (isLoading) return <OrdersTableLoading />;

  return (
    <div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0 mb-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
        <h2 className='text-lg md:text-xl font-semibold text-text-secondary text-center md:text-left'>Orders List</h2>
        <div className='relative w-full md:w-auto'>
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            type="text"
            placeholder='Search orders...'
            className='bg-secondary text-text-theme placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm'
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
      </div>

      {/* Table */}
      <div className='relative h-100 overflow-auto'>
        <table className='min-w-full'>
          <thead className="sticky -top-px z-20 bg-primary md:border-b border-gray-700">
            <tr>
              {['Order ID', 
                'Client', 
                'Items', 
                'Total', 
                'Status', 
                'Payment', 
                'Date', 
                'City'
              ].map((header) => (
                  <th key={header} className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell'>
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-700'>
            {filteredOrders.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className='flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0'
              >
                {/* ===== Mobile ===== */}
                <td className='md:hidden px-3 py-2'>
                  <div className='flex items-center justify-between mb-2'>
                    <div>
                      <div className='text-xs font-medium text-text-secondary'>{order.merchantOrderId}</div>
                      <div className='text-xs text-text-primary font-medium'>
                        {order.user?.firstName} {order.user?.lastName}
                      </div>
                      <div className='text-xs text-gray-400'>{order.user?.email}</div>
                    </div>
                  </div>
                  <div className='text-xs text-text-primary space-y-1'>
                    <div>Items: {order.items?.length}</div>
                    <div>Total: <span className='text-text-secondary font-medium'>${order.totalPrice?.toFixed(2)}</span></div>
                    <div className='flex items-center gap-2'>
                      Status:{' '}
                      <div
                        className={`rounded px-1 py-0.5 text-xs outline-none ${STATUS_STYLES[order.orderStatus] || 'bg-secondary text-text-theme'}`}
                      >
                        {order.orderStatus}
                      </div>
                    </div>
                    <div className='flex items-center gap-1'>
                      Payment:{' '}
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${order.isPaid ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                    <div>Date: {formatDate(order.createdAt)}</div>
                    <div className='capitalize'>City: {order.shippingAddress?.city}</div>
                  </div>
                </td>

                {/* ===== Desktop ===== */}
                {/* Order ID */}
                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-xs text-text-primary border-b border-gray-700'>
                  <div>{order.merchantOrderId}</div>
                  <div className='text-gray-500 text-xs'>{order._id}</div>
                </td>
                {/* Client */}
                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                  <div className='font-medium text-text-secondary'>{order.user?.firstName} {order.user?.lastName}</div>
                  <div className='text-xs text-gray-400'>{order.user?.email}</div>
                </td>
                {/* Items */}
                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                  {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                </td>
                {/* Total */}
                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-medium border-b border-gray-700'>
                  ${order.totalPrice?.toFixed(2)}
                </td>
                {/* Status */}
                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm border-b border-gray-700'>
                  <div
                    className={`rounded-lg text-center px-2 py-1 text-xs outline-none capitalize ${STATUS_STYLES[order.orderStatus] || 'bg-secondary text-text-theme'}`}
                  >
                    {order.orderStatus}
                  </div>
                </td>
                {/* Payment */}
                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm border-b border-gray-700'>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.isPaid ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                {/* Date */}
                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                  {formatDate(order.createdAt)}
                </td>
                {/* City */}
                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700 capitalize'>
                  {order.shippingAddress?.city}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;