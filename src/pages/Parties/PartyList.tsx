import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Phone, Mail, MapPin } from 'lucide-react';

const mockParties = [
  {
    id: 1,
    name: 'ABC Electronics Ltd.',
    type: 'supplier',
    email: 'contact@abcelectronics.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business St, New York, NY 10001',
    balance: 15420.50,
    status: 'active',
    lastTransaction: '2024-01-15',
  },
  {
    id: 2,
    name: 'John Smith',
    type: 'customer',
    email: 'john.smith@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Main St, Los Angeles, CA 90210',
    balance: -2340.75,
    status: 'active',
    lastTransaction: '2024-01-14',
  },
  {
    id: 3,
    name: 'TechCorp Solutions',
    type: 'supplier',
    email: 'sales@techcorp.com',
    phone: '+1 (555) 456-7890',
    address: '789 Tech Ave, San Francisco, CA 94105',
    balance: 8750.00,
    status: 'active',
    lastTransaction: '2024-01-13',
  },
];

export const PartyList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredParties = mockParties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         party.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || party.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parties</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customers and suppliers</p>
        </div>
        <button
          onClick={() => navigate('/parties/new')}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Party
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search parties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="customer">Customers</option>
              <option value="supplier">Suppliers</option>
            </select>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Parties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParties.map((party, index) => (
          <motion.div
            key={party.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Party Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {party.name}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  party.type === 'customer'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {party.type === 'customer' ? 'Customer' : 'Supplier'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/parties/${party.id}/edit`)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{party.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                <span>{party.phone}</span>
              </div>
              <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{party.address}</span>
              </div>
            </div>

            {/* Balance */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Balance:</span>
                <span className={`font-semibold ${
                  party.balance >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  ${Math.abs(party.balance).toFixed(2)} {party.balance < 0 ? '(Due)' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Transaction:</span>
                <span className="text-sm text-gray-900 dark:text-white">{party.lastTransaction}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredParties.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No parties found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first customer or supplier.'
            }
          </p>
          {!searchTerm && selectedType === 'all' && (
            <button
              onClick={() => navigate('/parties/new')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Party
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};