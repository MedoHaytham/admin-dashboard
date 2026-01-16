import React from 'react'
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const salesData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 38000 },
  { month: "Mar", revenue: 48000, expenses: 35000 },
  { month: "Apr", revenue: 61000, expenses: 42000 },
  { month: "May", revenue: 55000, expenses: 40000 },
  { month: "Jun", revenue: 67000, expenses: 45000 },
  { month: "Jul", revenue: 72000, expenses: 48000 },
  { month: "Aug", revenue: 69000, expenses: 46000 },
  { month: "Sep", revenue: 78000, expenses: 52000 },
  { month: "Oct", revenue: 74000, expenses: 50000 },
  { month: "Nov", revenue: 82000, expenses: 55000 },
  { month: "Dec", revenue: 89000, expenses: 58000 },
];


function RevenueChart() {
  return (
    <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0 mb-8'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.4, duration: 0.5}}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-base md:text-lg font-medium mb-4 text-text-secondary text-center md:text-left'>Revenue Chart</h2>
        <div className='flex gap-3 flex-wrap justify-center lg:justify-start'>
          <div className='flex items-center space-x-3'>
            <div className='w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-blue-600'/>
            <span className='text-sm text-text-primary '>Revenue</span>
          </div>
          <div className='flex items-center space-x-3'>
            <div className='w-3 h-3 rounded-full bg-linear-to-r from-slate-400 to-slate-500'/>
            <span className='text-sm text-text-primary '>Expenses</span>
          </div>
        </div>
      </div>
      <div className='h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke='#e2e8f0' opacity={0.3}/>
            <XAxis dataKey="month" stroke='#64748b' fontSize={12} tickLine={false} axisLine={false}/>
            <YAxis stroke='#64748b' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}K`}/>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4b5563',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
              }}
              itemStyle={{color: '#e5e7eb'}}
              cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
            />
            <Bar dataKey="revenue" fill='url(#renvenueGridiant)' radius={[4, 4, 0, 0]} maxBarSize={40}/>
            <Bar dataKey="expenses" fill='url(#expensesGridiant)' radius={[4, 4, 0, 0]} maxBarSize={40}/>
            <defs>
              <linearGradient id='renvenueGridiant' x1={0} y1={0} x2={0} y2={1}>
                <stop offset='0%'stopColor='#3b82f6'/>
                <stop offset='100%'stopColor='#8b5cf6'/>
              </linearGradient>
              <linearGradient id='expensesGridiant' x1={0} y1={0} x2={0} y2={1}>
                <stop offset='0%'stopColor='#94a3b8'/>
                <stop offset='100%'stopColor='#64748b'/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default RevenueChart