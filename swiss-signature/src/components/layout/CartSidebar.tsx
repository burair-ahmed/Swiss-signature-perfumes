'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import styles from './CartSidebar.module.css';

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const subtotal = getSubtotal();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={closeCart} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} id="cart-sidebar">
        <div className={styles.header}>
          <h2 className={styles.title}>
            <ShoppingBag size={20} />
            Your Cart
          </h2>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={48} strokeWidth={1} />
            <p className={styles.emptyTitle}>Your cart is empty</p>
            <p className={styles.emptyText}>Discover our luxury fragrances and find your signature scent.</p>
            <Link href="/shop" className="btn btn-primary" onClick={closeCart}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedVolume}`} className={styles.item}>
                  <div className={styles.itemImage}>
                    <div className={styles.imagePlaceholder}>
                      {item.product.name.charAt(0)}
                    </div>
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.product.name}</h3>
                    <p className={styles.itemVolume}>{item.selectedVolume}</p>
                    <p className={styles.itemPrice}>${item.product.price}</p>
                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.product.id, item.selectedVolume, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.product.id, item.selectedVolume, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.product.id, item.selectedVolume)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <span className={styles.subtotalAmount}>${subtotal.toFixed(2)}</span>
              </div>
              <p className={styles.shippingNote}>Shipping & taxes calculated at checkout</p>
              <Link href="/checkout" className="btn btn-primary btn-lg" onClick={closeCart} style={{ width: '100%' }}>
                Checkout — ${subtotal.toFixed(2)}
              </Link>
              <Link href="/cart" className="btn btn-secondary" onClick={closeCart} style={{ width: '100%', marginTop: '0.5rem' }}>
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
