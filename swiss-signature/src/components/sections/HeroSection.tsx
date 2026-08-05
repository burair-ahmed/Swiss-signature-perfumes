'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const bg = heroRef.current.querySelector(`.${styles.heroBg}`) as HTMLElement;
      if (bg) {
        bg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.hero} ref={heroRef} id="hero-section">
      {/* Background layers */}
      <div className={styles.heroBg}>
        <div className={styles.bgGradient} />
        <div className={styles.bgOrbs}>
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
        </div>
        <div className={styles.bgNoise} />
      </div>

      {/* Decorative frame */}
      <div className={styles.frame}>
        <div className={`${styles.frameLine} ${styles.frameTop}`} />
        <div className={`${styles.frameLine} ${styles.frameBottom}`} />
        <div className={`${styles.frameLine} ${styles.frameLeft}`} />
        <div className={`${styles.frameLine} ${styles.frameRight}`} />
      </div>

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={styles.inner}>
          {/* Logo Crest Emblem */}
          <div className={styles.heroCrestWrap}>
            <div className={styles.heroCrest}>
              <Image
                src="/logo.jpg"
                alt="Swiss Signature Crest"
                width={120}
                height={120}
                className={styles.heroLogoImg}
                priority
              />
            </div>
          </div>

          <span className={styles.overline}>Swiss Crafted Luxury</span>

          <h1 className={styles.title}>
            <span className={styles.titleLine}>Where</span>
            <span className={`${styles.titleLine} ${styles.titleAccent}`}>Elegance</span>
            <span className={styles.titleLine}>Meets Scent</span>
          </h1>

          <p className={styles.subtitle}>
            Meticulously crafted fragrances born from Swiss precision and the world&apos;s finest
            ingredients. Each bottle tells a story of excellence.
          </p>

          <div className={styles.ctas}>
            <Link href="/shop" className="btn btn-primary btn-lg" id="hero-cta-shop">
              Explore Collection
              <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn btn-secondary btn-lg" id="hero-cta-about">
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>9+</span>
              <span className={styles.miniStatLabel}>Signature Scents</span>
            </div>
            <div className={styles.miniStatDivider} />
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>50K+</span>
              <span className={styles.miniStatLabel}>Happy Customers</span>
            </div>
            <div className={styles.miniStatDivider} />
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>100%</span>
              <span className={styles.miniStatLabel}>Swiss Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll to explore</span>
        <ChevronDown size={20} className={styles.scrollIcon} />
      </div> */}
    </section>
  );
}
