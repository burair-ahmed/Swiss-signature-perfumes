import fs from 'fs';
import path from 'path';
import { Order, User, Product } from './types';
import { products as initialProducts } from './data';

const DATA_DIR = path.join(process.cwd(), '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Default Seed Super Admin
const DEFAULT_SUPER_ADMIN: User & { passwordHash: string } = {
  id: 'usr_superadmin',
  name: 'Project Owner',
  email: 'admin-panel@swiss-signature.com',
  role: 'super_admin',
  passwordHash: 'Swiss123Signature786',
  createdAt: new Date().toISOString(),
};

// Initial Sample Orders
const SAMPLE_ORDERS: Order[] = [
  {
    id: 'SS-891042',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: {
      firstName: 'Tariq',
      lastName: 'Mahmood',
      email: 'tariq.m@example.com',
      phone: '+92 300 1234567',
      address: 'Plot 45-C, Khayaban-e-Shahbaz, DHA Phase 6',
      city: 'Karachi',
      country: 'Pakistan',
      postalCode: '75500',
    },
    items: [
      {
        productId: 'swiss-sauvage',
        name: 'Swiss Sauvage',
        price: 2750,
        quantity: 1,
        selectedVolume: '100ml',
      },
    ],
    subtotal: 2750,
    shippingFee: 250,
    total: 3000,
    paymentMethod: 'cod',
    status: 'Pending',
    notes: 'Please call before delivery.',
  },
  {
    id: 'SS-741920',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    customer: {
      firstName: 'Ayesha',
      lastName: 'Khan',
      email: 'ayesha.k@example.com',
      phone: '+92 321 9876543',
      address: 'House 12, Street 4, Sector F-7/2',
      city: 'Islamabad',
      country: 'Pakistan',
      postalCode: '44000',
    },
    items: [
      {
        productId: 'swiss-coco-mademoiselle',
        name: 'Swiss Coco Mademoiselle',
        price: 2350,
        quantity: 2,
        selectedVolume: '50ml',
      },
    ],
    subtotal: 4700,
    shippingFee: 350,
    total: 5050,
    paymentMethod: 'card',
    status: 'Delivered',
  },
];

// --- Orders Management ---
export function getStoredOrders(): Order[] {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(SAMPLE_ORDERS, null, 2), 'utf-8');
    return SAMPLE_ORDERS;
  }
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw) as Order[];
  } catch {
    return SAMPLE_ORDERS;
  }
}

export function saveOrder(order: Order): Order {
  ensureDataDir();
  const orders = getStoredOrders();
  const existingIndex = orders.findIndex(o => o.id === order.id);
  if (existingIndex > -1) {
    orders[existingIndex] = order;
  } else {
    orders.unshift(order);
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return order;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | null {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;
  order.status = status;
  saveOrder(order);
  return order;
}

// --- Admin Users Management ---
export interface StoredUser extends User {
  passwordHash: string;
}

export function getStoredAdmins(): StoredUser[] {
  ensureDataDir();
  if (!fs.existsSync(ADMINS_FILE)) {
    fs.writeFileSync(ADMINS_FILE, JSON.stringify([DEFAULT_SUPER_ADMIN], null, 2), 'utf-8');
    return [DEFAULT_SUPER_ADMIN];
  }
  try {
    const raw = fs.readFileSync(ADMINS_FILE, 'utf-8');
    let list = JSON.parse(raw) as StoredUser[];
    
    // Ensure default super admin credentials are synced/updated
    const idx = list.findIndex(a => a.id === DEFAULT_SUPER_ADMIN.id || a.email.toLowerCase() === DEFAULT_SUPER_ADMIN.email.toLowerCase() || a.email.toLowerCase() === 'admin@swiss-signature.com');
    if (idx > -1) {
      list[idx] = DEFAULT_SUPER_ADMIN;
    } else {
      list.unshift(DEFAULT_SUPER_ADMIN);
    }
    
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return list;
  } catch {
    return [DEFAULT_SUPER_ADMIN];
  }
}


export function addAdminUser(name: string, email: string, passwordHash: string, role: 'admin' | 'super_admin' = 'admin'): User {
  ensureDataDir();
  const admins = getStoredAdmins();
  const normalizedEmail = email.trim().toLowerCase();
  
  if (admins.some(a => a.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: StoredUser = {
    id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: normalizedEmail,
    role,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  admins.push(newUser);
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf-8');
  
  const { passwordHash: _, ...publicUser } = newUser;
  return publicUser;
}

// --- Dynamic Products Management ---
export function getStoredProducts(): Product[] {
  ensureDataDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
    return initialProducts;
  }
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch {
    return initialProducts;
  }
}

export function saveProduct(product: Product): Product {
  ensureDataDir();
  const productsList = getStoredProducts();
  const existingIdx = productsList.findIndex(p => p.id === product.id || p.slug === product.slug);
  if (existingIdx > -1) {
    productsList[existingIdx] = product;
  } else {
    productsList.unshift(product);
  }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsList, null, 2), 'utf-8');
  return product;
}

export function deleteProduct(productId: string): boolean {
  ensureDataDir();
  const productsList = getStoredProducts();
  const filtered = productsList.filter(p => p.id !== productId && p.slug !== productId);
  if (filtered.length === productsList.length) return false;
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
