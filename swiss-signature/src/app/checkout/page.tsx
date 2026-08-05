'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, Building2, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  const [isGuest, setIsGuest] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Switzerland',
    postalCode: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });

  const subtotal = getSubtotal();
  const shipping = subtotal > 150 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payment Authorized successfully!');
    setStep('confirmation');
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <p className={styles.orderNumber}>Order Reference: <strong>#SS-{Math.floor(100000 + Math.random() * 900000)}</strong></p>
          <p className={styles.confirmationText}>
            A confirmation receipt has been dispatched to <strong>{formData.email || 'your email'}</strong>. Your handcrafted fragrance is being prepared by our Zurich atelier.
          </p>

          <div className={styles.confirmationActions}>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Continue Browsing
            </Link>
            <Link href="/account" className="btn btn-secondary btn-lg">
              View Order History
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
            <span>Shipping Info</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepItem} ${step === 'payment' ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>2</span>
            <span>Payment Method</span>
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

                <h3 className={styles.sectionTitle}>Contact & Shipping Details</h3>

                <div className={styles.formGroup}>
                  <label className="input-label" htmlFor="email">Email Address for Confirmation</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="alexander@domain.com"
                    required
                  />
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
                    placeholder="Bahnhofstrasse 12"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className="input-label" htmlFor="city">City / Region</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input"
                      required
                    />
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
                    <option value="Switzerland">Switzerland</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Germany">Germany</option>
                    <option value="Pakistan">Pakistan</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
                  Proceed to Payment Options
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteOrder} className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Select Payment Gateway</h3>

                <div className={styles.paymentMethods}>
                  <label className={`${styles.methodCard} ${paymentMethod === 'card' ? styles.methodActive : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard size={20} className="text-gold" />
                    <span>Credit / Debit Card (Stripe Integrated)</span>
                  </label>

                  <label className={`${styles.methodCard} ${paymentMethod === 'paypal' ? styles.methodActive : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                    />
                    <Building2 size={20} className="text-gold" />
                    <span>PayPal Express Checkout</span>
                  </label>
                </div>

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
                  <button type="button" className="btn btn-secondary" onClick={() => setStep('shipping')}>
                    Back to Shipping
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                    <Lock size={16} />
                    Complete Order — ${total.toFixed(2)}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Your Order</h3>

              <div className={styles.summaryItems}>
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVolume}`} className={styles.summaryItem}>
                    <div className={styles.summaryItemName}>
                      <span>{item.product.name} ({item.selectedVolume})</span>
                      <span className={styles.qtyBadge}>x{item.quantity}</span>
                    </div>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.row}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.row}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className={styles.row}>
                <span>Swiss VAT (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={`${styles.row} ${styles.totalRow}`}>
                <span>Total</span>
                <span className={styles.totalPrice}>${total.toFixed(2)}</span>
              </div>

              <div className={styles.guaranteeBox}>
                <Truck size={18} className="text-gold" />
                <p>Complimentary Insured Courier Delivery from Zurich, Switzerland.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
