import React, { useState } from 'react';
import { COURIER_CONFIGS } from '../services/mockData';
import { CheckCircle, XCircle, Key, ExternalLink, Settings, Save, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CourierConfig } from '../types';

export const CourierIntegration: React.FC = () => {
  const [couriers, setCouriers] = useState<CourierConfig[]>(COURIER_CONFIGS);
  const [selectedCourier, setSelectedCourier] = useState<CourierConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const openConfigModal = (courier: CourierConfig) => {
    setSelectedCourier(courier);
    setFormData(courier.credentials || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourier(null);
    setFormData({});
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourier) return;

    setIsSaving(true);

    // Simulate API Validation
    setTimeout(() => {
      setCouriers(prev => prev.map(c => 
        c.id === selectedCourier.id 
          ? { ...c, connected: true, credentials: formData } 
          : c
      ));
      setIsSaving(false);
      closeModal();
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    if (confirm('Are you sure you want to disconnect? This will stop automatic order syncing.')) {
      setCouriers(prev => prev.map(c => 
        c.id === id 
          ? { ...c, connected: false, credentials: undefined } 
          : c
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Courier Integration</h2>
          <p className="text-slate-500 mt-1">Configure API connections for Bangladeshi logistics providers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {couriers.map((courier) => (
          <div key={courier.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                    <img src={courier.logo} alt={courier.name} className="w-full h-full object-contain" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                  courier.connected ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}>
                  {courier.connected ? (
                    <><CheckCircle className="w-3 h-3" /> <span>Connected</span></>
                  ) : (
                    <><XCircle className="w-3 h-3" /> <span>Not Connected</span></>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-bold text-slate-800">{courier.name}</h3>
                   <a href={courier.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600">
                     <ExternalLink className="w-4 h-4" />
                   </a>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">{courier.description}</p>
              </div>

              {courier.connected && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-start space-x-2">
                   <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5" />
                   <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-medium text-slate-500">API Status</p>
                      <p className="text-sm font-semibold text-slate-700">Active & Ready</p>
                   </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              {courier.connected ? (
                <>
                  <button 
                    onClick={() => openConfigModal(courier)}
                    className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={() => handleDisconnect(courier.id)}
                    className="py-2 px-3 rounded-lg text-sm font-medium bg-white border border-red-100 text-red-600 hover:bg-red-50 transition-colors"
                    title="Disconnect"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => openConfigModal(courier)}
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Setup Integration</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Config Modal */}
      {isModalOpen && selectedCourier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-3">
                <img src={selectedCourier.logo} alt={selectedCourier.name} className="w-8 h-8 object-contain" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Configure {selectedCourier.name}</h3>
                  <p className="text-xs text-slate-500">Enter your API credentials below</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Developer Credentials Required</p>
                  <p className="opacity-90">
                    You need to register as a merchant on the <a href={selectedCourier.website} target="_blank" rel="noreferrer" className="underline font-semibold hover:text-blue-900">official {selectedCourier.name} website</a> to get these keys.
                  </p>
                </div>
              </div>

              <form id="configForm" onSubmit={handleSaveConfig} className="space-y-4">
                {selectedCourier.authFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    {field.helpText && (
                      <p className="text-xs text-slate-500 mt-1">{field.helpText}</p>
                    )}
                  </div>
                ))}
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 border border-transparent transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="configForm"
                disabled={isSaving}
                className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Connection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};