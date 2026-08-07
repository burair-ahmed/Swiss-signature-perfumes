'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { calculateShippingFee } from '@/lib/shipping';
import { CreditCard, Lock, CheckCircle2, Building2, Truck, Banknote, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'paypal'>('cod');
  const [isGuest, setIsGuest] = useState(true);
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
    cardNumber: '',
    expDate: '',
    cvv: '',
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
        selectedVolume: item.selectedVolume,
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
        paymentMethod,
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
      toast.success(
        paymentMethod === 'cod' 
          ? 'Order placed successfully! Cash will be collected upon delivery.' 
          : 'Payment authorized & order placed successfully!'
      );
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
            Thank You For Your Purchase
          </h1>
          <p className={styles.orderNumber}>Order Reference: <strong>#{createdOrderRef || 'SS-891024'}</strong></p>
          
          <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '1.25rem 1.5rem', borderRadius: '8px', margin: '1.5rem 0', maxWidth: '540px', textAlign: 'center' }}>
            {paymentMethod === 'cod' ? (
              <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--gold)' }}>Cash on Delivery Selected:</strong> Please keep <strong>PKR {total.toLocaleString()}</strong> cash ready upon courier delivery to <strong>{formData.address}, {formData.city}</strong>.
              </p>
            ) : (
              <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Your payment of <strong>PKR {total.toLocaleString()}</strong> has been authorized. Order details dispatched to <strong>{formData.email}</strong>.
              </p>
            )}
          </div>

          <p className={styles.confirmationText}>
            A confirmation receipt has been sent to <strong>{formData.email || 'your email'}</strong>. Your order has been dispatched to our fulfillment team and logged in Admin Orders.
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
                  Proceed to Payment Options
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteOrder} className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Select Payment Gateway</h3>

                <div className={styles.paymentMethods}>
                  {/* Cash on Delivery Option */}
                  <label className={`${styles.methodCard} ${paymentMethod === 'cod' ? styles.methodActive : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <Banknote size={22} className="text-gold" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>Cash on Delivery (COD)</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pay cash to courier upon delivery at your doorstep</span>
                    </div>
                  </label>

                  {/* Credit Card Option */}
                  <label className={`${styles.methodCard} ${paymentMethod === 'card' ? styles.methodActive : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard size={22} className="text-gold" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>Credit / Debit Card (Stripe Integrated)</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Visa, MasterCard, UnionPay</span>
                    </div>
                  </label>

                  {/* PayPal Option */}
                  <label className={`${styles.methodCard} ${paymentMethod === 'paypal' ? styles.methodActive : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                    />
                    <Building2 size={22} className="text-gold" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>PayPal Express Checkout</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fast & secure PayPal authorization</span>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'cod' && (
                  <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px dashed rgba(212, 175, 55, 0.3)', padding: '1.25rem', borderRadius: '8px', margin: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--gold)', fontWeight: 600 }}>
                      <ShieldCheck size={18} />
                      <span>Cash on Delivery Terms</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      Order total of <strong>PKR {total.toLocaleString()}</strong> will be collected in cash by our dispatch rider upon parcel handoff. Please verify your phone number (<strong>{formData.phone}</strong>) for delivery SMS alerts.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className={styles.cardDetailsBox}>
                    <div className={styles.formGroup}>
                      <label className="input-label" htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="input"
                        placeholder="4532 •••• •••• 8910"
                        required
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className="input-label" htmlFor="expDate">Expiry Date</label>
                        <input
                          type="text"
                          id="expDate"
                          name="expDate"
                          value={formData.expDate}
                          onChange={handleChange}
                          className="input"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className="input-label" htmlFor="cvv">Security Code (CVV)</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          className="input"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.buttonGroup}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep('shipping')} disabled={isSubmitting}>
                    Back to Shipping
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={isSubmitting}>
                    <Lock size={16} />
                    {isSubmitting 
                      ? 'Processing Order...' 
                      : paymentMethod === 'cod' 
                        ? `Place COD Order — PKR ${total.toLocaleString()}`
                        : `Complete Order — PKR ${total.toLocaleString()}`
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
                  <div key={`${item.product.id}-${item.selectedVolume}`} className={styles.summaryItem}>
                    <div className={styles.summaryItemName}>
                      <span>{item.product.name} ({item.selectedVolume})</span>
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
