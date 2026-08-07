'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, Order, User } from '@/lib/types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Download,
  Users,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  Clock,
  Banknote,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './AdminPage.module.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [adminsList, setAdminsList] = useState<User[]>([]);

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    tagline: '',
    price: '',
    category: 'unisex' as Product['category'],
    fragranceFamily: 'Amber',
    image: '/products/noir-absolu.jpg',
    description: '',
    badge: 'bestseller' as Product['badge'],
    inStock: true,
  });

  // Admin User Modal/Form State
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
  });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Selected Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 1. Authenticate user
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        router.push('/admin/login');
        return;
      }
      setCurrentUser(data.user);
      fetchData();
    } catch {
      router.push('/admin/login');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const fetchData = async () => {
    try {
      const [resOrders, resProducts, resUsers] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/admin/products'),
        fetch('/api/admin/users'),
      ]);

      if (resOrders.ok) {
        const data = await resOrders.json();
        if (data.orders) setOrders(data.orders);
      }

      if (resProducts.ok) {
        const data = await resProducts.json();
        if (data.products) setProducts(data.products);
      }

      if (resUsers.ok) {
        const data = await resUsers.json();
        if (data.admins) setAdminsList(data.admins);
      }
    } catch {
      toast.error('Failed to load portal data');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/admin/login');
  };

  // Product Management Handlers
  const handleOpenNewProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      tagline: '',
      price: '2400',
      category: 'unisex',
      fragranceFamily: 'Amber',
      image: '/products/noir-absolu.jpg',
      description: 'Artisanal perfume handcrafted with Swiss perfection.',
      badge: 'bestseller',
      inStock: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      tagline: product.tagline || '',
      price: String(product.price),
      category: product.category,
      fragranceFamily: product.fragranceFamily || 'Amber',
      image: product.image || '/products/noir-absolu.jpg',
      description: product.description || '',
      badge: product.badge || 'bestseller',
      inStock: product.inStock,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProductId || undefined,
          ...productForm,
          price: Number(productForm.price),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product');
      }

      toast.success(editingProductId ? 'Product updated in Sanity CMS!' : 'Product uploaded to Sanity CMS!');
      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product from Sanity CMS and catalog?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete product');
      }
      toast.success('Product deleted from Sanity CMS');
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting product');
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update order status');
      }
      toast.success(`Order ${orderId} marked as ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    window.open('/api/admin/orders/export-csv', '_blank');
    toast.success('Downloading orders CSV file...');
  };

  // Super Admin Account Creation Handler
  const handleCreateAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAdmin(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create admin user');
      }

      toast.success(data.message || 'Admin account created successfully!');
      setAdminForm({ name: '', email: '', password: '', role: 'admin' });
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className={styles.adminPage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--gold)', textAlign: 'center' }}>
          <Clock className="animate-spin" size={32} style={{ margin: '0 auto 1rem auto' }} />
          <p>Verifying Admin Security Clearance...</p>
        </div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.city.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const codOrdersCount = orders.filter(o => o.paymentMethod === 'cod').length;

  return (
    <div className={styles.adminPage}>
      {/* Top Navbar */}
      <header className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarContent}>
            <div className={styles.brandLogo}>
              <ShieldCheck size={24} className="text-gold" />
              <span>Swiss Signature Admin Portal</span>
            </div>

            <div className={styles.userBadge}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentUser?.email}</div>
              </div>

              <span className={currentUser?.role === 'super_admin' ? styles.roleTagSuper : styles.roleTag}>
                {currentUser?.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
              </span>

              <Link href="/" target="_blank" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <ExternalLink size={14} /> Storefront
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#ff6b6b' }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Navigation Tabs */}
        <div className={styles.navTabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} /> Dashboard Overview
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} /> Product Management (Sanity CMS)
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} /> Order Management ({orders.length})
          </button>
          
          <button
            className={styles.tabBtn}
            onClick={handleExportCSV}
            style={{ color: 'var(--gold)', border: '1px solid rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.05)' }}
          >
            <Download size={18} /> Export Orders CSV
          </button>

          {currentUser?.role === 'super_admin' && (
            <button
              className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('users')}
              style={{ marginLeft: 'auto' }}
            >
              <Users size={18} /> Admin Accounts
            </button>
          )}
        </div>

        {/* --- TAB 1: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><DollarSign size={24} /></div>
                <div>
                  <div className={styles.statLabel}>Total Sales Revenue</div>
                  <div className={styles.statVal}>PKR {totalRevenue.toLocaleString()}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}><ShoppingBag size={24} /></div>
                <div>
                  <div className={styles.statLabel}>Total Orders Placed</div>
                  <div className={styles.statVal}>{orders.length}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'rgba(242, 153, 74, 0.15)', color: '#f2994a' }}><Banknote size={24} /></div>
                <div>
                  <div className={styles.statLabel}>Cash on Delivery (COD)</div>
                  <div className={styles.statVal}>{codOrdersCount} Orders</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'rgba(45, 156, 219, 0.15)', color: '#2d9cdb' }}><Package size={24} /></div>
                <div>
                  <div className={styles.statLabel}>Active Fragrance Catalog</div>
                  <div className={styles.statVal}>{products.length} Items</div>
                </div>
              </div>
            </div>

            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>Recent Orders Summary</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Latest incoming customer purchases & COD dispatches</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setActiveTab('orders')}>
                  View All Orders
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>City</th>
                      <th>Payment</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{order.id}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.customer.firstName} {order.customer.lastName}</td>
                        <td>{order.customer.city}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: order.paymentMethod === 'cod' ? '#f2994a' : '#27ae60' }}>
                            {(order.paymentMethod || 'cod').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>PKR {order.total.toLocaleString()}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: PRODUCT MANAGEMENT (Sanity CMS) --- */}
        {activeTab === 'products' && (
          <div>
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Sanity CMS Product Catalog</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Upload, edit, or delete fragrance products. All changes are synchronized with Sanity CMS.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenNewProductModal}>
                  <Plus size={16} /> Upload New Product
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Scent Family</th>
                      <th>Price (PKR)</th>
                      <th>Badge</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                            <div>
                              <div style={{ fontWeight: 600, color: '#fff' }}>{prod.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{prod.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{prod.category}</td>
                        <td>{prod.fragranceFamily}</td>
                        <td style={{ fontWeight: 600, color: 'var(--gold)' }}>PKR {prod.price.toLocaleString()}</td>
                        <td>
                          {prod.badge ? (
                            <span style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                              {prod.badge}
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          <span style={{ color: prod.inStock ? '#27ae60' : '#eb5757', fontWeight: 600 }}>
                            {prod.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleOpenEditProductModal(prod)}>
                              <Edit size={14} /> Edit
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: '#eb5757' }} onClick={() => handleDeleteProduct(prod.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: ORDER MANAGEMENT --- */}
        {activeTab === 'orders' && (
          <div>
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Customer Order Management</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Track incoming orders, inspect Cash on Delivery (COD) details, and update dispatch statuses.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={handleExportCSV}>
                  <Download size={16} /> Export Orders CSV
                </button>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, Email, or City..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="input"
                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="input"
                  style={{ width: '180px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer Details</th>
                      <th>Location / City</th>
                      <th>Method</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Order Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{order.id}</td>
                        <td style={{ fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleString()}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{order.customer.firstName} {order.customer.lastName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.customer.email}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.customer.phone}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{order.customer.city}</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {order.customer.city.toLowerCase().includes('karachi') ? 'Karachi (PKR 250)' : 'Regional Courier'}
                          </div>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: order.paymentMethod === 'cod' ? 'rgba(242, 153, 74, 0.15)' : 'rgba(39, 174, 96, 0.15)',
                            color: order.paymentMethod === 'cod' ? '#f2994a' : '#27ae60',
                            border: order.paymentMethod === 'cod' ? '1px solid rgba(242, 153, 74, 0.3)' : '1px solid rgba(39, 174, 96, 0.3)',
                          }}>
                            {(order.paymentMethod || 'cod').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          {order.items.map(i => `${i.name} (${i.selectedVolume || 'std'}) x${i.quantity}`).join(', ')}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--gold)' }}>
                          PKR {order.total.toLocaleString()}
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="input"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', background: '#12141a' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                            onClick={() => setSelectedOrder(order)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: SUPER ADMIN USER MANAGEMENT --- */}
        {activeTab === 'users' && currentUser?.role === 'super_admin' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
              {/* Create Admin Form */}
              <div className={styles.panelCard}>
                <h3 style={{ marginTop: 0, fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} className="text-gold" />
                  Create Admin Account
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  🔒 Public admin signup is disabled. Only you (Super Admin) can register new administrators.
                </p>

                <form onSubmit={handleCreateAdminAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>Full Name</label>
                    <input
                      type="text"
                      className="input"
                      value={adminForm.name}
                      onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                      placeholder="e.g. Hassan Shah"
                      required
                    />
                  </div>

                  <div>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>Admin Email</label>
                    <input
                      type="email"
                      className="input"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      placeholder="hassan@swiss-signature.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>Password</label>
                    <input
                      type="password"
                      className="input"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>

                  <div>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>Role Level</label>
                    <select
                      className="input"
                      value={adminForm.role}
                      onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as 'admin' | 'super_admin' })}
                    >
                      <option value="admin">Standard Admin (Product & Order Management)</option>
                      <option value="super_admin">Super Admin (Full Control & User Creation)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isCreatingAdmin} style={{ marginTop: '0.5rem' }}>
                    {isCreatingAdmin ? 'Creating Account...' : 'Register Admin User'}
                  </button>
                </form>
              </div>

              {/* Registered Admins List */}
              <div className={styles.panelCard}>
                <h3 style={{ marginTop: 0, fontSize: '1.15rem', color: '#fff' }}>Active Administrator Directory</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Authorized administrators with access permission to the admin portal.
                </p>

                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminsList.map((adm) => (
                        <tr key={adm.id}>
                          <td style={{ fontWeight: 600, color: '#fff' }}>{adm.name}</td>
                          <td>{adm.email}</td>
                          <td>
                            <span className={adm.role === 'super_admin' ? styles.roleTagSuper : styles.roleTag}>
                              {adm.role.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : 'Initial Seed'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- PRODUCT CREATE/EDIT MODAL --- */}
      {isProductModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>
                {editingProductId ? 'Edit Product in Sanity CMS' : 'Upload New Product to Sanity CMS'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Product Name</label>
                  <input
                    type="text"
                    className="input"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Swiss Royal Amber"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Price (PKR)</label>
                  <input
                    type="number"
                    className="input"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="2500"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product['category'] })}
                  >
                    <option value="men">Pour Homme (Men)</option>
                    <option value="women">Pour Femme (Women)</option>
                    <option value="unisex">Unisex</option>
                    <option value="gift-set">Gift Set</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Fragrance Scent Family</label>
                  <input
                    type="text"
                    className="input"
                    value={productForm.fragranceFamily}
                    onChange={(e) => setProductForm({ ...productForm, fragranceFamily: e.target.value })}
                    placeholder="e.g. Oud, Amber, Vanilla, Bergamot"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Tagline / Short Subtitle</label>
                <input
                  type="text"
                  className="input"
                  value={productForm.tagline}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  placeholder="Rich, warm and smooth with a sophisticated depth."
                />
              </div>

              <div>
                <label className="input-label">Image URL / Asset Path</label>
                <input
                  type="text"
                  className="input"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="/products/noir-absolu.jpg"
                />
              </div>

              <div>
                <label className="input-label">Product Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed fragrance notes and description..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Badge Tag</label>
                  <select
                    className="input"
                    value={productForm.badge || ''}
                    onChange={(e) => setProductForm({ ...productForm, badge: (e.target.value || undefined) as Product['badge'] })}
                  >
                    <option value="">None</option>
                    <option value="bestseller">Bestseller</option>
                    <option value="new">New Arrival</option>
                    <option value="limited">Limited Edition</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="inStock" style={{ fontSize: '0.9rem', color: '#fff', cursor: 'pointer' }}>Available in Stock</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsProductModalOpen(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save to Sanity CMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ORDER DETAIL MODAL --- */}
      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--gold)', fontSize: '1.25rem' }}>
                  Order Details #{selectedOrder.id}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--gold)' }}>Customer & Delivery Info</h4>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                  <div><strong>Name:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</div>
                  <div><strong>Email:</strong> {selectedOrder.customer.email}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customer.phone}</div>
                  <div><strong>Address:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.country} ({selectedOrder.customer.postalCode})</div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--gold)' }}>Purchased Fragrances</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span>{item.name} ({item.selectedVolume || 'std'}) x{item.quantity}</span>
                    <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212, 175, 55, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem' }}>Payment Method: <strong style={{ textTransform: 'uppercase', color: selectedOrder.paymentMethod === 'cod' ? '#f2994a' : '#27ae60' }}>{selectedOrder.paymentMethod}</strong></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Shipping Fee: PKR {selectedOrder.shippingFee.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Amount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold)' }}>PKR {selectedOrder.total.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)} style={{ flex: 1 }}>
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
