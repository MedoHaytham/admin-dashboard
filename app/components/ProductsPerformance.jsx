import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { motion } from 'framer-motion';

const productsPerformanceData = [
  {
    name: "Smartphone",
    Retention: 5000,
    Revenue: 3000,
    Profit: 2800,
  },
  {
    name: "Laptop",
    Retention: 4200,
    Revenue: 2600,
    Profit: 3300,
  },
  {
    name: "Coffee Table",
    Retention: 3000,
    Revenue: 6800,
    Profit: 4000,
  },
  {
    name: "Mouse",
    Retention: 2500,
    Revenue: 4200,
    Profit: 2600,
  },
  {
    name: "Running Shoes",
    Retention: 2000,
    Revenue: 9000,
    Profit: 2800,
  },
];

const dots = [
  {name:'Retention', color:'#ff7043'},
  {name:'Revenue', color:'#29b6f6'},
  {name:'Profit', color:'#66bb6a'},
]

function ProductsPerformance() {
return (
    <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.4, duration: 0.5}}
    >
      <h2 className='text-base md:text-lg font-medium mb-4 text-text-secondary text-center md:text-left'>Product Performance</h2>
      <div className='h-100 md:h-80'>
        <ResponsiveContainer width='100%' height='90%'>
          <BarChart data={productsPerformanceData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151'/>
            <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} interval='preserveStartEnd'/>
            <YAxis stroke="#9ca3af" tick={{fontSize: 12}} width={40}/>
            <Tooltip contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4b5563',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
              }}
              itemStyle={{color: '#e5e7eb'}}
            />
            <Bar dataKey="Retention" fill="#ff7043" radius={[4, 4, 0, 0]} barSize={20}/>
            <Bar dataKey="Revenue" fill="#29b6f6" radius={[4, 4, 0, 0]} barSize={20}/>
            <Bar dataKey="Profit" fill="#66bb6a" radius={[4, 4, 0, 0]} barSize={20}/>
          </BarChart>
        </ResponsiveContainer>
        <div className='flex gap-3 flex-wrap justify-center lg:justify-start lg:mt-8'>
          {
            dots.map((item, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-3 h-3 rounded-full' style={{backgroundColor: item.color}} />
                  <span className='text-sm text-text-primary'>{item.name}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </motion.div>
  )
}

export default ProductsPerformance