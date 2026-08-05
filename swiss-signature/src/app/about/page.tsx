import { ShieldCheck, Award, Leaf, Flame } from 'lucide-react';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className="container flex-col-center">
          <span className="text-caption text-gold">The House of Swiss Signature</span>
          <h1 className="text-display-lg" style={{ marginTop: '0.25rem' }}>
            Our Heritage & Vision
          </h1>
          <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', maxWidth: '650px' }}>
            Where Swiss precision engineering meets the emotional art of fine perfumery.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {/* Story Section */}
        <div className={styles.storyGrid}>
          <div>
            <span className="text-caption text-gold">Founded in Zurich</span>
            <h2 className="text-display-md" style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
              Redefining Modern Niche Perfumery
            </h2>
            <hr className="gold-line" />
            <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Swiss Signature Perfumes was established with a singular ambition: to synthesize the legendary precision of Swiss craftsmanship with the emotive artistry of high perfumery.
            </p>
            <p className="text-body" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Every fragrance is hand-compounded in small batches in Pakistan, utilizing rare botanicals, premium essential oils, aged ouds, and carefully selected florals. We reject mass production in favor of uncompromising artisanal quality.            </p>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyEmblem}>SS</div>
            <p className={styles.storyQuote}>
              &ldquo;True luxury does not shout. It lingers gently, leaving an indelible signature that commands respect.&rdquo;
            </p>
            <span className={styles.quoteAuthor}>— Master Perfumer, Swiss Signature</span>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className={styles.pillarsSection}>
          <div className="flex-col-center" style={{ marginBottom: '3.5rem' }}>
            <span className="text-caption text-gold">Uncompromising Standards</span>
            <h2 className="text-display-md" style={{ marginTop: '0.25rem' }}>
              The Four Pillars of Excellence
            </h2>
            <div className="gold-line gold-line-center" />
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <ShieldCheck size={32} className={styles.pillarIcon} />
              <h3 className={styles.pillarTitle}>Swiss Botanical Purity</h3>
              <p className={styles.pillarText}>
                Cold-extracted alpine botanicals blended with pristine glacier spring waters for crystal-clear olfactory brilliance.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <Award size={32} className={styles.pillarIcon} />
              <h3 className={styles.pillarTitle}>Extraits Concentration</h3>
              <p className={styles.pillarText}>
                Formulated at 25%-30% perfume concentration, offering superior longevity and rich projection that lasts 16+ hours.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <Leaf size={32} className={styles.pillarIcon} />
              <h3 className={styles.pillarTitle}>Ethical Sourcing</h3>
              <p className={styles.pillarText}>
                Cruelty-free, sustainably harvested ingredients directly supporting small family-owned aromatic farms globally.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <Flame size={32} className={styles.pillarIcon} />
              <h3 className={styles.pillarTitle}>Hand-Polished Glassware</h3>
              <p className={styles.pillarText}>
                Encased in weighted French crystal flacons with custom gold electroplated caps and magnetic seal lids.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
