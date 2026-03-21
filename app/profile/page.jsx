"use client"
import React from 'react'
import { motion } from 'framer-motion';

function Profile() {
  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.2, duration: 0.5}}
        >
          <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
            <h2 className='text-lg md:text-xl font-semibold text-text-secondary text-center md:text-left'>Profile</h2>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Profile