import { Order, CustomerCourierStats } from '../types';

// অটোমেটিক এনভায়রনমেন্ট ডিটেকশন
// ডেভেলপমেন্ট মোডে আপনার XAMPP বা লোকাল সার্ভারের পাথ ব্যবহার করবে
// প্রোডাকশন (বিল্ড) মোডে রিলেটিভ পাথ ব্যবহার করবে
const isProduction = (import.meta as any).env.PROD;

const API_BASE_URL = isProduction 
  ? './backend/api.php' 
  : 'http://localhost/bd_logistics_hub/backend/api.php'; 

export const fetchOrdersFromDB = async (): Promise<Order[]> => {
  try {
    console.log(`Fetching from: ${API_BASE_URL}?action=get_orders`);
    const response = await fetch(`${API_BASE_URL}?action=get_orders`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    // অনেক সময় পিএইচপি এরর HTML রিটার্ন করে, তাই JSON পার্স করার আগে চেক করা ভালো
    try {
        const data = JSON.parse(text);
        
        // যদি ডাটাবেজ থেকে এরর মেসেজ আসে
        if (data.error) {
            console.error("Backend Error:", data.error);
            return [];
        }

        // ডাটাবেসের ডাটাকে ফ্রন্টএন্ডের ফরম্যাটে ম্যাপ করা
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