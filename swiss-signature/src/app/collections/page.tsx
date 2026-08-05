import Link from 'next/link';
import { collections, getCollectionProducts } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';
import styles from './CollectionsPage.module.css';

export default function CollectionsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className="container flex-col-center">
          <span className="text-caption text-gold">Curated Sets & Themes</span>
          <h1 className="text-display-lg" style={{ marginTop: '0.25rem' }}>
            Exclusive Collections
          </h1>
          <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', maxWidth: '600px' }}>
            Explore olfactory narratives assembled by our master perfumers for memorable occasions and distinct moods.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {collections.map((col) => {
          const colProducts = getCollectionProducts(col);

          return (
            <div key={col.id} className={styles.collectionBlock}>
              <div className={styles.collectionHeader}>
                <div>
                  <span className="text-caption text-gold">Collection</span>
                  <h2 className="text-display-md" style={{ marginTop: '0.25rem' }}>
                    {col.name}
                  </h2>
                  <p className={styles.colDesc}>{col.description}</p>
                </div>
                <Link href={`/shop`} className="btn btn-secondary">
                  Explore Collection
                </Link>
              </div>

              <div className="grid-products">
                {colProducts.map((p, idx) => (
                  <ProductCard key={p.id} product={p} index={idx} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
