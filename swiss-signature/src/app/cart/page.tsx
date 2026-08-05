'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal > 150 ? 0 : 25;
  const tax = subtotal * 0.08; // 8% Swiss VAT estimate
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <div className="container flex-col-center">
          <ShoppingBag size={64} className={styles.emptyIcon} strokeWidth={1} />
          <h1 className="text-display-md" style={{ marginTop: '1rem' }}>
            Your Cart is Empty
          </h1>
          <p className="text-body" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '2rem' }}>
            Your olfactory journey awaits. Discover our hand-crafted Swiss collection.
          </p>
          <Link href="/shop" className="btn btn-primary btn-lg">
            Explore Fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className="text-display-md" style={{ marginBottom: '2.5rem' }}>
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        <div className={styles.grid}>
          {/* Cart Items List */}
          <div className={styles.itemsCol}>
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedVolume}`} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <div className={styles.imagePlaceholder}>
                    {item.product.name.charAt(0)}
                  </div>
                </div>

                <div className={styles.itemMeta}>
                  <span className={styles.itemCategory}>{item.product.fragranceFamily}</span>
                  <h3 className={styles.itemName}>{item.product.name}</h3>
                  <p className={styles.itemVol}>Flacon Size: {item.selectedVolume}</p>
                  <span className={styles.itemPrice}>${item.product.price}</span>
                </div>

                <div className={styles.qtyBox}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product.id, item.selectedVolume, item.quantity - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span className={styles.qtyNum}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product.id, item.selectedVolume, item.quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeItem(item.product.id, item.selectedVolume)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Column */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>

              <div className={styles.row}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className={styles.row}>
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <span className="text-gold">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className={styles.row}>
                <span>Swiss VAT (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={`${styles.row} ${styles.totalRow}`}>
                <span>Total Amount</span>
                <span className={styles.totalPrice}>${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}>
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <div className={styles.trustFooter}>
                <ShieldCheck size={16} className="text-gold" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
