'use client';

import Link from 'next/link';
import { X, Share2, Globe, Sparkles } from 'lucide-react';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.menu} ${isOpen ? styles.open : ''}`} id="mobile-menu">
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Menu</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className={styles.menuNav}>
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.menuLink}
              onClick={onClose}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className={styles.menuLinkText}>{link.label}</span>
              <span className={styles.menuLinkLine} />
            </Link>
          ))}
        </nav>

        <div className={styles.menuFooter}>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Share"><Share2 size={20} /></a>
            <a href="#" className={styles.socialLink} aria-label="Website"><Globe size={20} /></a>
            <a href="#" className={styles.socialLink} aria-label="Luxury"><Sparkles size={20} /></a>
          </div>
          <p className={styles.menuTagline}>Swiss Precision. Timeless Elegance.</p>
        </div>
      </div>
    </>
  );
}
