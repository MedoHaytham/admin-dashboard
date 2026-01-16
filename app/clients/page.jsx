"use client"
import React from 'react'
import { motion } from 'framer-motion';
import StatCard from '../components/statCard';
import ClientsTable from '../components/ClientsTable';
import { RotateCcw, UserCheck, UserIcon, UserPlus } from 'lucide-react';

function Clietns() {
  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
        >
          <StatCard name='Total Clients' icon={UserIcon} value='7670'/>
          <StatCard name='New Clients' icon={UserPlus} value='860'/>
          <StatCard name='Active Clients' icon={UserCheck} value='4080'/>
          <StatCard name='Returning Clients' icon={RotateCcw} value='2730'/>        
        </motion.div>
        <ClientsTable />
      </main>
    </div>
  )
}

export default Clietns