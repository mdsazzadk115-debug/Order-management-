import React, { useState, useEffect } from 'react';
import { Order, CourierProvider, CourierStatus, CustomerCourierStats } from '../types';
import { X, Truck, User, MapPin, Package, StickyNote, Activity, ShieldCheck, AlertTriangle, History } from 'lucide-react';
import { getMockCustomerStats } from '../services/mockData';

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
  onAssignCourier: (orderId: string, provider: CourierProvider) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ order, onClose, onAssignCourier }) => {
  const [selectedProvider, setSelectedProvider] = useState<CourierProvider>(CourierProvider.PATHAO);
  const [customerStats, setCustomerStats] = useState<CustomerCourierStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (order) {
      setLoadingStats(true);
      getMockCustomerStats(order.customer.phone).then(stats => {
        setCustomerStats(stats);
        setLoadingStats(false);
      });
    }
  }, [order]);

  if (!order) return null;

  const isAssigned = order.courier.provider !== CourierProvider.NONE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div>
             <h3 className="text-xl font-bold text-slate-800">Order {order.id}</h3>
             <p className="text-sm text-slate-500">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Customer & Items */}
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                <User className="w-4 h-4 mr-2" /> Customer Details
              </h4>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                <p className="font-medium text-slate-800">{order.customer.name}</p>
                <p className="text-sm text-slate-600">{order.customer.phone}</p>
                <div className="flex items-start text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-1 mt-0.5 shrink-0" />
                  <span>{order.customer.address}, {order.customer.city}</span>
                </div>
              </div>
            </div>

            {/* Delivery Success Analysis (Fraud Check) */}
            <div>
               <h4 className="flex items-center text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                <History className="w-4 h-4 mr-2" /> Delivery Success Analysis
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                {loadingStats ? (
                  <div className="flex items-center justify-center py-6 space-x-2 text-slate-400">
                    <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm">Analyzing courier history...</span>
                  </div>
                ) : customerStats ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                         {customerStats.riskLabel === 'Safe' ? (
                           <ShieldCheck className="w-5 h-5 text-emerald-500" />
                         ) : (
                           <AlertTriangle className="w-5 h-5 text-rose-500" />
                         )}
                         <span className={`text-sm font-bold ${
                           customerStats.riskLabel === 'Safe' ? 'text-emerald-600' : 
                           customerStats.riskLabel === 'Moderate' ? 'text-orange-600' : 'text-rose-600'
                         }`}>
                           {customerStats.riskLabel} Customer
                         </span>
                       </div>
                       <span className="text-xs text-slate-400">Checked via Courier Database</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                       <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                          <p className="text-xs text-slate-500 mb-1">Success Rate</p>
                          <p className={`text-lg font-bold ${
                            customerStats.successRate >= 90 ? 'text-emerald-600' : 
                            customerStats.successRate >= 70 ? 'text-orange-600' : 'text-rose-600'
                          }`}>
                            {customerStats.successRate}%
                          </p>
                       </div>
                       <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                          <p className="text-xs text-slate-500 mb-1">Delivered</p>
                          <p className="text-lg font-bold text-slate-700">{customerStats.delivered}</p>
                       </div>
                       <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                          <p className="text-xs text-slate-500 mb-1">Returned</p>
                          <p className="text-lg font-bold text-rose-600">{customerStats.returned}</p>
                       </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 text-center pt-1">
                       Total {customerStats.totalParcels} parcels handled in network. Last seen: {customerStats.lastOrderDate}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400 text-sm">No history found for this number.</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="flex items-center text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                <Package className="w-4 h-4 mr-2" /> Order Items
              </h4>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                   <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-slate-500">Item</th>
                        <th className="px-4 py-2 text-right font-medium text-slate-500">Qty</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-slate-700">{item}</td>
                          <td className="px-4 py-2 text-right text-slate-700">1</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td className="px-4 py-2 text-slate-800">Total</td>
                        <td className="px-4 py-2 text-right text-slate-800">৳ {order.total}</td>
                      </tr>
                   </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Courier Management */}
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                <Truck className="w-4 h-4 mr-2" /> Courier Management
              </h4>

              {!isAssigned ? (
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg">
                  <p className="text-sm text-blue-800 mb-4 font-medium">This order has not been assigned to a courier yet.</p>
                  
                  <label className="block text-xs font-semibold text-blue-700 mb-1">Select Provider</label>
                  <select 
                    value={selectedProvider} 
                    onChange={(e) => setSelectedProvider(e.target.value as CourierProvider)}
                    className="w-full mb-4 p-2.5 rounded border-blue-200 border bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={CourierProvider.PATHAO}>Pathao</option>
                    <option value={CourierProvider.REDX}>RedX</option>
                    <option value={CourierProvider.STEADFAST}>Steadfast</option>
                    <option value={CourierProvider.PAPERFLY}>Paperfly</option>
                  </select>

                  <button 
                    onClick={() => onAssignCourier(order.id, selectedProvider)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center"
                  >
                    Send Request to {selectedProvider}
                  </button>
                  
                  {customerStats && customerStats.riskLabel !== 'Safe' && (
                     <div className="mt-3 text-xs text-rose-600 flex items-start bg-rose-50 p-2 rounded">
                        <AlertTriangle className="w-4 h-4 mr-1 shrink-0" />
                        <span>Warning: High return rate detected. Verify via phone before shipping.</span>
                     </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-700">{order.courier.provider}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.courier.status === CourierStatus.DELIVERED ? 'bg-green-100 text-green-700' :
                      order.courier.status === CourierStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.courier.status}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tracking ID</span>
                      <span className="font-mono font-medium text-slate-800">{order.courier.trackingId}</span>
                    </div>
                    {order.courier.riderName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Rider</span>
                        <span className="font-medium text-slate-800">{order.courier.riderName}</span>
                      </div>
                    )}
                    {order.courier.riderPhone && (
                       <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Rider Phone</span>
                        <a href={`tel:${order.courier.riderPhone}`} className="text-blue-600 hover:underline">{order.courier.riderPhone}</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Rider Notes Section */}
            <div>
               <h4 className="flex items-center text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                <StickyNote className="w-4 h-4 mr-2" /> Rider/Courier Notes
              </h4>
              {order.courier.riderNote ? (
                 <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg relative">
                    <p className="text-sm text-slate-700 italic">"{order.courier.riderNote}"</p>
                    <div className="absolute top-2 right-2 text-yellow-400">
                       <Activity className="w-4 h-4" />
                    </div>
                 </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400">No notes from rider yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};