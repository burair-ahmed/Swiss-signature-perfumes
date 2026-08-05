'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, Feather } from 'lucide-react';
import styles from './BrandStory.module.css';

export function BrandStory() {
  return (
    <section className={`section ${styles.brandStory}`} id="brand-story">
      <div className="container">
        <div className={styles.grid}>
          {/* Visual Panel */}
          <div className={styles.visualCol}>
            <div className={styles.visualCard}>
              <div className={styles.emblemWrapper}>
                <Image
                  src="/logo.jpg"
                  alt="Swiss Signature Gold Emblem"
                  width={180}
                  height={180}
                  className={styles.brandLogoImg}
                />
                <span className={styles.emblemSub}>EST. 2024</span>
              </div>
              <div className={styles.visualOverlay} />
            </div>
            <div className={styles.floatingBadge}>
              <Sparkles size={20} className={styles.goldIcon} />
              <div>
                <p className={styles.badgeTitle}>Swiss Standard</p>
                <p className={styles.badgeSub}>Hand-bottled in Zurich</p>
              </div>
            </div>
          </div>

          {/* Content Panel */}
          <div className={styles.contentCol}>
            <span className="text-caption text-gold">The Heritage</span>
            <h2 className="text-display-md" style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
              Crafted with Precision. Born in the Alps.
            </h2>
            <hr className="gold-line" />
            <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              At Swiss Signature, perfume is not merely a fragrance — it is a symphony of memory, emotion, and alpine artistry. Each bottle represents hundreds of hours of precision formulation.
            </p>
            <p className="text-body" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              We source the rarest botanicals from high-altitude Swiss valleys and fuse them with master perfumery techniques from Grasse. The result is an extraordinary collection of scents that linger with quiet confidence.
            </p>

            <div className={styles.pillars}>
              <div className={styles.pillar}>
                <ShieldCheck size={24} className={styles.pillarIcon} />
                <div>
                  <h4 className={styles.pillarTitle}>Swiss Purity</h4>
                  <p className={styles.pillarDesc}>Distilled with pure glacier waters and natural essential oils.</p>
                </div>
              </div>

              <div className={styles.pillar}>
                <Feather size={24} className={styles.pillarIcon} />
                <div>
                  <h4 className={styles.pillarTitle}>Unrivaled Longevity</h4>
                  <p className={styles.pillarDesc}>High-concentration Extraits de Parfum that last over 16+ hours.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <Link href="/about" className="btn btn-secondary">
                Read Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
