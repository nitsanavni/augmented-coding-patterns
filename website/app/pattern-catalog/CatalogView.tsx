'use client';

import Link from "next/link";
import { MouseEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./page.module.css";
import { CatalogGroupData, CatalogPreviewItem } from "./types";
import { PATTERN_CATALOG_TEST_IDS } from "./test-ids";
import { getCategoryConfig } from "@/app/lib/category-config";

interface CatalogViewProps {
  groups: CatalogGroupData[];
}

interface SelectedCatalogItem {
  groupLabel: string;
  category: CatalogGroupData["category"];
  item: CatalogPreviewItem;
}

export default function CatalogView({ groups }: CatalogViewProps) {
  const [selected, setSelected] = useState<SelectedCatalogItem | null>(null);
  const selectedConfig = selected ? getCategoryConfig(selected.category) : null;

  const handleSelect = (
    event: MouseEvent<HTMLAnchorElement>,
    groupLabel: string,
    category: SelectedCatalogItem["category"],
    item: CatalogPreviewItem
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    setSelected({ groupLabel, category, item });
  };

  const isSelected = (groupLabel: string, item: CatalogPreviewItem) => {
    return selected?.groupLabel === groupLabel && selected.item.slug === item.slug;
  };

  const detailFallback = (
    <p className={styles.placeholderCopy}>Pick a pattern to see its guidance.</p>
  );

  return (
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
        <section className={styles.listSection} aria-labelledby="pattern-catalog-preview-heading">
          <h3 className={styles.subsectionTitle} id="pattern-catalog-preview-heading">
            Catalog preview
          </h3>
          {groups.map((group) => (
            <div key={group.category} className={styles.catalogGroup}>
              <h4 className={styles.groupTitle}>
                {group.label} ({group.items.length})
              </h4>
              <ul className={styles.catalogList} aria-label={group.label}>
                {group.items.map((item) => (
                  <li
                    key={item.slug}
                    className={`${styles.catalogListItem} ${
                      isSelected(group.label, item) ? styles.catalogListItemActive : ""
                    }`}
                  >
                    <Link
                      href={`/${group.category}/${item.slug}`}
                      className={styles.catalogLink}
                      onClick={(event) => handleSelect(event, group.label, group.category, item)}
                    >
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
        {selected && selectedConfig ? (
          <article className={styles.detailContent} aria-live="polite">
            <div className={styles.detailHeader}>
              <div className={styles.detailTitleRow}>
                {selected.item.emojiIndicator && (
                  <span className={styles.detailEmoji} aria-hidden="true">
                    {selected.item.emojiIndicator}
                  </span>
                )}
                <h2 className={styles.detailTitle}>{selected.item.title}</h2>
              </div>
              <span
                className={`${styles.detailBadge} ${styles[selectedConfig.styleClass]}`}
              >
                <span className={styles.detailBadgeIcon}>{selectedConfig.icon}</span>
                {selectedConfig.label}
              </span>
            </div>
            <div className={styles.detailBody}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selected.item.content}
              </ReactMarkdown>
            </div>
            {selected.item.authorNames.length > 0 && (
              <p className={styles.detailFooter}>
                Documented by {selected.item.authorNames.join(", ")}
              </p>
            )}
          </article>
        ) : (
          detailFallback
        )}
      </section>
    </div>
  );
}
