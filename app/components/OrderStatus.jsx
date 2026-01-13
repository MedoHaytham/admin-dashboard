"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const orderStatusData = [
  { name: "Pending", value: 24, color: "#f2c94c" },     
  { name: "Processing", value: 18, color: "#2d9cdb" },
  { name: "Canceled", value: 12, color: "#eb5757" },   
  { name: "Delivered", value: 47, color: "#6fcf97" },
];



function OrderStatus() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.3, duration: 0.5}}
    >
      <h2 className='text-base md:text-lg font-medium mb-4 text-text-secondary text-center md:text-left'>Order Status</h2>
      <div className='h-64 md:h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 88 : 80}
              label={
                isMobile? 
                ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180) - 0.18);
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text x={x} y={y} fill="#000" textAnchor="middle" dominantBaseline="central" fontSize={8}>
                      {`${name} ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }
                :({name, percent})=> `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={!isMobile}  
            >
              {orderStatusData.map((entry, index) => (
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
          orderStatusData.map((item, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='w-3 h-3 rounded-full' style={{backgroundColor: item.color}} />
                <span className='text-sm text-text-primary'>{item.name}</span>
              </div>
            </div>
          ))
        }
      </div>
    </motion.div>
  )
}

export default OrderStatus