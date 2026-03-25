/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React from 'react'
import { motion } from 'framer-motion';
import StatCard from '../components/statCard';
import ClientsTable from '../components/ClientsTable';
import { UserStar, UserIcon, UserPlus, Crown } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useGetUsersQuery } from '../features/userSlice';

function Clietns() {


  const { data: clients, isLoading } = useGetUsersQuery();
  
  const clientsData = clients?.data || [];

  const [totalClients, setTotalClients] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [managers, setManagers] = useState(0);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    if (clientsData) {
      setTotalClients(isLoading ? 'loading...' : clientsData.length);
      setAdmins(isLoading ? 'loading...' : clientsData.filter((client) => client.role === 'admin').length);
      setManagers(isLoading ? 'loading...' : clientsData.filter((client) => client.role === 'manager').length);
      setUsers(isLoading ? 'loading...' : clientsData.filter((client) => client.role === 'user').length);
    }
  }, [clientsData]);



  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
        >
          <StatCard name='Total Clients' icon={UserPlus} value={totalClients}/>
          <StatCard name='Managers' icon={Crown} value={managers}/>
          <StatCard name='Admins' icon={UserStar} value={admins}/>
          <StatCard name='Users' icon={UserIcon} value={users}/>        
        </motion.div>
        <ClientsTable />
      </main>
    </div>
  )
}

export default Clietns