
import { Product, Order, UserRole } from './types';
import { MOCK_PRODUCTS } from './constants';

export interface UserDB {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  role: UserRole;
  createdAt: string;
  provider: 'local' | 'google' | 'facebook';
  avatar?: string;
  twoFactorEnabled?: boolean;
  fingerprint?: string; // Session security
}

/**
 * ARCHITECT NOTE: Using a salted simulation for mock environments.
 * In production, use bcrypt.withDefaultConfig().hash(password)
 */
const hashPassword = (password: string): string => {
  const salt = "daraz_ultra_secure_2024";
  let hash = 0;
  const combined = password + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return "v2_" + Math.abs(hash).toString(16);
};

const DB_KEYS = {
  USERS: 'daraz_users',
  PRODUCTS: 'daraz_products',
  ORDERS: 'daraz_orders',
  SESSION: 'daraz_session'
};

export const db = {
  // Sanitize input to prevent injection
  sanitize: (str: string) => str.replace(/[<>]/g, ""),

  register: (email: string, password: string, name: string, role: UserRole = UserRole.CUSTOMER): UserDB | null => {
    const users = db.getUsers();
    if (users.find(u => u.email === email)) return null;

    const newUser: UserDB = {
      id: Math.random().toString(36).substr(2, 9),
      email: db.sanitize(email),
      passwordHash: hashPassword(password),
      name: db.sanitize(name),
      role,
      createdAt: new Date().toISOString(),
      provider: 'local',
      twoFactorEnabled: false
    };

    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([...users, newUser]));
    return newUser;
  },

  socialLogin: (email: string, name: string, provider: 'google' | 'facebook', avatar?: string): UserDB => {
    const users = db.getUsers();
    let user = users.find(u => u.email === email);

    if (!user) {
      user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: UserRole.CUSTOMER,
        createdAt: new Date().toISOString(),
        provider,
        avatar,
        twoFactorEnabled: false
      };
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([...users, user]));
    }

    // Set fingerprint for session security
    user.fingerprint = Math.random().toString(36).substring(7);
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
    return user;
  },

  login: (email: string, password: string): UserDB | null => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.passwordHash === hashPassword(password));
    if (user) {
      // Re-issue fingerprint on every login
      user.fingerprint = Math.random().toString(36).substring(7);
      localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(DB_KEYS.SESSION);
  },

  getCurrentUser: (): UserDB | null => {
    const session = localStorage.getItem(DB_KEYS.SESSION);
    if (!session) return null;
    const user = JSON.parse(session) as UserDB;
    // Basic verification of session integrity
    if (!user.fingerprint) return null;
    return user;
  },

  getUsers: (): UserDB[] => {
    const users = localStorage.getItem(DB_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  getProducts: (): Product[] => {
    const customProducts = localStorage.getItem(DB_KEYS.PRODUCTS);
    const parsedCustom = customProducts ? JSON.parse(customProducts) : [];
    return [...MOCK_PRODUCTS, ...parsedCustom];
  },

  addProduct: (product: Omit<Product, 'id'>) => {
    const products = localStorage.getItem(DB_KEYS.PRODUCTS);
    const parsed = products ? JSON.parse(products) : [];
    const newProduct = { ...product, id: `db-${Date.now()}` };
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify([...parsed, newProduct]));
    return newProduct;
  },

  saveOrder: (order: Omit<Order, 'id'>) => {
    const orders = localStorage.getItem(DB_KEYS.ORDERS);
    const parsed = orders ? JSON.parse(orders) : [];
    const newOrder = { ...order, id: `ORD-${Date.now()}` };
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([...parsed, newOrder]));
    return newOrder;
  },

  getOrdersByCustomer: (customerName: string): Order[] => {
    const orders = localStorage.getItem(DB_KEYS.ORDERS);
    const parsed = orders ? JSON.parse(orders) : [];
    return parsed.filter((o: Order) => o.customerName === customerName);
  }
};
