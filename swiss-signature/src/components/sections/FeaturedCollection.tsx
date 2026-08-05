'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { getFeaturedProducts } from '@/lib/data';
import styles from './FeaturedCollection.module.css';

export function FeaturedCollection() {
  const featured = getFeaturedProducts();

  return (
    <section className="section" id="featured-collection">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="text-caption text-gold">Curated Masterpieces</span>
            <h2 className="text-display-md" style={{ marginTop: '0.25rem' }}>
              Featured Collection
            </h2>
          </div>
          <Link href="/shop" className={styles.viewAll}>
            <span>View All Scents</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-products">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
