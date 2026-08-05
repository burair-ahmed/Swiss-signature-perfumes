'use client';

import styles from './IngredientsShowcase.module.css';

const ingredients = [
  {
    name: 'Rare Alpine Edelweiss',
    origin: 'Valais, Switzerland',
    desc: 'Extracted at high altitude, providing unmatched clarity and antioxidant potency to scent oils.',
  },
  {
    name: 'Aged Cambodian Oud',
    origin: 'Koh Kong Region',
    desc: 'Naturally aged over 20 years to produce a rich, resinous, dark woody depth.',
  },
  {
    name: 'Isparta Midnight Rose',
    origin: 'Anatolia, Turkey',
    desc: 'Hand-picked during pre-dawn hours to preserve fragile aromatic essential oil molecules.',
  },
  {
    name: 'Baltic Golden Amber',
    origin: 'Northern Europe',
    desc: 'Warm, luminous resin accord that imbues our perfumes with unforgettable trail and sillage.',
  },
];

export function IngredientsShowcase() {
  return (
    <section className={`section ${styles.section}`} id="ingredients-showcase">
      <div className="container">
        <div className="flex-col-center" style={{ marginBottom: '3.5rem' }}>
          <span className="text-caption text-gold">The Palette of Perfection</span>
          <h2 className="text-display-md" style={{ marginTop: '0.25rem' }}>
            Rare & Precious Ingredients
          </h2>
          <div className="gold-line gold-line-center" />
        </div>

        <div className={styles.grid}>
          {ingredients.map((ing, idx) => (
            <div key={idx} className={styles.card}>
              <span className={styles.number}>0{idx + 1}</span>
              <span className={styles.origin}>{ing.origin}</span>
              <h3 className={styles.name}>{ing.name}</h3>
              <p className={styles.desc}>{ing.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
