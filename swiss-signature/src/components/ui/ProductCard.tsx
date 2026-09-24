'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.volume[0] || '50ml');
    toast.success(`${product.name} (50ml) added to cart`);
  };

  const badgeLabel = product.badge === 'bestseller' ? 'Best Seller' :
    product.badge === 'new' ? 'New' :
    product.badge === 'limited' ? 'Limited Edition' : null;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={styles.card}
      style={{ animationDelay: `${index * 0.1}s` }}
      id={`product-card-${product.slug}`}
    >
      {/* Badge */}
      {badgeLabel && (
        <span className={`${styles.badge} ${product.badge === 'new' ? styles.badgeNew : styles.badgeGold}`}>
          {badgeLabel}
        </span>
      )}

      {/* Image */}
      <div className={styles.imageWrap}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.productImg}
            priority={index < 4}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.imageInitial}>{product.name.charAt(0)}</span>
            <span className={styles.imageSubtext}>{product.fragranceFamily}</span>
          </div>
        )}

        {/* Hover Actions */}
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={handleAddToCart} aria-label="Add to cart">
            <ShoppingBag size={18} />
          </button>
          <button className={styles.actionBtn} aria-label="Add to wishlist" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <Heart size={18} />
          </button>
          <span className={styles.actionBtn} aria-label="Quick view">
            <Eye size={18} />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.category}>{product.fragranceFamily} • 50ml</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.tagline}>{product.tagline}</p>

        <div className={styles.priceRow}>
          <span className={styles.price}>PKR {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>PKR {product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Rating */}
        <div className={styles.rating}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={star <= Math.round(product.rating) ? styles.starFilled : styles.starEmpty}>
                ★
              </span>
            ))}
          </div>
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}

