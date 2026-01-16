import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Edit, Save, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';

function ClientsTable() {

  const [clintsData , setClientsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  },[searchTerm]);

  const filteredClients = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    if (!term) return clintsData;
    return (
      clintsData.filter((client) => {
        const nameMatch = client.name?.toLowerCase().includes(term);
        const emailMatch = client.email?.toLowerCase().includes(term);
        return nameMatch || emailMatch
      })
    );
  },[debouncedTerm, clintsData]);

  useEffect(()=>{
    async function fetchClients() {
      try {
        const response = await fetch('https://dummyjson.com/users?limit=208&sortBy=firstName&order=asc');
        const data = await response.json();
        const ClietnsData = data.users.map((client) => ({
          id: client.id,
          name: client.firstName + ' ' + client.lastName,
          image: client.image,
          email: client.email,
          phone: client.phone,
          city: client.address.city,
        }))
        setClientsData(ClietnsData);
      } catch (error) {
        toast.error('Error on fetch clients' + error);
      }
    }
    fetchClients();
  },[]);

  const editClickHandler = (id) => {
    setEditingRow(id);
  }

  const saveClickHandler = () => {
    setEditingRow(null);
  }

  const changeHandler = (id, field, value) => {
    setClientsData((prevs) => (
      prevs.map((client) => (client.id === id ? {...client, [field]: value} : client))
    ));
  }

  const deleteHandler = (id) => {
    const confirmDelete = window.confirm('Are You Sure You Want To Remove This Client?');
    if(confirmDelete) {
      setClientsData(
        (prevs) => prevs.filter((client) => client.id !== id)
      );
    };
  };

  return (
    <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-border-primary mx-2 sm:mx-0 mb-8'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.2, duration: 0.5}}
    >
      <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0'>
        <h2 className='text-lg sm:text-xl font-semibold text-text-secondary text-center sm:text-left'>Clients List</h2>
        <div className='relative w-full sm:w-auto'>
          <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder='Search Clinets...' 
            className='bg-secondary text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm'/>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18}/>
        </div>
      </div>
      <div className='relative h-100 overflow-auto'>
        <table className='min-w-full'>
          <thead className="sticky -top-px z-20 bg-primary sm:border-b border-gray-700">
            <tr>
              {['Name','Email', 'Phone Number', 'City', 'Actions'].map((header) => (
                <th key={header} className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell'>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-700'>
            {
              filteredClients.map((client) => (
                <motion.tr 
                  key={client.id}
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.1, duration: 0.3}}
                  className={`flex flex-col sm:table-row mb-4 sm:mb-0 border-b sm:border-b-0
                    border-gray-700 sm:border-none p-2 sm:p-0 ${editingRow === client.id ? 'bg-secondary ring-1 ring-gray-500' : ''}`}
                >
                  {/* Mobile View */}
                  <td className='sm:hidden px-3 py-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <Image src={client.image} alt='client img' width={36} height={36}
                          className='w-9 h-9 rounded-full bg-white'
                        />
                        <div className='ml-3'>
                          <div className='text-sm font-medium text-text-secondary'>
                            {
                              editingRow === client.id
                              ? <input className='bg-transparent text-white border border-gray-400 w-40 p-1 mb-1 text-center text-xs ml-1' 
                                  type="text" value={client.name}
                                  onChange={(e) => changeHandler(client.id, 'name', e.target.value)}
                                />
                              : client.name
                            }
                          </div>
                          <div className='text-xs text-text-primary'>
                            { 
                              editingRow === client.id
                              ? <input className='bg-transparent text-white border border-gray-400 w-40 p-1 mb-1 text-center text-xs ml-1' 
                                  type="text" value={client.email}
                                  onChange={(e) => changeHandler(client.id, 'email', e.target.value)}
                                />
                              : client.email
                            }
                          </div>
                        </div>
                      </div>
                      <div className='flex space-x-1 -mt-5 -mr-4'>
                        <button className='text-indigo-500 hover:text-indigo-300' onClick={() => editingRow === client.id 
                          ? saveClickHandler()
                          : editClickHandler(client.id)
                        }>
                          { editingRow === client.id ? <Save size={16} /> :<Edit size={16}/>}
                        </button>
                        <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(client.id)}>
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                    <div className='mt-2 text-xs text-text-primary'>
                      <div>
                        Phone: {
                          editingRow === client.id
                          ? <input className='bg-transparent text-white border border-gray-400 w-27 p-1 mb-1 text-center text-xs ml-1' 
                              type="text" value={client.phone}
                              onChange={(e) => changeHandler(client.id, 'phone', e.target.value)}
                            />
                          : client.phone
                        }
                      </div>
                      <div>
                        City: {
                          editingRow === client.id
                          ? <input className='bg-transparent text-white border border-gray-400 w-27 p-1 text-center text-xs ml-1' 
                              type="text" value={client.city}
                              onChange={(e) => changeHandler(client.id, 'city', e.target.value)}
                            />
                          : client.city
                        }
                      </div>
                    </div>
                  </td>
                  {/* Desktop View */}
                  <td className='hidden sm:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <div className='flex items-center'>
                      <Image src={client.image} alt='client img' width={40} height={40}
                        className='w-10 h-10 rounded-full bg-white'
                      />
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-text-secondary'>
                            {
                              editingRow === client.id
                              ? <input className='bg-transparent text-white w-full max-w-60 border-none outline-none text-center' 
                                  type="text" value={client.name}
                                  onChange={(e) => changeHandler(client.id, 'name', e.target.value)}
                                />
                              : client.name
                            }
                        </div>
                      </div>
                    </div>
                  </td>
                  {
                    ['email', 'phone', 'city'].map((field) => (
                    <td key={field} className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700 ${editingRow === client.id ? 'border border-gray-400' : ''}`}>
                        { 
                          editingRow === client.id
                          ? <input className='bg-transparent text-white w-full max-w-60 border-none outline-none text-center' 
                              type="text" value={client[field]}
                              onChange={(e) => changeHandler(client.id, field, e.target.value)}
                            />
                          : client[field]
                        }
                      </td>
                    ))
                  }
                  <td className='hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                    <div className='flex space-x-1 -ml-2'>
                      <button className='text-indigo-500 hover:text-indigo-300 mr-2' onClick={() => 
                        editingRow === client.id 
                          ? saveClickHandler()
                          : editClickHandler(client.id)
                        }>
                        { editingRow === client.id ? <Save size={18} /> :<Edit size={18}/>}
                      </button>
                      <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(client.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default ClientsTable