import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const salesByCategoryData = [
  { name: "Electronics", value: 45, color: "#3b82f6" },
  { name: "Clothing", value: 30, color: "#8b5cf6" },
  { name: "Books", value: 15, color: "#10b981" },
  { name: "Other", value: 10, color: "#f59e0b" },
];

function SalesByCategory() {
  return (
    <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.3, duration: 0.5}}
    >
      <h2 className='text-base md:text-lg font-medium mb-4 text-text-secondary text-center md:text-left'>Sales By Category</h2>
      <div className='h-64 md:h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={salesByCategoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}   
              outerRadius={80}
              paddingAngle={5}
            >
              {salesByCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

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
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className='flex gap-3 flex-wrap justify-center lg:justify-start'>
        {
          salesByCategoryData.map((item, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='w-3 h-3 rounded-full' style={{backgroundColor: item.color}} />
                <span className='text-sm text-text-primary '>{item.name}</span>
              </div>
            </div>
          ))
        }
      </div>
    </motion.div>
  )
}

export default SalesByCategory