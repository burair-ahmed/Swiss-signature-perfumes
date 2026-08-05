'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, products } from '@/lib/data';
import { useCartStore } from '@/store/cart-store';
import { ProductCard } from '@/components/ui/ProductCard';
import { ShoppingBag, Heart, Shield, Sparkles, Truck, RotateCcw, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './ProductDetail.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const [selectedVolume, setSelectedVolume] = useState<string>(product.volume[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'notes' | 'reviews'>('description');
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, selectedVolume, quantity);
    toast.success(`${quantity}x ${product.name} (${selectedVolume}) added to cart`);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span className={styles.currentBreadcrumb}>{product.name}</span>
        </div>

        {/* Product Overview Section */}
        <div className={styles.grid}>
          {/* Product Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              <div className={styles.imagePlaceholder}>
                <span className={styles.largeInitial}>{product.name.charAt(0)}</span>
                <span className={styles.familyTag}>{product.fragranceFamily}</span>
              </div>
              {product.badge && (
                <span className={`${styles.badge} ${product.badge === 'new' ? styles.badgeNew : styles.badgeGold}`}>
                  {product.badge === 'bestseller' ? 'Best Seller' : product.badge === 'new' ? 'New Release' : 'Limited Edition'}
                </span>
              )}
            </div>
          </div>

          {/* Product Details & Purchase Actions */}
          <div className={styles.details}>
            <span className="text-caption text-gold">{product.fragranceFamily}</span>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.tagline}>{product.tagline}</p>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className={star <= Math.round(product.rating) ? styles.starFilled : styles.starEmpty} fill="currentColor" />
                ))}
              </div>
              <span className={styles.ratingScore}>{product.rating}</span>
              <span className={styles.reviewLink}>({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>${product.originalPrice}</span>
              )}
              <span className={styles.taxNote}>Taxes included. Free Swiss shipping.</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <hr className={styles.divider} />

            {/* Volume Selector */}
            <div className={styles.selectorGroup}>
              <label className={styles.selectorLabel}>Select Flacon Size:</label>
              <div className={styles.volumeOptions}>
                {product.volume.map((vol) => (
                  <button
                    key={vol}
                    className={`${styles.volumeBtn} ${selectedVolume === vol ? styles.volumeActive : ''}`}
                    onClick={() => setSelectedVolume(vol)}
                  >
                    {vol}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className={styles.actionRow}>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className={styles.qtyVal}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart} id="add-to-cart-btn">
                <ShoppingBag size={18} />
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>

              <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                <Heart size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <Truck size={18} className={styles.trustIcon} />
                <span>Express Worldwide Shipping</span>
              </div>
              <div className={styles.trustItem}>
                <Shield size={18} className={styles.trustIcon} />
                <span>100% Authentic Swiss Quality</span>
              </div>
              <div className={styles.trustItem}>
                <RotateCcw size={18} className={styles.trustIcon} />
                <span>Complimentary Sample Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section (Description, Notes Pyramid, Reviews) */}
        <div className={styles.tabSection}>
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabTitleBtn} ${activeTab === 'description' ? styles.tabTitleActive : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Story & Ingredients
            </button>
            <button
              className={`${styles.tabTitleBtn} ${activeTab === 'notes' ? styles.tabTitleActive : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Fragrance Pyramid
            </button>
            <button
              className={`${styles.tabTitleBtn} ${activeTab === 'reviews' ? styles.tabTitleActive : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.longDesc}>
                <p>{product.longDescription}</p>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className={styles.pyramidGrid}>
                <div className={styles.pyramidCard}>
                  <Sparkles size={24} className={styles.pyramidIcon} />
                  <h4 className={styles.pyramidLevel}>Top Notes</h4>
                  <p className={styles.pyramidSub}>Initial Impression (0 - 15 mins)</p>
                  <ul className={styles.notesList}>
                    {product.notes.top.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.pyramidCard}>
                  <Sparkles size={24} className={styles.pyramidIcon} />
                  <h4 className={styles.pyramidLevel}>Heart Notes</h4>
                  <p className={styles.pyramidSub}>The Scent Core (15 mins - 4 hrs)</p>
                  <ul className={styles.notesList}>
                    {product.notes.heart.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.pyramidCard}>
                  <Sparkles size={24} className={styles.pyramidIcon} />
                  <h4 className={styles.pyramidLevel}>Base Notes</h4>
                  <p className={styles.pyramidSub}>The Sillage & Dry Down (4 - 16+ hrs)</p>
                  <ul className={styles.notesList}>
                    {product.notes.base.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviewsTab}>
                <div className={styles.reviewSummary}>
                  <span className={styles.bigRating}>{product.rating}</span>
                  <div>
                    <p className={styles.summaryTitle}>Exceptional Rating</p>
                    <p className={styles.summarySub}>Based on {product.reviewCount} verified client evaluations</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <h3 className="text-heading">You May Also Appreciate</h3>
              <Link href="/shop" className="btn btn-ghost">View All</Link>
            </div>
            <div className="grid-products">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
