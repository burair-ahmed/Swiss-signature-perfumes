'use client';

import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for contacting Swiss Signature. A fragrance specialist will respond within 24 hours.');
  };

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className="container flex-col-center">
          <span className="text-caption text-gold">Personal Concierge</span>
          <h1 className="text-display-lg" style={{ marginTop: '0.25rem' }}>
            Contact & Enquiries
          </h1>
          <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', maxWidth: '600px' }}>
            Our fragrance advisors are at your service for bespoke recommendations, order assistance, and private consultations.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div className={styles.grid}>
          {/* Contact Info */}
          <div className={styles.infoCol}>
            <span className="text-caption text-gold">Reach Out</span>
            <h2 className="text-display-md" style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
              We&apos;d Love to Connect
            </h2>
            <p className={styles.infoText}>
              Whether you require scent profiling advice or have questions regarding international shipping, our team in Karachi, Pakistan is ready to assist.            </p>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Mail size={22} className={styles.icon} />
                <div>
                  <h4 className={styles.infoTitle}>Email</h4>
                  <p className={styles.infoVal}>hello@swisssignature.com</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Phone size={22} className={styles.icon} />
                <div>
                  <h4 className={styles.infoTitle}>Telephone</h4>
                  <p className={styles.infoVal}>+92 (3) 23 241 3377</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <MapPin size={22} className={styles.icon} />
                <div>
                  <h4 className={styles.infoTitle}>Karachi</h4>
                  {/* <p className={styles.infoVal}>Bahnhofstrasse 42, 8001 Zürich, Switzerland</p> */}
                </div>
              </div>

              {/* <div className={styles.infoItem}>
                <Clock size={22} className={styles.icon} />
                <div>
                  <h4 className={styles.infoTitle}>Concierge Hours</h4>
                  <p className={styles.infoVal}>Mon - Sat: 09:00 - 19:00 CET</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.formCol}>
            <form className={styles.formCard} onSubmit={handleSubmit}>
              <h3 className={styles.formTitle}>Send a Message</h3>

              <div className={styles.formGroup}>
                <label className="input-label" htmlFor="contact-name">Full Name</label>
                <input type="text" id="contact-name" className="input" placeholder="e.g. Lord Alexander Hamilton" required />
              </div>

              <div className={styles.formGroup}>
                <label className="input-label" htmlFor="contact-email">Email Address</label>
                <input type="email" id="contact-email" className="input" placeholder="alexander@example.com" required />
              </div>

              <div className={styles.formGroup}>
                <label className="input-label" htmlFor="contact-subject">Subject</label>
                <select id="contact-subject" className="input" defaultValue="recommendation">
                  <option value="recommendation">Personal Scent Recommendation</option>
                  <option value="order">Order & Shipping Status</option>
                  <option value="bespoke">Bespoke Flacon Order</option>
                  <option value="other">General Inquiry</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className="input-label" htmlFor="contact-message">Your Message</label>
                <textarea
                  id="contact-message"
                  className="input"
                  rows={5}
                  placeholder="How may our fragrance specialists assist you today?"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={16} />
                Transmit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
