import React from 'react'
import { motion } from 'framer-motion'

function StatCard({name, icon:Icon, value}) {
  return (
    <motion.div whileHover={{y: -5}} className='bg-primary backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-border-primary px-4 py-5 sm:p-6'>
      <div className='flex items-center text-sm font-medium text-text-primary'>
        {<Icon size={20} className='mr-2'/>}
        <span className='mt-1'>{name}</span>
      </div>
      <p className='mt-1 text-3xl font-semibold text-text-theme'>{value}</p>
    </motion.div>
  )
}

export default StatCard