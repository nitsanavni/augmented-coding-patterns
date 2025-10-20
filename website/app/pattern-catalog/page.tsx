import Link from "next/link";
import styles from "./page.module.css";
import { PATTERN_CATALOG_TEST_IDS } from "./test-ids";
import { PATTERN_CATALOG_GROUPS } from "./constants";
import { getAllPatterns } from "@/lib/markdown";
import { PatternCategory } from "@/lib/types";

interface CatalogListItem {
  slug: string;
  title: string;
  emojiIndicator?: string;
}

interface CatalogGroup {
  category: PatternCategory;
  label: string;
  items: CatalogListItem[];
}

function buildCatalogGroups(): CatalogGroup[] {
  return PATTERN_CATALOG_GROUPS.map(({ category, label }) => {
    const items = getAllPatterns(category)
      .map((pattern) => ({
        slug: pattern.slug,
        title: pattern.title,
        emojiIndicator: pattern.emojiIndicator,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

    return {
      category,
      label,
      items,
    };
  });
}

export default function PatternCatalogPage() {
  const catalogGroups = buildCatalogGroups();

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
            {catalogGroups.map(({ category, label, items }) => (
              <div key={category} className={styles.catalogGroup}>
                <h4 className={styles.groupTitle}>
                  {label} ({items.length})
                </h4>
                <ul className={styles.catalogList} aria-label={label}>
                  {items.map((item) => (
                    <li key={item.slug} className={styles.catalogListItem}>
                      <Link href={`/${category}/${item.slug}`} className={styles.catalogLink}>
                        {item.emojiIndicator && (
                          <span aria-hidden="true" className={styles.catalogEmoji}>
                            {item.emojiIndicator}
                          </span>
                        )}
                        <span className={styles.catalogTitle}>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
