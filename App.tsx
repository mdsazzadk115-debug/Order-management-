import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OrderList } from './components/OrderList';
import { CourierIntegration } from './components/CourierIntegration';
import { StatsCard } from './components/StatsCard';
import { OrderModal } from './components/OrderModal';
import { StoreIntegration } from './components/StoreIntegration';
import { MOCK_ORDERS, FETCHED_ORDERS } from './services/mockData';
import { fetchOrdersFromDB, getStoreConfigFromDB, syncOrdersFromWooCommerce, assignOrderToCourier } from './services/dbService';
import { Order, CourierProvider, CourierStatus, OrderStatus, StoreCredentials } from './types';
import { Package, TrendingUp, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

type View = 'dashboard' | 'orders' | 'couriers' | 'store';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hasFetchedRealData, setHasFetchedRealData] = useState(false);
  
  // Store Config State
  const [storeConfig, setStoreConfig] = useState<StoreCredentials>({
    url: '',
    consumerKey: '',
    consumerSecret: '',
    isConnected: false
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Load store config from DB on startup
  useEffect(() => {
    const loadStoreConfig = async () => {
        const config = await getStoreConfigFromDB();
        if (config) {
            setStoreConfig(config);
        }
    };
    loadStoreConfig();
  }, []);

  // Function to sync orders
  const handleSyncOrders = async () => {
    if (!storeConfig.isConnected) {
      alert("Please connect your WooCommerce store first!");
      setCurrentView('store');
      return;
    }

    setIsSyncing(true);
    
    try {
      // 1. Trigger Server Sync (Fetch from Woo -> Save to DB)
      console.log("Starting server sync...");
      const syncResult = await syncOrdersFromWooCommerce();
      
      if (!syncResult.success) {
          console.warn("Sync Warning:", syncResult.message);
          if (syncResult.message?.includes("API Error")) {
             alert(`Sync Failed: ${syncResult.message}`);
          }
      } else {
          console.log(`Synced ${syncResult.count} orders successfully.`);
      }

      // 2. Fetch from DB (Now it should have data)
      const dbOrders = await fetchOrdersFromDB();
      
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
        setHasFetchedRealData(true);
      } else {
        console.warn("No data found in DB even after sync.");
        if (!hasFetchedRealData) {
           alert("Database connection successful but no orders found in your store (or sync failed). Showing DEMO fetched data for visualization.");
           setOrders(FETCHED_ORDERS);
           setHasFetchedRealData(true);
        }
      }
    } catch (error) {
      console.error("Sync process failed:", error);
      alert("Sync encountered an error. Check console.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAssignCourier = async (orderId: string, provider: CourierProvider) => {
    // 1. Call Backend API
    const result = await assignOrderToCourier(orderId, provider);
    
    if (result.success) {
        // 2. Refresh Orders from DB
        const dbOrders = await fetchOrdersFromDB();
        setOrders(dbOrders);
        
        // 3. Update Selected Order View
        const updatedOrder = dbOrders.find(o => o.id === orderId);
        if (updatedOrder) setSelectedOrder(updatedOrder);
        
        alert(result.message || "Assigned successfully!");
    } else {
        alert("Failed to assign courier: " + result.message);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${hasFetchedRealData ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {hasFetchedRealData ? 'Live Mode' : 'Demo Mode'}
                  </span>
                </div>
                {storeConfig.isConnected ? (
                   <p className="text-sm text-green-600 flex items-center mt-1"><CheckCircle2 className="w-3 h-3 mr-1"/> Connected to: {storeConfig.url}</p>
                ) : (
                   <p className="text-sm text-orange-500 flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/> Demo Data - Store not connected</p>
                )}
              </div>
              <button 
                onClick={handleSyncOrders}
                disabled={isSyncing}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
              >
                 <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                 <span>{isSyncing ? 'Syncing Data...' : 'Sync Orders'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Total Orders" 
                value={orders.length} 
                icon={Package} 
                colorClass="bg-blue-500 text-blue-500" 
                trend={hasFetchedRealData ? "Updated just now" : "Sample Data"}
                trendUp={true}
              />
              <StatsCard 
                title="Pending Processing" 
                value={orders.filter(o => o.status === OrderStatus.PENDING).length} 
                icon={AlertCircle} 
                colorClass="bg-yellow-500 text-yellow-500" 
              />
              <StatsCard 
                title="In Transit" 
                value={orders.filter(o => o.courier.status === CourierStatus.IN_TRANSIT).length} 
                icon={TrendingUp} 
                colorClass="bg-purple-500 text-purple-500" 
              />
              <StatsCard 
                title="Completed" 
                value={orders.filter(o => o.status === OrderStatus.COMPLETED).length} 
                icon={CheckCircle2} 
                colorClass="bg-green-500 text-green-500" 
                trend="This Month"
                trendUp={true}
              />
            </div>

            <div className="mt-8">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
                  <button onClick={() => setCurrentView('orders')} className="text-blue-600 font-medium hover:underline text-sm">View All</button>
               </div>
               <OrderList 
                  orders={orders.slice(0, 5)} 
                  onViewOrder={setSelectedOrder} 
                  onSync={handleSyncOrders}
                  isSyncing={isSyncing}
               />
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
                 <p className="text-sm text-slate-500 mt-1">
                    {hasFetchedRealData ? `Showing ${orders.length} orders from Database` : 'Showing sample data. Connect store to see real orders.'}
                 </p>
              </div>
              <button 
                onClick={handleSyncOrders}
                disabled={isSyncing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync New Orders'}</span>
              </button>
            </div>
            <OrderList 
              orders={orders} 
              onViewOrder={setSelectedOrder} 
              onSync={handleSyncOrders}
              isSyncing={isSyncing}
            />
          </div>
        );
      case 'couriers':
        return <CourierIntegration />;
      case 'store':
        return <StoreIntegration config={storeConfig} onSave={setStoreConfig} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {renderContent()}
      </main>

      {selectedOrder && (
        <OrderModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onAssignCourier={handleAssignCourier}
        />
      )}
    </div>
  );
};

export default App;