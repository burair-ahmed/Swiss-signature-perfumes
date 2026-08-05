'use client';

import styles from './StatsBar.module.css';

const stats = [
  { value: '100%', label: 'Swiss Formulated' },
  { value: '16+ hrs', label: 'Extrait Longevity' },
  { value: '50K+', label: 'Global Clients' },
  { value: '4.9 ★', label: 'Customer Rating' },
];

export function StatsBar() {
  return (
    <section className={styles.bar} id="stats-bar">
      <div className="container">
        <div className={styles.grid}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
