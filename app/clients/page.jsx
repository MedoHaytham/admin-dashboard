"use client"
import React from 'react'
import { motion } from 'framer-motion';
import StatCard from '../components/statCard';
import ClientsTable from '../components/ClientsTable';
import { UserStar, UserIcon, UserPlus, Crown } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Cookies from 'js-cookie';

function Clietns() {

  const [totalClients, setTotalClients] = useState('loading...');
  const [admins, setAdmins] = useState('loading...');
  const [managers, setManagers] = useState('loading...');
  const [users, setUsers] = useState('loading...');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('https://e-commerce-backend-geri.onrender.com/api/users', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('accessToken')}`
          }
        });
        const data = response.data.data;
        console.log(data);
        setTotalClients(data.length);
        setAdmins(data.filter((client) => client.role === 'admin').length);
        setManagers(data.filter((client) => client.role === 'manager').length);
        setUsers(data.filter((client) => client.role === 'user').length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClients();
  }, []);

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