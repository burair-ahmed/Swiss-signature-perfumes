'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, products, reviews } from '@/lib/data';
import { useCartStore } from '@/store/cart-store';
import { ProductCard } from '@/components/ui/ProductCard';
import { ShoppingBag, Heart, Shield, Sparkles, Truck, RotateCcw, Star, CheckCircle, Package } from 'lucide-react';
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

  const [selectedVolume] = useState<string>('50ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'notes' | 'reviews'>('description');
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, '50ml', quantity);
    toast.success(`${quantity}x ${product.name} (50ml) added to cart`);
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
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.mainProductImg}
                  priority
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span className={styles.largeInitial}>{product.name.charAt(0)}</span>
                  <span className={styles.familyTag}>{product.fragranceFamily}</span>
                </div>
              )}
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
              <span className={styles.reviewLink} onClick={() => setActiveTab('reviews')} style={{ cursor: 'pointer' }}>
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>PKR {product.originalPrice.toLocaleString()}</span>
              )}
              <span className={styles.taxNote}>Taxes included. Cash on Delivery (COD) supported.</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <hr className={styles.divider} />

            {/* Volume Display - Only 50ml */}
            <div className={styles.selectorGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className={styles.selectorLabel}>Flacon Size:</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600 }}>Standard Edition</span>
              </div>
              <div className={styles.volumeOptions}>
                <button
                  type="button"
                  className={`${styles.volumeBtn} ${styles.volumeActive}`}
                  style={{ cursor: 'default' }}
                >
                  <Package size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  50ml Extrait de Parfum
                </button>
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className={styles.actionRow}>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.qtyVal}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart} id="add-to-cart-btn">
                <ShoppingBag size={18} />
                Add to Cart — PKR {(product.price * quantity).toLocaleString()}
              </button>

              <button className={styles.wishlistBtn} aria-label="Add to wishlist" onClick={() => toast.success('Added to wishlist')}>
                <Heart size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <Truck size={18} className={styles.trustIcon} />
                <span>Cash on Delivery Across Pakistan</span>
              </div>
              <div className={styles.trustItem}>
                <Shield size={18} className={styles.trustIcon} />
                <span>100% Authentic Swiss Quality</span>
              </div>
              <div className={styles.trustItem}>
                <RotateCcw size={18} className={styles.trustIcon} />
                <span>50ml Luxury Crystal Flacon</span>
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
              Story & Scent Profile
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
                    <p className={styles.summaryTitle}>Exceptional Customer Rating</p>
                    <p className={styles.summarySub}>Based on {product.reviewCount} verified client evaluations across Pakistan</p>
                  </div>
                </div>

                {/* Pakistani Client Reviews List */}
                <div className={styles.reviewsList}>
                  {reviews.map((rev) => (
                    <div key={rev.id} className={styles.reviewItemCard}>
                      <div className={styles.reviewItemHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className={styles.reviewerAvatar}>
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className={styles.reviewerName}>{rev.name}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                              <CheckCircle size={14} className="text-gold" />
                              <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>Verified Pakistani Buyer</span>
                            </div>
                          </div>
                        </div>
                        <span className={styles.reviewDate}>{rev.date}</span>
                      </div>
                      <div className={styles.stars} style={{ margin: '0.75rem 0' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} className={s <= rev.rating ? styles.starFilled : styles.starEmpty} fill="currentColor" />
                        ))}
                      </div>
                      <p className={styles.reviewComment}>&ldquo;{rev.text}&rdquo;</p>
                    </div>
                  ))}
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

