'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './CategoryShowcase.module.css';

const categories = [
  {
    title: 'Pour Homme',
    subtitle: 'Men’s Luxury Fragrances',
    href: '/shop?category=men',
    tag: 'Bold & Regal',
    initials: 'PH',
  },
  {
    title: 'Pour Femme',
    subtitle: 'Women’s Signature Scents',
    href: '/shop?category=women',
    tag: 'Ethereal & Sensual',
    initials: 'PF',
  },
  {
    title: 'Unisex Collection',
    subtitle: 'Genderless Artistry',
    href: '/shop?category=unisex',
    tag: 'Harmonious & Avant-Garde',
    initials: 'UC',
  },
  {
    title: 'Gift Coffrets',
    subtitle: 'Curated Presentation Boxes',
    href: '/shop?category=gift-set',
    tag: 'Exclusive & Memorable',
    initials: 'GC',
  },
];

// export function CategoryShowcase() {
//   return (
//     <section className="section" id="category-showcase">
//       <div className="container">
//         <div className="flex-col-center" style={{ marginBottom: '3.5rem' }}>
//           <span className="text-caption text-gold">Explore By Family</span>
//           <h2 className="text-display-md" style={{ marginTop: '0.25rem' }}>
//             Olfactory Universes
//           </h2>
//           <div className="gold-line gold-line-center" />
//         </div>

//         <div className={styles.grid}>
//           {categories.map((cat, idx) => (
//             <Link key={idx} href={cat.href} className={styles.card}>
//               <div className={styles.cardBackground}>
//                 <span className={styles.initials}>{cat.initials}</span>
//               </div>
//               <div className={styles.cardContent}>
//                 <span className={styles.tag}>{cat.tag}</span>
//                 <h3 className={styles.title}>{cat.title}</h3>
//                 <p className={styles.subtitle}>{cat.subtitle}</p>
//                 <div className={styles.arrowCircle}>
//                   <ArrowUpRight size={18} />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
