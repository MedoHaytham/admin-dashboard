/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { Edit, Save, Search, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import ProdcutsTableLoading from './ProdcutsTableLoading';
import { GoPlus } from "react-icons/go";
import AddProductForm from './productForm';
import { motion } from 'framer-motion';
import { useGetProductsQuery, useGetCategoriesQuery, useUpdateProductMutation, useDeleteProductMutation } from '../features/productsSlice';


function ProductsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: productsRes, isLoading: productsLoading } = useGetProductsQuery();
  const { data: categoriesRes, isLoading: categoriesLoading } = useGetCategoriesQuery();

  const productsData = productsRes?.data || [];
  const categories = categoriesRes?.data || [];

  const isLoading = productsLoading || categoriesLoading;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Filter products
  const filteredProducts = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    if (!term) return productsData;
    return productsData.filter((product) => {
      const titleMatch = product.title?.toLowerCase().includes(term);
      const categoryMatch = product.category?.name?.toLowerCase().includes(term);
      return titleMatch || categoryMatch;
    });
  }, [debouncedTerm, productsData]);


  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const getEditedProduct = (product) => {
    const edits = editedFields[product._id];
    return edits ? { ...product, ...edits } : product;
  };

  const changeHandler = (id, field, value) => {
    if (field === 'price' || field === 'stock') {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }
    if (field === 'category') {
      const selectedCategory = categories.find((c) => c._id === value);
      setEditedFields((prev) => ({ ...prev, [id]: { ...prev[id], category: selectedCategory } }));
    } else {
      setEditedFields((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    }
  };

  const saveClickHandler = async (id) => {
    const product = getEditedProduct(productsData.find((p) => p._id === id));
    try {
      await updateProduct({
         id,
        data: {
          title: product.title,
          price: Number(product.price),
          stock: Number(product.stock),
          category: product.category?._id,
        },
      }).unwrap();
      toast.success('Product updated successfully');
      setEditedFields((prev) => { const next = { ...prev }; delete next[id]; return next; });
    } catch (error) {
      toast.error(error?.data?.message || 'Error updating product');
    } finally {
      setEditingRow(null);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Error deleting product');
    }
  };

  const displayValue = (p, field) => {
    const product = getEditedProduct(p);
    if (field === 'price') return `$${Number(product[field]).toFixed(2)}`;
    if (field === 'category') return product.category?.name;
    return product[field];
  };

  if (isLoading) return <ProdcutsTableLoading />;

  return (
    <>
      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductForm
          categories={categories}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0 mb-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
          <h2 className='text-lg md:text-xl font-semibold text-text-secondary text-center md:text-left'>
            Products List
          </h2>
          <div className='flex flex-col-reverse md:flex-row items-center gap-5'>
            <button
              onClick={() => setShowAddModal(true)}
              className='flex items-center gap-2 bg-primary text-text-theme border border-gray-700 rounded-lg px-4 py-2 hover:bg-secondary hover:text-text-primary transition-colors text-sm'
            >
              <GoPlus size={20} className='text-text-theme' />
              Add Product
            </button>
            <div className='relative w-full md:w-auto'>
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text"
                placeholder='Search Products...'
                className='bg-secondary text-text-theme placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm'
              />
              <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='relative h-100 overflow-auto'>
          <table className='min-w-full'>
            <thead className="sticky -top-px z-20 bg-primary md:border-b border-gray-700">
              <tr>
                {['Image', 'Product ID', 'Title', 'Category', 'Price', 'Stock', 'Actions'].map((header) => (
                  <th key={header} className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell'>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-700'>
              {filteredProducts.map((product) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  key={product._id}
                  className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0 ${editingRow === product._id ? 'bg-secondary' : ''}`}
                >
                  {/* Mobile */}
                  <td className='md:hidden px-3 py-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <Image src={product.images?.[0] || '/placeholder.jpg'} alt={product.title} width={36} height={36} className='w-10 h-10 rounded-full object-cover bg-bg-theme' />
                        <div>
                          <div className='text-sm font-medium text-text-secondary line-clamp-1'>{product.title}</div>
                          <div className='text-xs text-text-primary'>ID: {product._id}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <button className='text-indigo-500 hover:text-indigo-300' onClick={() => editingRow === product._id ? saveClickHandler(product._id) : setEditingRow(product._id)}>
                          {editingRow === product._id ? <Save size={16} /> : <Edit size={16} />}
                        </button>
                        <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(product._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className='mt-2 text-xs text-text-primary space-y-1'>
                      <div className='capitalize'>
                        category:{' '}
                        {editingRow === product._id ? (
                          <select value={getEditedProduct(product).category?._id} onChange={(e) => changeHandler(product._id, 'category', e.target.value)} className='bg-secondary text-text-theme border border-gray-500 rounded px-1 py-0.5 text-xs outline-none ml-1'>
                            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                          </select>
                        ) : product.category?.name}
                      </div>
                      {['title', 'price', 'stock'].map((field) => (
                        <div key={field} className='capitalize'>
                          {field}:{' '}
                          {editingRow === product._id ? (
                            <input className='bg-transparent text-text-theme border border-gray-400 w-20 text-center text-xs ml-1' type="text" value={getEditedProduct(product)[field]} onChange={(e) => changeHandler(product._id, field, e.target.value)} />
                          ) : displayValue(product, field)}
                        </div>
                      ))}
                    </div>
                  </td>
                  {/* Desktop */}
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                    <Image src={product.images?.[0] || '/placeholder.jpg'} alt={product.title} width={40} height={40} className='w-12 h-12 rounded-full object-cover bg-bg-theme p-1' />
                  </td>
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>{product._id}</td>
                  {['title', 'category', 'price', 'stock'].map((field) => (
                    <td key={field} className={`hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary max-w-[200px] ${editingRow === product._id ? 'border-x border-gray-400' : 'border-b border-gray-700'} ${field === 'category' ? '' : 'truncate'}`}>
                      {editingRow === product._id ? (
                        field === 'category' ? (
                          <select value={getEditedProduct(product).category?._id} onChange={(e) => changeHandler(product._id, 'category', e.target.value)} className='bg-secondary text-text-theme border border-gray-500 rounded px-2 py-1 text-sm outline-none'>
                            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                          </select>
                        ) : (
                          <input type="text" value={getEditedProduct(product)[field]} onChange={(e) => changeHandler(product._id, field, e.target.value)} className='bg-transparent text-text-theme border-none outline-none w-full' />
                        )
                      ) : displayValue(product, field)}
                    </td>
                  ))}
                  <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm border-b border-gray-700'>
                    <div className='flex items-center gap-3'>
                      <button className='text-indigo-500 hover:text-indigo-300' onClick={() => editingRow === product._id ? saveClickHandler(product._id) : setEditingRow(product._id)}>
                        {editingRow === product._id ? <Save size={18} /> : <Edit size={18} />}
                      </button>
                      <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(product._id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ProductsTable;