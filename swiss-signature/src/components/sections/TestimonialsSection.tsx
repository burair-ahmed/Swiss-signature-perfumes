'use client';

import { reviews } from '@/lib/data';
import { Quote } from 'lucide-react';
import styles from './TestimonialsSection.module.css';

export function TestimonialsSection() {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="flex-col-center" style={{ marginBottom: '3.5rem' }}>
          <span className="text-caption text-gold">Client Reflections</span>
          <h2 className="text-display-md" style={{ marginTop: '0.25rem' }}>
            Praised by Connoisseurs
          </h2>
          <div className="gold-line gold-line-center" />
        </div>

        <div className={styles.grid}>
          {reviews.slice(0, 3).map((item) => (
            <div key={item.id} className={styles.card}>
              <Quote size={28} className={styles.quoteIcon} />

              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={styles.star}>
                    ★
                  </span>
                ))}
              </div>

              <p className={styles.text}>&ldquo;{item.text}&rdquo;</p>

              <div className={styles.authorRow}>
                <div className={styles.avatarPlaceholder}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className={styles.authorName}>{item.name}</h4>
                  <span className={styles.verifiedTag}>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
