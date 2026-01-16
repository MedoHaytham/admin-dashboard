"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion';
import { Edit, Save, Search, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';



function ProductsTable() {
  // states
  const [productsData, setProductsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  },[searchTerm]);

  const filteredProducts = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    if(!term) return productsData;

    return productsData.filter((product) => {
      const titleMatch = product.title?.toLowerCase().includes(term);
      const categoryMatch = product.category?.toLowerCase().includes(term);
      return titleMatch || categoryMatch;
    })
  },[debouncedTerm, productsData]);

  const editClickHandler = (id) => {
    setEditingRow(id);
  }

  const saveClickHandler = () => {
    setEditingRow(null);
  }

  const changeHandler = (id, field, value) => {
    if(!/^\d*\.?\d*$/.test(value)) return; // allow only nums and decimals
    setProductsData((prevs) => (
      prevs.map((product) => (product.id === id ? {...product, [field]: Number(value)} : product)
    )))
  }

  const deleteHandler = (id) => {
    const confirmDelete = window.confirm('Are You Sure You Want To Delete This Product?');
    if (confirmDelete) {
      setProductsData(
        (prevs) => prevs.filter((product) => product.id !== id)
      );
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('https://dummyjson.com/products?sortBy=stock&order=asc&limit=194');
        const data = await response.json();
        setProductsData(data.products);
      } catch (error) {
        toast.error('Error on fetchingProducts ' + error);
      }
    }
    fetchProducts();
  },[]);

  return (
    <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0 mb-8'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.2, duration: 0.5}}
    >
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
        <h2 className='text-lg md:text-xl font-semibold text-text-secondary text-center md:text-left'>Products List</h2>
        <div className='relative w-full md:w-auto'>
          <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder='Search Products...' 
            className='bg-secondary text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm'/>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18}/>
        </div>
      </div>
      <div className='relative h-100 overflow-auto'>
        <table className='min-w-full'>
          <thead className="sticky -top-px z-20 bg-primary md:border-b border-gray-700">
            <tr>
              {[
                'Name',
                'Proudcut ID',
                'Category',
                'Price',
                'Stock',
                'Actions',
              ].map((header) => (
                <th key={header} className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell'>{header}</th>
              ))}
            </tr>
          </thead>
          
          <tbody className='divide-y divide-gray-700'>
            {
              filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.1, duration: 0.3}}
                  className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0
                    border-gray-700 md:border-none p-2 md:p-0 ${editingRow === product.id ? 'bg-secondary ring-gray-500': ''}`}
                >
                  {/* Mobile View */}
                  <td className='md:hidden px-3 py-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <Image src={product.thumbnail} alt={product.title} width={36} height={36} 
                          className='w-10 h-10 rounded-full bg-white'
                        />
                        <div className='ml-3'>
                          <div className='text-sm font-medium text-text-secondary'>
                            {product.title}
                          </div>
                          <div className='text-xs text-text-primary'>
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                      <div className='flex space-x-1 -mt-1 -mr-1'>
                          <button className='text-indigo-500 hover:text-indigo-300' onClick={() =>
                            editingRow === product.id ? saveClickHandler() : editClickHandler(product.id)
                          }>
                            {
                              editingRow === product.id ? <Save size={16} /> : <Edit size={16} />
                            }
                          </button>
                          <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(product.id)}>
                            <Trash2 size={16} />
                          </button>
                      </div>
                    </div>
                    <div className='mt-2 text-xs text-text-primary'>
                      <div>Category: {product.category}</div>
                      {['price', 'stock'].map((field) => (
                        <div key={field}>
                          {
                            <span className='capitalize'>{field}:{" "}
                            { 
                            editingRow === product.id 
                            ? <input className='bg-transparent text-white border border-gray-400 w-16 text-center text-xs ml-1' 
                                type="text" value={product[field]} onChange={(e) => changeHandler(product.id, field, e.target.value)}/>
                            : field === 'price'? `$${product[field].toFixed(2)}` : product[field]}</span>
                          }
                        </div>
                      ))}
                    </div>
                  </td>
                  {/* Desktop View */}
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-text-secondary border-b border-gray-700'>
                    <div className='flex items-center'>
                      <Image src={product.thumbnail} alt={product.title} width={40} height={40}
                        className='w-12 h-12 rounded-full bg-white p-1'
                      />
                      <div className='ml-4'>{product.title}</div>
                    </div>
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                      {product.id}
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                      {product.category}
                  </td>
                  {['price' , 'stock'].map((field) => (
                    <td key={field} className={`hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700 ${editingRow === product.id ? 'border border-gray-400' : ''}`}>
                      {
                        editingRow === product.id 
                        ? <input type="text" value={product[field]} onChange={(e) => changeHandler(product.id, field, e.target.value)}
                            className='bg-transparent text-white w-16 border-none outline-none text-center'
                          />
                        : field === 'price' ? `$${product[field].toFixed(2)}` : product[field]
                      }
                    </td>
                  ))}
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                    <div className='flex space-x-1 -ml-2'>
                      <button className='text-indigo-500 hover:text-indigo-300 mr-2' onClick={() =>
                        editingRow === product.id 
                        ? saveClickHandler() 
                        : editClickHandler(product.id)
                      }>
                        { editingRow === product.id ? <Save size={18} /> :<Edit size={18}/>}
                      </button>
                      <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(product.id)}>
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

export default ProductsTable