'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Share2, Globe, Sparkles } from 'lucide-react';
import styles from './Footer.module.css';

const shopLinks = [
  { href: '/shop', label: 'All Fragrances' },
  { href: '/shop?category=men', label: 'For Men' },
  { href: '/shop?category=women', label: 'For Women' },
  { href: '/shop?category=unisex', label: 'Unisex' },
  { href: '/shop?category=gift-set', label: 'Gift Sets' },
];

const companyLinks = [
  { href: '/about', label: 'Our Story' },
  { href: '/collections', label: 'Collections' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/admin', label: 'Admin Portal' },
];


export function Footer() {
  return (
    <footer className={styles.footer} id="site-footer">
      {/* Newsletter */}
      <div className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterContent}>
              <h3 className={styles.newsletterTitle}>Join the Inner Circle</h3>
              <p className={styles.newsletterText}>
                Be the first to discover new fragrances, exclusive offers, and the art behind Swiss Signature.
              </p>
            </div>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.newsletterInput}
                id="newsletter-email"
                required
              />
              <button type="submit" className="btn btn-primary" id="newsletter-submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.footerLogo}>
                <div className={styles.logoImageWrap}>
                  <Image
                    src="/logo.jpg"
                    alt="Swiss Signature Perfumes Logo"
                    width={42}
                    height={42}
                    className={styles.logoImg}
                  />
                </div>
                <span className={styles.logoTextGroup}>
                  <span className={styles.logoBrand}>Swiss Signature</span>
                  <span className={styles.logoSub}>Perfumes</span>
                </span>
              </Link>
              <p className={styles.brandDescription}>
                Crafted with Swiss precision and a passion for excellence, our fragrances are an invitation to discover your most elegant self.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink} aria-label="Instagram"><Share2 size={18} /></a>
                <a href="#" className={styles.socialLink} aria-label="Facebook"><Globe size={18} /></a>
                <a href="#" className={styles.socialLink} aria-label="Twitter"><Sparkles size={18} /></a>
              </div>
            </div>

            {/* Shop Links */}
            <div className={styles.linkCol}>
              <h4 className={styles.colTitle}>Shop</h4>
              <ul className={styles.linkList}>
                {shopLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className={styles.link}>{link.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className={styles.linkCol}>
              <h4 className={styles.colTitle}>Company</h4>
              <ul className={styles.linkList}>
                {companyLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className={styles.link}>{link.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.linkCol}>
              <h4 className={styles.colTitle}>Contact</h4>
              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <Mail size={16} />
                  <a href="mailto:hello@swisssignature.com">hello@swisssignature.com</a>
                </li>
                <li className={styles.contactItem}>
                  <Phone size={16} />
                  <a href="tel:+41001234567">+41 00 123 45 67</a>
                </li>
                <li className={styles.contactItem}>
                  <MapPin size={16} />
                  <span>Zurich, Switzerland</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} Swiss Signature Perfumes. All rights reserved.
            </p>
            <p className={styles.tagline}>Swiss Precision. Timeless Elegance.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
