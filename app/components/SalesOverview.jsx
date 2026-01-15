import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';

const salesData = [
  { month: 'Jan', sales: 30 },
  { month: 'Feb', sales: 45 },
  { month: 'Mar', sales: 20 },
  { month: 'Apr', sales: 60 },
  { month: 'May', sales: 50 },
  { month: 'Jun', sales: 55 },
  { month: 'Jul', sales: 70 },
  { month: 'Aug', sales: 65 },
  { month: 'Sep', sales: 40 },
  { month: 'Oct', sales: 58 },
  { month: 'Nov', sales: 62 },
  { month: 'Dec', sales: 75 },
];


function SalesOverview() {


  return (
    <motion.div className='bg-primary backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-border-primary p-4 sm:p-6 mx-2 md:mx-0'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.2, duration: 0.5}}
    >
      <h2 className='text-base md:text-lg font-medium mb-4 text-text-secondary text-center md:text-left'>Sales Overview</h2>
      <div className='w-full h-64 md:h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4b5563'/>
            <XAxis dataKey='month' stroke='#9ca3af' tick={{fontSize: 12}} interval='preserveStartEnd'/>
            <YAxis stroke='#9ca3af' tick={{fontSize: 12}} width={40}/>
            <Tooltip contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderColor: '#4b5563',
              fontSize: '12px'
            }} itemStyle={{color: '#e5e7eb'}}/>
            <Line 
              type='monotone' 
              dataKey='sales' 
              stroke='#9c27b0' 
              strokeWidth={3} 
              dot={{fill: '#9c27b0', strokeWidth: 2, r:4 }}
              activeDot={{r: 6, strokeWidth:2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default SalesOverview