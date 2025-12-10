import React, { useState } from 'react';
import { Order, OrderStatus, CourierStatus } from '../types';
import { Search, Filter, MoreHorizontal, Eye, RefreshCw } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onSync: () => void;
  isSyncing: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onViewOrder, onSync, isSyncing }) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-700';
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getCourierStatusColor = (status: CourierStatus) => {
    if (status === CourierStatus.DELIVERED) return 'text-green-600';
    if (status === CourierStatus.NOT_ASSIGNED) return 'text-slate-400';
    if (status === CourierStatus.RETURNED) return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      {/* Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          <button 
            onClick={onSync}
            disabled={isSyncing}
            className={`p-1.5 rounded-full hover:bg-slate-100 transition-all ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-400'}`}
            title="Sync from WooCommerce"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID, Name, Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value={OrderStatus.PENDING}>Pending</option>
              <option value={OrderStatus.PROCESSING}>Processing</option>
              <option value={OrderStatus.COMPLETED}>Completed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 relative">
        {isSyncing && (
           <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm">
             <div className="flex flex-col items-center">
               <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
               <span className="text-sm font-medium text-blue-600">Fetching orders from WordPress...</span>
             </div>
           </div>
        )}
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Courier</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{order.customer.name}</div>
                    <div className="text-xs text-slate-500">{order.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">৳ {order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{order.courier.provider !== 'None' ? order.courier.provider : '-'}</span>
                      <span className={`text-xs font-semibold ${getCourierStatusColor(order.courier.status)}`}>
                        {order.courier.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onViewOrder(order)}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No orders found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};