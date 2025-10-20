import styles from "./page.module.css";
import { PATTERN_CATALOG_TEST_IDS } from "./test-ids";

export default function PatternCatalogPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pattern Catalog</h1>
        <p className={styles.description}>
          Explore every pattern, anti-pattern, and obstacle in one organized place as we shape the next
          evolution of the knowledge base.
        </p>
      </header>
      <div className={styles.layout}>
        <aside data-testid={PATTERN_CATALOG_TEST_IDS.sidebar} className={styles.sidebar}>
          <h2 className={styles.sectionTitle}>Browse catalog</h2>
          <p className={styles.placeholderCopy}>Catalog navigation lives here soon.</p>
        </aside>
        <section data-testid={PATTERN_CATALOG_TEST_IDS.detail} className={styles.detail}>
          <h2 className={styles.sectionTitle}>Pattern details</h2>
          <p className={styles.placeholderCopy}>Pick a pattern to see its guidance.</p>
        </section>
      </div>
    </div>
  );
}
