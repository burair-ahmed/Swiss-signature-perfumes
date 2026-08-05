'use client';

import { useState } from 'react';
import { Package, Heart, LogOut, Settings } from 'lucide-react';
import styles from './AccountPage.module.css';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  const mockOrders = [
    {
      id: 'SS-849201',
      date: '2026-01-14',
      status: 'Delivered',
      total: 348.00,
      items: ['Alpine Glacier (50ml)'],
    },
    {
      id: 'SS-710293',
      date: '2025-11-20',
      status: 'Delivered',
      total: 399.00,
      items: ['The Signature Collection'],
    },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarCircle}>
            <span>AH</span>
          </div>
          <div>
            <h1 className="text-display-md">Lord Alexander Hamilton</h1>
            <p className={styles.memberTag}>Swiss Signature VIP Member — Zurich</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className={styles.grid}>
          {/* Navigation Sidebar */}
          <div className={styles.navCol}>
            <button
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.navActive : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={18} />
              <span>Order History</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'wishlist' ? styles.navActive : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <Heart size={18} />
              <span>Saved Wishlist</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.navActive : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <Settings size={18} />
              <span>Profile Settings</span>
            </button>
            <button className={`${styles.navItem} ${styles.logoutBtn}`}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Content Area */}
          <div className={styles.contentCol}>
            {activeTab === 'orders' && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Your Orders</h3>

                <div className={styles.ordersList}>
                  {mockOrders.map((order) => (
                    <div key={order.id} className={styles.orderItem}>
                      <div className={styles.orderHead}>
                        <div>
                          <span className={styles.orderRef}>{order.id}</span>
                          <span className={styles.orderDate}>{order.date}</span>
                        </div>
                        <span className={styles.statusBadge}>{order.status}</span>
                      </div>
                      <div className={styles.orderBody}>
                        <p className={styles.itemsText}>{order.items.join(', ')}</p>
                        <span className={styles.orderPrice}>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Saved Wishlist</h3>
                <p className={styles.emptyText}>You haven&apos;t saved any scents to your wishlist yet.</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Account Details</h3>

                <form className={styles.profileForm} onSubmit={(e) => e.preventDefault()}>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="acc-name">Full Name</label>
                    <input type="text" id="acc-name" className="input" defaultValue="Lord Alexander Hamilton" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="acc-email">Email Address</label>
                    <input type="email" id="acc-email" className="input" defaultValue="alexander@hamilton.ch" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="acc-currency">Preferred Currency</label>
                    <select id="acc-currency" className="input" defaultValue="USD">
                      <option value="USD">USD ($)</option>
                      <option value="CHF">CHF (Fr.)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Save Preferences
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
