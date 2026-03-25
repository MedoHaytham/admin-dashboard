/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Edit, Save, Search, Trash2 } from 'lucide-react';
import ClientsTableLoading from './ClientsTableLoading';
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '../features/userSlice';

const countries = [
  'egypt', 'saudi arabia', 'uae', 'qatar', 'american', 'british',
  'yemen', 'syria', 'lebanon', 'jordan', 'palestine', 'iraq',
  'morocco', 'algeria', 'tunisia', 'libya', 'sudan', 'somalia',
  'djibouti', 'comoros'
];

function ClientsTable() {

  const { data: clients, isLoading } = useGetUsersQuery();

  const clientsData = clients?.data.map((client) => ({
    id: client._id,
    name: client.firstName + ' ' + client.lastName,
    email: client.email,
    phone: client.phone,
    country: client.country,
    role: client.role,
  })) || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editedFields, setEditedFields] = useState({});


  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Filter clients
  const filteredClients = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    if (!term) return clientsData;
    return clientsData.filter((client) => {
      const nameMatch = client.name?.toLowerCase().includes(term);
      const emailMatch = client.email?.toLowerCase().includes(term);
      return nameMatch || emailMatch;
    });
  }, [debouncedTerm, clientsData]);

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const getEditedClient = (client) => {
    const edits = editedFields[client.id];
    return edits ? { ...client, ...edits } : client;
  };

  // Change local state
  const changeHandler = (id, field, value) => {
    setEditedFields((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  // Save — send API request
  const saveClickHandler = async (id) => {
    const client = getEditedClient(clientsData.find((c) => c.id === id));
    try {
      await updateUser({
        userId: id,
        firstName: client.name.split(' ')[0],
        lastName: client.name.split(' ').slice(1).join(' '),
        email: client.email,
        phone: client.phone,
        country: client.country,
        role: client.role,
      }).unwrap();
      toast.success('Client updated successfully');
      setEditedFields((prev) => { const next = { ...prev }; delete next[id]; return next; });
    } catch (error) {
      toast.error(error?.data?.message || 'Error updating client');
    } finally {
      setEditingRow(null);
    }
  };

  // Delete — send API request
  const deleteHandler = async (id) => {
    if (!window.confirm('Are you sure you want to remove this client?')) return;
    try {
      await deleteUser(id).unwrap();
      toast.success('Client deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Error deleting client');
    }
  };

  if (isLoading) return <ClientsTableLoading />;

  return (
    <div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-border-primary mx-2 sm:mx-0 mb-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0'>
        <h2 className='text-lg sm:text-xl font-semibold text-text-secondary text-center sm:text-left'>Clients List</h2>
        <div className='relative w-full sm:w-auto'>
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            type="text"
            placeholder='Search Clients...'
            className='bg-secondary text-text-theme placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm'
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
      </div>

      {/* Table */}
      <div className='relative h-100 overflow-auto'>
        <table className='min-w-full'>
          <thead className="sticky -top-px z-20 bg-primary sm:border-b border-gray-700">
            <tr>
              {['Name', 'Email', 'Phone Number', 'Country', 'Role', 'Actions'].map((header) => (
                <th key={header} className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-700'>
            {filteredClients.map((client) => (
              <motion.tr
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={`flex flex-col sm:table-row mb-4 sm:mb-0 border-b sm:border-b-0 border-gray-700 sm:border-none p-2 sm:p-0 ${editingRow === client.id ? 'bg-secondary ring-1 ring-gray-500' : ''}`}
              >
                {/* ===== Mobile ===== */}
                <td className='sm:hidden px-3 py-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-1'>
                      <div className='text-sm font-medium text-text-secondary'>
                        {editingRow === client.id ? (
                          <input
                            className='bg-transparent text-text-theme border border-gray-400 w-40 p-1 text-center text-xs'
                            type="text" value={getEditedClient(client).name}
                            onChange={(e) => changeHandler(client.id, 'name', e.target.value)}
                          />
                        ) : client.name}
                      </div>
                      <div className='text-xs text-text-primary'>
                        {editingRow === client.id ? (
                          <input
                            className='bg-transparent text-text-theme border border-gray-400 w-40 p-1 text-center text-xs'
                            type="text" value={getEditedClient(client).email}
                            onChange={(e) => changeHandler(client.id, 'email', e.target.value)}
                          />
                        ) : client.email}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        className='text-indigo-500 hover:text-indigo-300'
                        onClick={() => editingRow === client.id ? saveClickHandler(client.id) : setEditingRow(client.id)}
                      >
                        {editingRow === client.id ? <Save size={16} /> : <Edit size={16} />}
                      </button>
                      <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(client.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className='mt-2 text-xs text-text-primary space-y-1'>
                    <div>Phone:{' '}
                      {editingRow === client.id ? (
                        <input
                          className='bg-transparent text-text-theme border border-gray-400 w-28 p-1 text-center text-xs ml-1'
                          type="text" value={getEditedClient(client).phone}
                          onChange={(e) => changeHandler(client.id, 'phone', e.target.value)}
                        />
                      ) : client.phone}
                    </div>
                    <div className='flex items-center gap-1'>Country:{' '}
                      {editingRow === client.id ? (
                        <select
                          className='bg-secondary text-text-theme border border-gray-500 rounded px-1 py-0.5 text-xs outline-none ml-1 capitalize'
                          value={getEditedClient(client).country}
                          onChange={(e) => changeHandler(client.id, 'country', e.target.value)}
                        >
                          {countries.map((c) => (
                            <option key={c} value={c} className='capitalize'>{c}</option>
                          ))}
                        </select>
                      ) : <span className='capitalize ml-1'>{client.country}</span>}
                    </div>
                    <div className='flex items-center gap-1'>Role:{' '}
                      {editingRow === client.id ? (
                        <select
                          className='bg-secondary text-text-theme border border-gray-500 rounded px-1 py-0.5 text-xs outline-none ml-1'
                          value={getEditedClient(client).role}
                          onChange={(e) => changeHandler(client.id, 'role', e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="user">User</option>
                        </select>
                      ) : client.role}
                    </div>
                  </div>
                </td>

                {/* ===== Desktop ===== */}
                {/* Name */}
                <td className='hidden sm:table-cell px-6 py-4 whitespace-nowrap border-b border-gray-700'>
                  <div className='text-sm font-medium text-text-secondary'>
                    {editingRow === client.id ? (
                      <input
                        className='bg-transparent text-text-theme w-full max-w-60 border-none outline-none'
                        type="text" value={getEditedClient(client).name}
                        onChange={(e) => changeHandler(client.id, 'name', e.target.value)}
                      />
                    ) : client.name}
                  </div>
                </td>
                {/* Email, Phone */}
                {['email', 'phone'].map((field) => (
                  <td key={field} className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700 ${editingRow === client.id ? 'ring-1 ring-gray-500' : ''}`}>
                    {editingRow === client.id ? (
                      <input
                        className='bg-transparent text-text-theme w-full max-w-60 border-none outline-none'
                        type="text" value={getEditedClient(client)[field]}
                        onChange={(e) => changeHandler(client.id, field, e.target.value)}
                      />
                    ) : client[field]}
                  </td>
                ))}
                {/* Country */}
                <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700 capitalize`}>
                  {editingRow === client.id ? (
                    <select
                      className='bg-secondary text-text-theme border border-gray-500 rounded px-2 py-1 text-sm outline-none capitalize'
                      value={getEditedClient(client).country}
                      onChange={(e) => changeHandler(client.id, 'country', e.target.value)}
                    >
                      {countries.map((c) => (
                        <option key={c} value={c} className='capitalize'>{c}</option>
                      ))}
                    </select>
                  ) : client.country}
                </td>
                {/* Role */}
                <td className='hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                  {editingRow === client.id ? <select
                    className='bg-secondary text-text-theme border border-gray-500 rounded px-2 py-1 text-sm outline-none'
                    value={getEditedClient(client).role}
                    onChange={(e) => changeHandler(client.id, 'role', e.target.value)}
                    disabled={editingRow !== client.id}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                  : client.role }
                </td>
                {/* Actions */}
                <td className='hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-primary border-b border-gray-700'>
                  <div className='flex items-center gap-3'>
                    <button
                      className='text-indigo-500 hover:text-indigo-300'
                      onClick={() => editingRow === client.id ? saveClickHandler(client.id) : setEditingRow(client.id)}
                    >
                      {editingRow === client.id ? <Save size={18} /> : <Edit size={18} />}
                    </button>
                    <button className='text-red-500 hover:text-red-300' onClick={() => deleteHandler(client.id)}>
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
  );
}

export default ClientsTable;