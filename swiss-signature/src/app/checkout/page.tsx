'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart-store';
import { calculateShippingFee } from '@/lib/shipping';
import { Lock, CheckCircle2, Truck, Banknote, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isGuest, setIsGuest] = useState(true);
  const paymentMethod = 'cod';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderRef, setCreatedOrderRef] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: 'Karachi',
    country: 'Pakistan',
    postalCode: '75500',
    notes: '',
  });

  const subtotal = getSubtotal();
  const shippingCalculation = calculateShippingFee(formData.city, formData.country);
  const shippingFee = shippingCalculation.fee;
  const total = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      toast.error('Please enter your contact phone number for delivery verification.');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedVolume: item.selectedVolume || '50ml',
        image: item.product.image,
      }));

      const payload = {
        items: orderItems,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        paymentMethod: 'cod',
        notes: formData.notes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process order.');
      }

      setCreatedOrderRef(data.order.id);
      toast.success('Order placed successfully! Cash will be collected upon delivery.');
      setStep('confirmation');
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'An error occurred placing your order.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'confirmation') {
    return (
      <div className={styles.confirmationPage}>
        <div className="container flex-col-center">
          <div className={styles.checkCircle}>
            <CheckCircle2 size={56} className="text-gold" />
          </div>
          <span className="text-caption text-gold" style={{ marginTop: '1.5rem' }}>Order Confirmed</span>
          <h1 className="text-display-md" style={{ marginTop: '0.25rem' }}>
            Thank You For Your Order
          </h1>
          <p className={styles.orderNumber}>Order Reference: <strong>#{createdOrderRef || 'SS-891024'}</strong></p>
          
          <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '1.25rem 1.5rem', borderRadius: '8px', margin: '1.5rem 0', maxWidth: '560px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <strong style={{ color: 'var(--gold)' }}>Cash on Delivery (COD) Confirmed:</strong> Please keep <strong style={{ color: 'var(--gold)' }}>PKR {total.toLocaleString()}</strong> ready in cash for the courier rider upon delivery to <strong>{formData.address}, {formData.city}</strong>.
            </p>
          </div>

          <p className={styles.confirmationText}>
            A confirmation receipt and tracking updates will be dispatched to <strong>{formData.phone}</strong> and <strong>{formData.email || 'your email'}</strong>.
          </p>

          <div className={styles.confirmationActions}>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Continue Browsing
            </Link>
            <Link href="/admin" className="btn btn-secondary btn-lg">
              Open Admin Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Step Indicator */}
        <div className={styles.stepsBar}>
          <div className={`${styles.stepItem} ${styles.stepActive}`}>
            <span className={styles.stepNum}>1</span>
            <span>Shipping Details</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepItem} ${step === 'payment' ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>2</span>
            <span>Payment & Review</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Form Column */}
          <div className={styles.formCol}>
            {step === 'shipping' ? (
              <form onSubmit={handleProceedToPayment} className={styles.formSection}>
                <div className={styles.guestToggle}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${isGuest ? styles.toggleActive : ''}`}
                    onClick={() => setIsGuest(true)}
                  >
                    Guest Checkout
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${!isGuest ? styles.toggleActive : ''}`}
                    onClick={() => setIsGuest(false)}
                  >
                    Account Checkout
                  </button>
                </div>

                <h3 className={styles.sectionTitle}>Contact & Delivery Information</h3>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="customer@domain.com"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="phone">Phone Number (Required for COD)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className="input-label" htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input"
                    placeholder="House / Apartment #, Street Name, Area"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="city">City / Location</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g. Karachi, Lahore, Islamabad"
                      required
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold)', marginTop: '0.25rem', display: 'block' }}>
                      {formData.city.trim().toLowerCase().includes('karachi') 
                        ? '✓ Within Karachi: Fixed PKR 250 Courier Shipping' 
                        : '✓ Outside Karachi: Calculated Regional Courier Rate'}
                    </span>
                  </div>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className="input-label" htmlFor="country">Country</label>
                  <select id="country" name="country" value={formData.country} onChange={handleChange} className="input">
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className="input-label" htmlFor="notes">Delivery Notes / Special Instructions (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input"
                    rows={2}
                    placeholder="Gate code, specific delivery instructions..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
                  Proceed to Payment (COD)
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteOrder} className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Payment Method (COD Only)</h3>

                <div className={styles.paymentMethods}>
                  {/* Cash on Delivery Only */}
                  <label className={`${styles.methodCard} ${styles.methodActive}`} style={{ cursor: 'default' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={true}
                      readOnly
                    />
                    <Banknote size={24} className="text-gold" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: '1rem' }}>Cash on Delivery (COD)</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pay cash to courier upon delivery at your doorstep</span>
                    </div>
                  </label>
                </div>

                <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px dashed rgba(212, 175, 55, 0.4)', padding: '1.5rem', borderRadius: '8px', margin: '1.25rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>
                    <ShieldCheck size={20} />
                    <span>Cash on Delivery Dispatch Guarantee</span>
                  </div>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6 }}>
                    <li>Order total of <strong>PKR {total.toLocaleString()}</strong> will be collected in cash upon courier parcel arrival.</li>
                    <li>Delivery address: <strong>{formData.address}, {formData.city}, Pakistan</strong>.</li>
                    <li>Tracking SMS & dispatch confirmation sent to <strong>{formData.phone}</strong>.</li>
                  </ul>
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep('shipping')} disabled={isSubmitting}>
                    Back to Shipping
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={isSubmitting}>
                    <Lock size={16} />
                    {isSubmitting 
                      ? 'Confirming Order...' 
                      : `Confirm COD Order — PKR ${total.toLocaleString()}`
                    }
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Your Order Summary</h3>

              <div className={styles.summaryItems}>
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVolume}`} className={styles.summaryItem} style={{ alignItems: 'center', gap: '0.75rem' }}>
                    {item.product.image && (
                      <div style={{ width: 44, height: 44, position: 'relative', borderRadius: 4, overflow: 'hidden', background: '#111', flexShrink: 0 }}>
                        <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'contain' }} />
                      </div>
                    )}
                    <div className={styles.summaryItemName} style={{ flex: 1 }}>
                      <span>{item.product.name} (50ml)</span>
                      <span className={styles.qtyBadge}>x{item.quantity}</span>
                    </div>
                    <span>PKR {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.row}>
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              
              <div className={styles.row}>
                <div>
                  <span>Shipping Fee</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>
                    {shippingCalculation.locationType === 'karachi' ? 'Within Karachi Rate' : 'Outside Karachi Regional Rate'}
                  </div>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--gold)' }}>
                  PKR {shippingFee.toLocaleString()}
                </span>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={`${styles.row} ${styles.totalRow}`}>
                <span>Total Amount</span>
                <span className={styles.totalPrice}>PKR {total.toLocaleString()}</span>
              </div>

              <div className={styles.guaranteeBox}>
                <Truck size={18} className="text-gold" />
                <p>Courier partner: {shippingCalculation.courierName} ({shippingCalculation.estimatedDays}).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
