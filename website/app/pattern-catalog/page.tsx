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
          <div className={styles.filters}>
            <h3 className={styles.subsectionTitle}>Filter catalog</h3>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="pattern-catalog-type">
                Type
              </label>
              <select
                className={styles.filterSelect}
                id="pattern-catalog-type"
                name="pattern-catalog-type"
                disabled
              >
                <option>All types</option>
                <option>Patterns</option>
                <option>Anti-patterns</option>
                <option>Obstacles</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="pattern-catalog-author">
                Author
              </label>
              <select
                className={styles.filterSelect}
                id="pattern-catalog-author"
                name="pattern-catalog-author"
                disabled
              >
                <option>All authors</option>
              </select>
            </div>
          </div>
          <div className={styles.listSection}>
            <h3 className={styles.subsectionTitle}>Catalog preview</h3>
            <ul className={styles.stubList} aria-label="Catalog preview">
              <li className={styles.stubListItem}>Sample pattern placeholder</li>
              <li className={styles.stubListItem}>Sample anti-pattern placeholder</li>
              <li className={styles.stubListItem}>Sample obstacle placeholder</li>
            </ul>
          </div>
        </aside>
        <section data-testid={PATTERN_CATALOG_TEST_IDS.detail} className={styles.detail}>
          <h2 className={styles.sectionTitle}>Pattern details</h2>
          <p className={styles.placeholderCopy}>Pick a pattern to see its guidance.</p>
        </section>
      </div>
    </div>
  );
}
