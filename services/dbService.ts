import { Order, CustomerCourierStats, CourierConfig, StoreCredentials } from '../types';

// অটোমেটিক এনভায়রনমেন্ট ডিটেকশন
const isProduction = (import.meta as any).env.PROD;

const API_BASE_URL = isProduction 
  ? './backend/api.php' 
  : 'http://localhost/bd_logistics_hub/backend/api.php'; 

export const fetchOrdersFromDB = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=get_orders`);
    const text = await response.text();
    
    try {
        const data = JSON.parse(text);
        if (data.error) {
            console.error("Backend Error:", data.error);
            return [];
        }
        return data.map((item: any) => ({
          id: item.order_number,
          date: item.order_date,
          customer: {
            id: item.customer_id || 'cus_' + Math.random().toString(36).substring(2, 11),
            name: item.customer_name,
            phone: item.customer_phone,
            address: item.customer_address,
            city: item.city || ''
          },
          total: parseFloat(item.total_amount),
          items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items || [],
          status: item.status,
          courier: {
            provider: item.courier_provider || 'None',
            trackingId: item.courier_tracking_id,
            status: item.courier_status || 'Not Assigned',
            riderName: item.rider_name,
            riderPhone: item.rider_phone,
            riderNote: item.rider_note
          }
        }));
    } catch (e) {
        console.error("Invalid JSON response:", text);
        return [];
    }
  } catch (error) {
    console.error("Failed to fetch orders from DB:", error);
    return [];
  }
};

export const fetchCustomerStatsFromDB = async (phone: string): Promise<CustomerCourierStats | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=customer_stats&phone=${phone}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
};

// --- CONFIGURATION ---

export const saveCourierConfigToDB = async (config: CourierConfig): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}?action=save_courier_config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: config.id,
                name: config.name,
                connected: config.connected,
                credentials: config.credentials
            })
        });

        const text = await response.text();
        let result;
        try { result = JSON.parse(text); } catch (e) {}

        if (!response.ok) {
            const errorMsg = result?.error || text.substring(0, 300).replace(/<[^>]*>?/gm, ''); 
            return { success: false, message: `Server Error (${response.status}): ${errorMsg}` };
        }

        if (result && result.success) return { success: true };
        return { success: false, message: result?.error || 'Unknown server error' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Network request failed' };
    }
};

export const getCourierConfigsFromDB = async (): Promise<any[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}?action=get_courier_configs`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};

export const saveStoreConfigToDB = async (config: StoreCredentials): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}?action=save_store_config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        const text = await response.text();
        let result;
        try { result = JSON.parse(text); } catch (e) {}

        if (!response.ok) {
            if (response.status === 404) return { success: false, message: 'API file not found (404).' };
            const detailedError = result?.error || text.substring(0, 300).replace(/<[^>]*>?/gm, '');
            return { success: false, message: `Server Error (${response.status}): ${detailedError}` };
        }

        if (result && result.success) return { success: true };
        return { success: false, message: result?.error || 'Database did not return success status.' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Network Connection Error' };
    }
};

export const getStoreConfigFromDB = async (): Promise<StoreCredentials | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}?action=get_store_config`);
        if (!response.ok) return null;
        const data = await response.json();
        if (data && data.url) return data as StoreCredentials;
        return null;
    } catch (error) {
        return null;
    }
};

// --- SYNC ---

export const syncOrdersFromWooCommerce = async (): Promise<{ success: boolean; message?: string; count?: number }> => {
    try {
        const response = await fetch(`${API_BASE_URL}?action=sync_from_woo`);
        const text = await response.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error("Sync response invalid JSON:", text);
            return { success: false, message: "Invalid response from server" };
        }

        if (result.success) {
            return { success: true, count: result.count, message: result.message };
        } else {
            return { success: false, message: result.message || result.error };
        }
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};