import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion';
import { Edit, Save, Search, Trash2 } from 'lucide-react';



function OrdersTable() {

  const [orderData, setOrderData] =useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  

  useEffect (() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  },[searchTerm]);

  const filteredOrders = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    if (!term) return orderData;
    return (
      orderData.filter((order) => {
        const nameMatch = order.client?.toLowerCase().includes(term);
        const emailMatch = order.email?.toLowerCase().includes(term);
        const idMatch = order.id?.toLowerCase().includes(term);
        return nameMatch || emailMatch || idMatch
      })
    );
  },[debouncedTerm, orderData]);

  const editClickHandler = (id) => {
    setEditingRow(id);
  }

  const saveClickHandler = () => {
    setEditingRow(null);
  }

  const changeHandler = (id, field, value) => {
    setOrderData((prevs) => (
      prevs.map((order) => (order.id === id ? {...order, [field]: value } : order)
    )))
  }

  const deleteHandler = (id) => {
    const confirmDelete = window.confirm('Are You Sure You Want To Remove This Order?');
    if(confirmDelete) {
      setOrderData(
        (prevs) => prevs.filter((client) => client.id !== id)
      );
    };
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const resones1 = await fetch('https://dummyjson.com/carts?limit=50&sortBy=total');
        const cartData = await resones1.json();
        const orderData = await Promise.all( 
          cartData.carts.map( async (cart) => {
            const respone2 = await fetch(`https://dummyjson.com/users/${cart.userId}`);
            const userData = await respone2.json();

            return {
              id: `#A7B9D3${cart.id}`,
              client: userData.firstName + ' ' + userData.lastName,
              email: userData.email,
              total: cart.total,
              status: ['Delivered', 'Pending', 'Canceled'][cart.id % 3],
              date: new Date().toDateString(),
              city: userData.address.city 
            };
          })
        );
        setOrderData(orderData);
      } catch (error) {
        toast.error('Error on fetch orders' + error);
      }
    }
    fetchOrders();
  },[]);


  return (
    <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0 mb-8'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.2, duration: 0.5}}
    >
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
        <h2 className='text-lg md:text-xl font-semibold text-text-secondary text-center md:text-left'>Orders List</h2>
        <div className='relative w-full md:w-auto'>
          <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder='Search Clinets...' 
            className='bg-secondary text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm'/>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18}/>
        </div>
      </div>
      <div className='relative h-100 overflow-auto'>
        <table className='min-w-full'>
          <thead className="sticky -top-px z-20 bg-primary md:border-b border-gray-700">
            <tr>
              {[
                'Order ID',
                'Client',
                'Total',
                'Status',
                'Date',
                'City',
                'Actions',
              ].map((header) => (
                <th key={header} className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell'>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-700'>
            {
              filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.1, duration: 0.3}}
                  className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0
                    border-gray-700 md:border-none p-2 md:p-0 ${editingRow === order.id ? 'bg-secondary ring-gray-500': ''}`}
                >
                  {/* Mobile View */}
                  <td className='md:hidden px-3 py-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-col'>
                        <div className='text-xs font-medium text-text-secondary'>
                          {order.id}
                        </div>
                        <div className='text-xs text-text-secondary'>
                          { 
                            editingRow === order.id
                            ? <input className='bg-transparent text-white border border-gray-400 w-40 p-1 mb-1 text-center text-xs ml-1' 
                                type="text" value={order.client}
                                onChange={(e) => changeHandler(order.id, 'client', e.target.value)}
                              />
                            : order.client
                          }
                        </div>
                        <div className='text-xs text-gray-400'>
                          { 
                            editingRow === order.id
                            ? <input className='bg-transparent text-white border border-gray-400 w-40 p-1 mb-1 text-center text-xs ml-1' 
                                type="text" value={order.email}
                                onChange={(e) => changeHandler(order.id, 'email', e.target.value)}
                              />
                            : order.email
                          }
                        </div>                      
                      </div>
                      <div className='flex space-x-1 -mt-1 -mr-1'>
                        <button className='text-indigo-500 hover:text-indigo-300' onClick={() =>
                          editingRow === order.id ? saveClickHandler() : editClickHandler(order.id)
                        }>
                          {
                            editingRow === order.id ? <Save size={16} /> : <Edit size={16} />
                          }
                        </button>
                        <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(order.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className='mt-2 text-xs text-text-primary'>
                      <div className='mb-1'>Total: ${order.total.toFixed(2)}</div>
                      <div className='flex items-center gap-1 mb-1'>
                        status: 
                        <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          order.status === 'Delivered' 
                          ? 'bg-green-400 text-green-800' 
                          : order.status === 'Pending'
                          ? 'bg-yellow-400 text-yellow-800'
                          : 'bg-red-400 text-red-800'
                          }`}
                        >
                          {order.status}
                          </span>
                      </div>
                      <div className='mb-1'>Date: {order.date}</div>
                      <div>City: { 
                          editingRow === order.id
                          ? <input className='bg-transparent text-white border border-gray-400 w-30 p-1 mb-1 text-center text-xs ml-1' 
                              type="text" value={order.city}
                              onChange={(e) => changeHandler(order.id, 'city', e.target.value)}
                            />
                          : order.city
                          }
                      </div>
                    </div>
                  </td>
                  {/* Desktop View */}
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                      {order.id}
                  </td>
                  <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700 ${editingRow === order.id ? 'border border-gray-400' : ''}`}>
                    <div className='flex flex-col'>
                      <div>
                        {
                          editingRow === order.id
                          ? <input className='bg-transparent text-white w-full max-w-60 border-none outline-none text-center' 
                              type="text" value={order.client}
                              onChange={(e) => changeHandler(order.id, 'client', e.target.value)}
                            />
                          : order.client
                        }
                      </div>
                      <div>
                        {
                          editingRow === order.id
                          ? <input className='bg-transparent text-white w-full max-w-60 border-none outline-none text-center' 
                              type="text" value={order.email}
                              onChange={(e) => changeHandler(order.id, 'email', e.target.value)}
                            />
                          : order.email
                        }
                      </div>
                    </div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                      ${order.total.toFixed(2)}
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm border-b border-gray-700'>
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      order.status === 'Delivered' 
                      ? 'bg-green-400 text-green-800' 
                      : order.status === 'Pending'
                      ? 'bg-yellow-400 text-yellow-800'
                      : 'bg-red-400 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                      {order.date}
                  </td>
                  <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700 ${editingRow === order.id ? 'border border-gray-400' : ''}`}>
                    {
                      editingRow === order.id
                      ? <input className='bg-transparent text-white w-full max-w-60 border-none outline-none text-center' 
                          type="text" value={order.city}
                          onChange={(e) => changeHandler(order.id, 'city', e.target.value)}
                        />
                      : order.city
                    }
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                    <div className='flex space-x-1 -ml-2'>
                      <button className='text-indigo-500 hover:text-indigo-300 mr-2' onClick={() =>
                        editingRow === order.id 
                        ? saveClickHandler() 
                        : editClickHandler(order.id)
                      }>
                        { editingRow === order.id ? <Save size={18} /> :<Edit size={18}/>}
                      </button>
                      <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(order.id)}>
                        <Trash2 size={18}/>
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

export default OrdersTable