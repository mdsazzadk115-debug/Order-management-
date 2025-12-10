import React, { useState } from 'react';
import { ShoppingBag, Key, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { StoreCredentials } from '../types';

interface StoreIntegrationProps {
  config: StoreCredentials;
  onSave: (config: StoreCredentials) => void;
}

export const StoreIntegration: React.FC<StoreIntegrationProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<StoreCredentials>(config);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof StoreCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API verification delay
    setTimeout(() => {
      onSave({ ...formData, isConnected: true });
      setIsSaving(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    onSave({ ...formData, isConnected: false });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Store Integration</h2>
          <p className="text-slate-500 mt-1">Connect your WordPress/WooCommerce website to import orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">WooCommerce</h3>
              <p className="text-sm text-slate-500">The most popular e-commerce platform for WordPress.</p>
            </div>
          </div>
          {config.isConnected && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Connected</span>
            </div>
          )}
        </div>

        <div className="p-8">
          {!config.isConnected ? (
            <form onSubmit={handleConnect} className="space-y-6 max-w-lg">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  To connect, go to your WordPress Dashboard {'>'} WooCommerce {'>'} Settings {'>'} Advanced {'>'} REST API and generate a new key with Read/Write permissions.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    required
                    placeholder="https://your-site.com"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Consumer Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.consumerKey}
                    onChange={(e) => handleChange('consumerKey', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Consumer Secret</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.consumerSecret}
                    onChange={(e) => handleChange('consumerSecret', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    'Connect Store'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Website</p>
                    <p className="font-medium text-slate-800">{formData.url}</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</p>
                    <p className="font-medium text-green-600">Active & Syncing</p>
                 </div>
              </div>
              
              <div>
                 <button
                   onClick={handleDisconnect}
                   className="text-red-600 hover:bg-red-50 border border-red-200 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                 >
                   Disconnect Store
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};