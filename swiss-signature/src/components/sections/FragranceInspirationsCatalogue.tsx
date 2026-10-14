'use client';

import { useState, useMemo } from 'react';
import { 
  Check, 
  ShoppingBag, 
  MessageCircle, 
  X, 
  FlaskConical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart-store';
import { Product } from '@/lib/types';
import styles from './FragranceInspirationsCatalogue.module.css';

const MEN_NODES = [
  'Aventus (Creed)',
  'Sauvage Elixir (Dior)',
  'Bleu de Chanel EDP',
  'Dior Homme Intense',
  'Acqua di Gio Profumo',
  'Terre d\'Hermès',
  'Y EDP (YSL)',
  'Le Male Le Parfum (Jean Paul Gaultier)',
  '1 Million Lucky (Paco Rabanne)',
  'Invictus Victory',
  'Stronger With You Intensely (Armani)',
  'Ombre Leather (Tom Ford)',
  'Tobacco Vanille (Tom Ford)',
  'Spicebomb Extreme (Viktor & Rolf)',
  'Layton (Parfums de Marly)',
  'Pegasus (Parfums de Marly)',
  'Baccarat Rouge 540 Extrait (Unisex)',
  'Silver Mountain Water (Creed)',
  'Green Irish Tweed (Creed)',
  'Hacivat (Nishane)',
  'Club de Nuit Intense Man',
  'Eros EDP (Versace)',
  'Dylan Blue (Versace)',
  'Gentleman Reserve Privée (Givenchy)',
  'The One EDP (Dolce & Gabbana)',
];

const WOMEN_NODES = [
  'Baccarat Rouge 540',
  'Coco Mademoiselle (Chanel)',
  'Libre Intense (YSL)',
  'Black Opium (YSL)',
  'La Vie Est Belle (Lancôme)',
  'Good Girl (Carolina Herrera)',
  'Delina (Parfums de Marly)',
  'Delina Exclusif',
  'Miss Dior Blooming Bouquet',
  'J\'adore (Dior)',
  'Bright Crystal (Versace)',
  'Crystal Noir (Versace)',
  'Chance Eau Tendre (Chanel)',
  'Mon Paris (YSL)',
  'Si Passione (Giorgio Armani)',
  'My Way (Giorgio Armani)',
  'Flowerbomb (Viktor & Rolf)',
  'Alien (Mugler)',
  'Angel Nova (Mugler)',
  'Love Don\'t Be Shy (Kilian)',
  'Good Girl Blush',
  'Narciso Rodriguez For Her',
  'Burberry Her',
  'Gucci Bloom',
  'Kayali Vanilla 28',
];

export function FragranceInspirationsCatalogue() {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const selectedVolume = '50ml';
  const customPerfumePrice = 2499;
  const { addItem } = useCartStore();

  const toggleSelect = (title: string) => {
    setSelectedNodes(prev => 
      prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]
    );
  };

  // Add custom perfume with selected nodes to cart
  const handleOrderCustomPerfume = () => {
    if (selectedNodes.length === 0) return;

    const blendName = selectedNodes.length === 1 
      ? `Custom Perfume: ${selectedNodes[0]}`
      : `Bespoke Blend (${selectedNodes.length} Nodes)`;

    const customProduct: Product = {
      id: `custom-perfume-${Date.now()}`,
      name: blendName,
      slug: `custom-perfume-${Date.now()}`,
      tagline: `Custom 50ml formulation based on: ${selectedNodes.join(' + ')}`,
      price: customPerfumePrice,
      image: '/products/swiss-coco.jpeg',
      images: ['/products/swiss-coco.jpeg'],
      category: 'unisex',
      fragranceFamily: 'Custom Bespoke Creation',
      volume: [selectedVolume],
      description: `Bespoke custom perfume formulated with Swiss oils based on selected nodes: ${selectedNodes.join(', ')}.`,
      longDescription: `Handcrafted Swiss Signature custom fragrance flacon (50ml) formulated according to your selected olfactory inspirations.`,
      notes: {
        top: ['Custom Accord'],
        heart: ['Master Formulation'],
        base: ['Swiss Sillage Base'],
      },
      rating: 5.0,
      reviewCount: 1,
      badge: 'limited',
      inStock: true,
    };

    addItem(customProduct, selectedVolume, 1);
    toast.success(`Custom Perfume (50ml) added to cart!`);
    setSelectedNodes([]);
  };

  // WhatsApp order link with pre-filled message of selected nodes
  const whatsappUrl = useMemo(() => {
    if (selectedNodes.length === 0) return 'https://wa.me/923232413377';

    const nodesList = selectedNodes.map((n, i) => `${i + 1}. ${n}`).join('\n');
    const message = encodeURIComponent(
      `Hello Swiss Signature Perfumes!\nI would like to order a Custom Perfume (50ml) formulated with the following nodes:\n\n` +
      `${nodesList}\n\n` +
      `Bottle Size: 50ml\n` +
      `Price: PKR ${customPerfumePrice.toLocaleString()}\n\n` +
      `Please confirm my custom order details!`
    );

    return `https://wa.me/923232413377?text=${message}`;
  }, [selectedNodes, customPerfumePrice]);

  return (
    <section className={styles.section} id="olfactory-catalogue">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <FlaskConical size={14} />
            <span>Custom Perfume Atelier</span>
          </div>
          <h2 className={styles.title}>
            Available Scent Nodes <span>&amp; Inspirations</span>
          </h2>
          <p className={styles.subtitle}>
            These fragrance nodes are available in our Swiss laboratory. Select any nodes to create and order your custom perfume (50ml).
          </p>
        </div>

        {/* Two Columns Grid */}
        <div className={styles.columnsGrid}>
          {/* COLUMN 1: MEN'S NODES */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h3 className={styles.colTitle}>Men&apos;s Fragrances</h3>
              <span className={styles.colCount}>{MEN_NODES.length} Nodes</span>
            </div>

            <div className={styles.list}>
              {MEN_NODES.map((title, idx) => {
                const isSelected = selectedNodes.includes(title);
                return (
                  <div
                    key={title}
                    className={`${styles.itemRow} ${isSelected ? styles.itemRowSelected : ''}`}
                    onClick={() => toggleSelect(title)}
                  >
                    <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}>
                      {isSelected && <Check size={13} color="#0A0A0A" strokeWidth={3.5} />}
                    </div>
                    <span className={styles.indexNum}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.fragranceTitle}>{title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: WOMEN'S NODES */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h3 className={styles.colTitle}>Women&apos;s Fragrances</h3>
              <span className={styles.colCount}>{WOMEN_NODES.length} Nodes</span>
            </div>

            <div className={styles.list}>
              {WOMEN_NODES.map((title, idx) => {
                const isSelected = selectedNodes.includes(title);
                return (
                  <div
                    key={title}
                    className={`${styles.itemRow} ${isSelected ? styles.itemRowSelected : ''}`}
                    onClick={() => toggleSelect(title)}
                  >
                    <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}>
                      {isSelected && <Check size={13} color="#0A0A0A" strokeWidth={3.5} />}
                    </div>
                    <span className={styles.indexNum}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.fragranceTitle}>{title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FLOATING ACTION BAR FOR ORDERING CUSTOM PERFUME (50ml ONLY) */}
        {selectedNodes.length > 0 && (
          <div className={styles.stickyBar}>
            <div className={styles.stickyLeft}>
              <span className={styles.selectedCountBadge}>
                {selectedNodes.length} Selected (50ml)
              </span>

              <span className={styles.selectedNamesPreview}>
                {selectedNodes.join(' + ')}
              </span>
            </div>

            <div className={styles.stickyRight}>
              <button
                className={styles.cartActionBtn}
                onClick={handleOrderCustomPerfume}
              >
                <ShoppingBag size={16} />
                <span>Order Custom Perfume</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waActionBtn}
              >
                <MessageCircle size={16} />
                <span>Order on WhatsApp</span>
              </a>

              <button
                className={styles.clearBtn}
                onClick={() => setSelectedNodes([])}
                title="Clear selection"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
