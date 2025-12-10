import { Order, CustomerCourierStats } from '../types';

// আপনার হোস্টিং এর আসল URL এখানে বসাবেন
const API_BASE_URL = 'http://localhost/bd_logistics_hub/backend/api.php'; 

export const fetchOrdersFromDB = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=get_orders`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // এখানে ডাটাবেসের ডাটাকে ফ্রন্টএন্ডের ফরম্যাটে ম্যাপ করতে হবে
    return data.map((item: any) => ({
      id: item.order_number,
      date: item.order_date,
      customer: {
        id: item.customer_id,
        name: item.customer_name,
        phone: item.customer_phone,
        address: item.customer_address,
        city: item.city || ''
      },
      total: parseFloat(item.total_amount),
      items: JSON.parse(item.items || '[]'),
      status: item.status,
      courier: {
        provider: item.courier_provider,
        trackingId: item.courier_tracking_id,
        status: item.courier_status,
        riderName: item.rider_name,
        riderPhone: item.rider_phone,
        riderNote: item.rider_note
      }
    }));
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
