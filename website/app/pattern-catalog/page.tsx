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
            <fieldset className={styles.filterGroup}>
              <legend className={styles.filterLabel}>Type</legend>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="type" value="all" disabled defaultChecked />
                All types
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="type" value="pattern" disabled />
                Patterns
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="type" value="anti-pattern" disabled />
                Anti-patterns
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="type" value="obstacle" disabled />
                Obstacles
              </label>
            </fieldset>
            <fieldset className={styles.filterGroup}>
              <legend className={styles.filterLabel}>Author</legend>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="author" value="all" disabled defaultChecked />
                All authors
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="author" value="placeholder-author" disabled />
                Placeholder author
              </label>
            </fieldset>
          </div>
          <section
            className={styles.listSection}
            aria-labelledby="pattern-catalog-preview-heading"
          >
            <h3 className={styles.subsectionTitle} id="pattern-catalog-preview-heading">
              Catalog preview
            </h3>
            <div className={styles.stubGroup}>
              <h4 className={styles.groupTitle} id="pattern-catalog-preview-patterns">
                Patterns
              </h4>
              <ul className={styles.stubList} aria-labelledby="pattern-catalog-preview-patterns">
                <li className={styles.stubListItem}>Sample pattern placeholder</li>
              </ul>
            </div>
            <div className={styles.stubGroup}>
              <h4 className={styles.groupTitle} id="pattern-catalog-preview-anti-patterns">
                Anti-patterns
              </h4>
              <ul className={styles.stubList} aria-labelledby="pattern-catalog-preview-anti-patterns">
                <li className={styles.stubListItem}>Sample anti-pattern placeholder</li>
              </ul>
            </div>
            <div className={styles.stubGroup}>
              <h4 className={styles.groupTitle} id="pattern-catalog-preview-obstacles">
                Obstacles
              </h4>
              <ul className={styles.stubList} aria-labelledby="pattern-catalog-preview-obstacles">
                <li className={styles.stubListItem}>Sample obstacle placeholder</li>
              </ul>
            </div>
          </section>
        </aside>
        <section data-testid={PATTERN_CATALOG_TEST_IDS.detail} className={styles.detail}>
          <h2 className={styles.sectionTitle}>Pattern details</h2>
          <p className={styles.placeholderCopy}>Pick a pattern to see its guidance.</p>
        </section>
      </div>
    </div>
  );
}
