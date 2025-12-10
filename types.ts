export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum CourierStatus {
  NOT_ASSIGNED = 'Not Assigned',
  REQUESTED = 'Requested',
  PICKED_UP = 'Picked Up',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  RETURNED = 'Returned',
}

export enum CourierProvider {
  PATHAO = 'Pathao',
  REDX = 'RedX',
  STEADFAST = 'Steadfast',
  PAPERFLY = 'Paperfly',
  ECOURIER = 'eCourier',
  NONE = 'None',
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

export interface CustomerCourierStats {
  totalParcels: number;
  delivered: number;
  returned: number;
  successRate: number;
  lastOrderDate: string;
  riskLabel: 'Safe' | 'Moderate' | 'High Risk';
}

export interface Order {
  id: string; // WP Order ID
  date: string;
  customer: Customer;
  total: number;
  items: string[];
  status: OrderStatus;
  courier: {
    provider: CourierProvider;
    trackingId?: string;
    status: CourierStatus;
    riderName?: string;
    riderPhone?: string;
    riderNote?: string;
  };
}

export interface CourierAuthField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'url';
  placeholder?: string;
  helpText?: string;
}

export interface CourierConfig {
  id: string;
  name: CourierProvider;
  logo: string;
  connected: boolean;
  description: string;
  website: string;
  authFields: CourierAuthField[];
  credentials?: Record<string, string>;
}

export interface StoreCredentials {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  isConnected: boolean;
}