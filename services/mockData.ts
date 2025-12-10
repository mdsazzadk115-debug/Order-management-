import { Order, OrderStatus, CourierStatus, CourierProvider, CourierConfig, CustomerCourierStats } from '../types';

export const MOCK_ORDERS: Order[] = [
  {
    id: '#DEMO-1001',
    date: '2023-10-26',
    customer: {
      id: 'c1',
      name: 'Rahim Uddin (Demo)',
      phone: '+8801711223344',
      address: 'House 12, Road 5, Dhanmondi',
      city: 'Dhaka',
    },
    total: 1250,
    items: ['Premium Panjabi', 'Cap'],
    status: OrderStatus.PROCESSING,
    courier: {
      provider: CourierProvider.PATHAO,
      trackingId: 'PTH-DEMO-1',
      status: CourierStatus.IN_TRANSIT,
      riderName: 'Karim Mia',
      riderPhone: '01900000000',
      riderNote: 'Customer asked to deliver after 5 PM.',
    },
  },
  {
    id: '#DEMO-1002',
    date: '2023-10-27',
    customer: {
      id: 'c2',
      name: 'Sadia Islam (Demo)',
      phone: '+8801811223344',
      address: 'Flat 4A, Green Road',
      city: 'Dhaka',
    },
    total: 3400,
    items: ['Silk Saree', 'Jewelry Box'],
    status: OrderStatus.PENDING,
    courier: {
      provider: CourierProvider.NONE,
      status: CourierStatus.NOT_ASSIGNED,
    },
  },
];

export const FETCHED_ORDERS: Order[] = [
  {
    id: '#WC-59201',
    date: new Date().toISOString().split('T')[0],
    customer: {
      id: 'wc1',
      name: 'MD. Solaiman',
      phone: '+8801755667788',
      address: 'Sector 7, Uttara',
      city: 'Dhaka',
    },
    total: 4500,
    items: ['Wireless Headphone', 'Smart Watch Strap'],
    status: OrderStatus.PENDING,
    courier: {
      provider: CourierProvider.NONE,
      status: CourierStatus.NOT_ASSIGNED,
    },
  },
  {
    id: '#WC-59200',
    date: new Date().toISOString().split('T')[0],
    customer: {
      id: 'wc2',
      name: 'Fariha Tasnim',
      phone: '+8801911223344',
      address: 'Muradpur, Chittagong',
      city: 'Chittagong',
    },
    total: 1200,
    items: ['Cotton Kurti'],
    status: OrderStatus.PROCESSING,
    courier: {
      provider: CourierProvider.PATHAO,
      trackingId: 'PTH-889922',
      status: CourierStatus.PICKED_UP,
    },
  },
  {
    id: '#WC-59199',
    date: '2023-11-14',
    customer: {
      id: 'wc3',
      name: 'Rafiqul Islam',
      phone: '+8801611002233',
      address: 'Housing Estate, Sylhet',
      city: 'Sylhet',
    },
    total: 850,
    items: ['Mens Polo Shirt'],
    status: OrderStatus.COMPLETED,
    courier: {
      provider: CourierProvider.REDX,
      trackingId: 'RDX-112233',
      status: CourierStatus.DELIVERED,
      riderName: 'Sumon',
      riderPhone: '01700000000',
    },
  },
  {
    id: '#WC-59198',
    date: '2023-11-13',
    customer: {
      id: 'wc4',
      name: 'Anika Tabassum',
      phone: '+8801511445566',
      address: 'Banani Road 11',
      city: 'Dhaka',
    },
    total: 2350,
    items: ['Makeup Kit', 'Brush Set'],
    status: OrderStatus.CANCELLED,
    courier: {
      provider: CourierProvider.NONE,
      status: CourierStatus.RETURNED,
    },
  }
];

export const COURIER_CONFIGS: CourierConfig[] = [
  {
    id: 'pathao',
    name: CourierProvider.PATHAO,
    logo: 'https://placehold.co/60x60/DD2C00/FFFFFF?text=P',
    connected: true,
    website: 'https://pathao.com/courier/',
    description: 'The largest logistics network in Bangladesh. Supports instant booking and real-time tracking.',
    authFields: [
      { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter your Pathao Client ID' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'Enter your Client Secret' },
      { key: 'username', label: 'Username/Email', type: 'email', placeholder: 'Registered Email' },
      { key: 'password', label: 'Password', type: 'password', placeholder: 'Pathao Account Password' },
      { key: 'store_id', label: 'Store ID', type: 'text', placeholder: 'Your Store ID (Optional)', helpText: 'If not provided, default store will be used.' }
    ],
    credentials: {
      client_id: 'mypathao_client',
      client_secret: '*******',
      username: 'shop@example.com'
    }
  },
  {
    id: 'redx',
    name: CourierProvider.REDX,
    logo: 'https://placehold.co/60x60/D50000/FFFFFF?text=R',
    connected: true,
    website: 'https://redx.com.bd/',
    description: 'Fastest delivery service with nationwide coverage.',
    authFields: [
      { key: 'access_token', label: 'API Access Token', type: 'password', placeholder: 'Bearer Token from RedX Dashboard', helpText: 'Find this in RedX Dashboard > Settings > API' }
    ],
    credentials: {
      access_token: '*****************'
    }
  },
  {
    id: 'steadfast',
    name: CourierProvider.STEADFAST,
    logo: 'https://placehold.co/60x60/00C853/FFFFFF?text=S',
    connected: false,
    website: 'https://steadfast.com.bd/',
    description: 'Reliable courier service for e-commerce with easy API integration.',
    authFields: [
      { key: 'api_key', label: 'API Key', type: 'text', placeholder: 'Enter API Key' },
      { key: 'secret_key', label: 'Secret Key', type: 'password', placeholder: 'Enter Secret Key' }
    ]
  },
  {
    id: 'paperfly',
    name: CourierProvider.PAPERFLY,
    logo: 'https://placehold.co/60x60/FFAB00/FFFFFF?text=PF',
    connected: false,
    website: 'https://www.paperfly.com.bd/',
    description: 'Strong nationwide network with doorstep pickup and delivery.',
    authFields: [
      { key: 'username', label: 'Username', type: 'text', placeholder: 'Paperfly Username' },
      { key: 'password', label: 'Password', type: 'password', placeholder: 'Paperfly Password' },
      { key: 'api_key', label: 'Master API Key', type: 'text', placeholder: 'Enter Master API Key' }
    ]
  },
  {
    id: 'ecourier',
    name: CourierProvider.ECOURIER,
    logo: 'https://placehold.co/60x60/2962FF/FFFFFF?text=eC',
    connected: false,
    website: 'https://ecourier.com.bd/',
    description: 'Premium courier service with eco-friendly options.',
    authFields: [
      { key: 'user_id', label: 'User ID', type: 'text', placeholder: 'eCourier User ID' },
      { key: 'api_key', label: 'API Key', type: 'text', placeholder: 'API Key' },
      { key: 'api_secret', label: 'API Secret', type: 'password', placeholder: 'API Secret' }
    ]
  }
];

// Helper to simulate fetching customer fraud history from couriers
export const getMockCustomerStats = (phone: string): Promise<CustomerCourierStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Deterministic mock based on phone number length/char to keep it consistent for demo
      const isRisky = phone.endsWith('44'); 
      const totalParcels = isRisky ? 12 : 35;
      const returned = isRisky ? 5 : 1;
      const delivered = totalParcels - returned;
      const successRate = Math.round((delivered / totalParcels) * 100);
      
      let riskLabel: 'Safe' | 'Moderate' | 'High Risk' = 'Safe';
      if (successRate < 70) riskLabel = 'High Risk';
      else if (successRate < 90) riskLabel = 'Moderate';

      resolve({
        totalParcels,
        delivered,
        returned,
        successRate,
        lastOrderDate: '2023-10-20',
        riskLabel
      });
    }, 800); // Simulate API latency
  });
};