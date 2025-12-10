import React from 'react';
import { LayoutDashboard, Package, Truck, Settings, LogOut, FileText, ShoppingBag } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'orders' | 'couriers' | 'store';
  onNavigate: (view: 'dashboard' | 'orders' | 'couriers' | 'store') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItemClass = (view: string) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
      currentView === view
        ? 'bg-blue-50 text-blue-600 font-medium'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-10">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800">BD Logistics</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div onClick={() => onNavigate('dashboard')} className={navItemClass('dashboard')}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </div>
        <div onClick={() => onNavigate('store')} className={navItemClass('store')}>
          <ShoppingBag className="w-5 h-5" />
          <span>Store Setup</span>
        </div>
        <div onClick={() => onNavigate('orders')} className={navItemClass('orders')}>
          <Package className="w-5 h-5" />
          <span>Orders</span>
        </div>
        <div onClick={() => onNavigate('couriers')} className={navItemClass('couriers')}>
          <Settings className="w-5 h-5" />
          <span>Courier Setup</span>
        </div>
        
        <div className="pt-4 mt-4 border-t border-slate-100">
           <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Reports
           </div>
           <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 cursor-not-allowed opacity-70">
              <FileText className="w-5 h-5" />
              <span>Sales Report</span>
           </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};