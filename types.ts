
export enum OrderStatus {
  PENDING = 'Pending',
  READY_TO_SHIP = 'Ready to Ship',
  SHIPPED = 'Shipped',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[]; // Added for gallery
  isDarazMall: boolean;
  freeShipping: boolean;
  category: string;
  subCategory: string;
  stock: number;
  sellerId: string;
}

export interface FlashSaleProduct extends Product {
  startTime: string;
  endTime: string;
  soldCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories: string[];
}

export interface Order {
  id: string;
  customerName: string;
  products: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: 'COD' | 'eSewa' | 'Khalti' | 'IME Pay' | 'Moru' | 'Bank' | 'Debit Card';
}

export interface AnalyticsData {
  date: string;
  sales: number;
  orders: number;
}
