'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, Search, Heart, User } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { MobileMenu } from './MobileMenu';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, getItemCount } = useCartStore();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(getItemCount());
  }, [getItemCount]);

  useEffect(() => {
    const unsub = useCartStore.subscribe((state) => {
      setItemCount(state.items.reduce((t, i) => t + i.quantity, 0));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`} id="main-header">
        <div className={`container ${styles.inner}`}>
          {/* Mobile Menu Button */}
          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            id="mobile-menu-toggle"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo} id="header-logo">
            <div className={styles.logoImageWrap}>
              <Image
                src="/logo.jpg"
                alt="Swiss Signature Perfumes Logo"
                width={48}
                height={48}
                className={styles.logoImg}
                priority
              />
            </div>
            <span className={styles.logoText}>
              <span className={styles.logoBrand}>Swiss Signature</span>
              <span className={styles.logoSub}>Perfumes</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} id="main-nav">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.iconBtn} aria-label="Search" id="search-toggle">
              <Search size={20} />
            </button>
            <Link href="/account" className={styles.iconBtn} aria-label="Account" id="account-link">
              <User size={20} />
            </Link>
            <Link href="/account" className={styles.iconBtn} aria-label="Wishlist" id="wishlist-link">
              <Heart size={20} />
            </Link>
            <button className={styles.cartBtn} onClick={openCart} aria-label="Cart" id="cart-toggle">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className={styles.cartBadge}>{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </>
  );
}
