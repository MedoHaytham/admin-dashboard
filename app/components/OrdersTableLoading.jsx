import React from 'react';
import { motion } from 'framer-motion';

function OrdersTableLoading() {
  const skeletonRows = Array.from({ length: 7 });

  return (
    <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0 mb-8'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.2, duration: 0.5}}
    >
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
        <div className='h-7 w-32 skeltoin rounded'></div>
      </div>
      <div className='relative h-100 overflow-auto'>
        <table className='min-w-full'>
          <thead className="sticky -top-px z-20 bg-primary md:border-b border-gray-700">
            <tr>
              {[
                'Order ID', 
                'Client', 
                'Items', 
                'Total', 
                'Status', 
                'Payment', 
                'Date', 
                'City'
              ].map((header) => (
                <th key={header} className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell'>{header}</th>
              ))}
            </tr>
          </thead>
          
          <tbody className='divide-y divide-gray-700'>
            {
              skeletonRows.map((_, index) => (
                <tr
                  key={index}
                  className='flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0'
                >
                  {/* Mobile View */}
                  <td className='md:hidden px-3 py-2'>
                    <div className='flex items-center justify-between mb-2'>
                      <div>
                        <div className='h-4 w-28 skeltoin rounded mb-1'></div>
                        <div className='h-4 w-32 skeltoin rounded mb-1'></div>
                        <div className='h-3 w-40 skeltoin rounded'></div>
                      </div>
                    </div>
                    <div className='mt-3 space-y-2'>
                      <div className='h-3 w-20 skeltoin rounded'></div>
                      <div className='h-3 w-24 skeltoin rounded'></div>
                      <div className='h-3 w-20 skeltoin rounded'></div>
                      <div className='h-3 w-20 skeltoin rounded'></div>
                      <div className='h-3 w-32 skeltoin rounded'></div>
                      <div className='h-3 w-24 skeltoin rounded'></div>
                    </div>
                  </td>
                  
                  {/* Desktop View */}
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='h-4 w-24 skeltoin rounded mb-1'></div>
                    <div className='h-3 w-32 skeltoin rounded'></div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='h-4 w-32 skeltoin rounded mb-1'></div>
                    <div className='h-3 w-40 skeltoin rounded'></div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='h-4 w-12 skeltoin rounded'></div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='h-4 w-16 skeltoin rounded'></div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='h-6 w-16 skeltoin rounded-lg'></div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='h-5 w-12 skeltoin rounded-full'></div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='h-4 w-24 skeltoin rounded'></div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='h-4 w-20 skeltoin rounded'></div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default OrdersTableLoading;
