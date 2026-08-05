'use client';

import { useState, useMemo } from 'react';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';
import styles from './ShopPage.module.css';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = [
    { id: 'all', label: 'All Fragrances' },
    { id: 'men', label: 'Pour Homme' },
    { id: 'women', label: 'Pour Femme' },
    { id: 'unisex', label: 'Unisex' },
    { id: 'gift-set', label: 'Gift Sets' },
  ];

  const fragranceFamilies = useMemo(() => {
    const set = new Set(products.map((p) => p.fragranceFamily));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedFamily !== 'all') {
      result = result.filter((p) => p.fragranceFamily === selectedFamily);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, selectedFamily, sortBy]);

  return (
    <div className={styles.page}>
      {/* Header Banner */}
      <div className={styles.banner}>
        <div className="container flex-col-center">
          <span className="text-caption text-gold">The Full Collection</span>
          <h1 className="text-display-lg" style={{ marginTop: '0.25rem' }}>
            Artisanal Perfumes
          </h1>
          <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', maxWidth: '600px' }}>
            Discover luxury scents bottled with Swiss perfection, designed to evoke memory, warmth, and quiet prestige.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {/* Controls / Filter Bar */}
        <div className={styles.filterBar}>
          {/* Category Tabs */}
          <div className={styles.tabs}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tabBtn} ${selectedCategory === cat.id ? styles.tabActive : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filters & Sort */}
          <div className={styles.controls}>
            {/* Fragrance Family Filter */}
            <div className={styles.selectWrapper}>
              <Filter size={14} className={styles.selectIcon} />
              <select
                className={styles.select}
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
              >
                <option value="all">All Scent Families</option>
                {fragranceFamilies.filter((f) => f !== 'all').map((fam) => (
                  <option key={fam} value={fam}>{fam}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className={styles.selectWrapper}>
              <SlidersHorizontal size={14} className={styles.selectIcon} />
              <select
                className={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Count */}
        <div className={styles.countRow}>
          <span className={styles.countText}>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'fragrance' : 'fragrances'}
          </span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid-products">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No Fragrances Found</p>
            <p className={styles.emptyText}>Try adjusting your filters or search criteria.</p>
            <button
              className="btn btn-secondary"
              onClick={() => { setSelectedCategory('all'); setSelectedFamily('all'); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
