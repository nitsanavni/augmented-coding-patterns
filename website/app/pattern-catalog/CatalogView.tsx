'use client';

import Link from "next/link";
import { KeyboardEvent, MouseEvent, useEffect, useMemo, useState } from "react";
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

interface AuthorOption {
  id: string;
  name: string;
}

function extractAuthorOptions(groups: CatalogGroupData[]): AuthorOption[] {
  const authorMap = new Map<string, string>();

  groups.forEach((group) => {
    group.items.forEach((item) => {
      item.authorIds.forEach((authorId, index) => {
        if (!authorMap.has(authorId)) {
          const name = item.authorNames[index] ?? item.authorNames[0] ?? authorId;
          authorMap.set(authorId, name);
        }
      });
    });
  });

  return Array.from(authorMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function CatalogView({ groups }: CatalogViewProps) {
  const [activeTypes, setActiveTypes] = useState<string[]>(() => groups.map((group) => group.category));
  const [activeAuthorIds, setActiveAuthorIds] = useState<string[]>(() => {
    const options = extractAuthorOptions(groups);
    return options.map((option) => option.id);
  });

  const [selected, setSelected] = useState<SelectedCatalogItem | null>(null);
  const selectedConfig = selected ? getCategoryConfig(selected.category) : null;

  const typeOptions = useMemo(
    () => groups.map(({ category, label, icon, styleClass }) => ({ category, label, icon, styleClass })),
    [groups],
  );

  const authorOptions = useMemo(() => extractAuthorOptions(groups), [groups]);

  const allAuthorsSelected = activeAuthorIds.length === authorOptions.length || authorOptions.length === 0;
  const hasTypeFilter = activeTypes.length !== typeOptions.length;
  const hasAuthorFilter = authorOptions.length > 0 && activeAuthorIds.length !== authorOptions.length;
  const hasActiveFilters = hasTypeFilter || hasAuthorFilter;

  const resetFilters = () => {
    setActiveTypes(typeOptions.map(({ category }) => category));
    setActiveAuthorIds(authorOptions.map(({ id }) => id));
  };

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        if (!activeTypes.includes(group.category)) {
          return { ...group, items: [] };
        }

        const items = group.items.filter((item) => {
          if (allAuthorsSelected) {
            return true;
          }

          if (item.authorIds.length === 0) {
            return false;
          }

          return item.authorIds.some((authorId) => activeAuthorIds.includes(authorId));
        });

        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, activeTypes, activeAuthorIds, allAuthorsSelected]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    const stillVisible = filteredGroups.some(
      (group) =>
        group.category === selected.category &&
        group.items.some((item) => item.slug === selected.item.slug),
    );

    if (!stillVisible) {
      setSelected(null);
    }
  }, [filteredGroups, selected]);

  const toggleType = (category: string) => {
    setActiveTypes((prev) => {
      if (prev.includes(category)) {
        return prev.filter((value) => value !== category);
      }

      return [...prev, category];
    });
  };

  const toggleAuthor = (authorId: string) => {
    setActiveAuthorIds((prev) => {
      if (prev.includes(authorId)) {
        return prev.filter((value) => value !== authorId);
      }

      return [...prev, authorId];
    });
  };

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

  const handleKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    groupLabel: string,
    category: SelectedCatalogItem["category"],
    item: CatalogPreviewItem,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected({ groupLabel, category, item });
    }
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
            {typeOptions.map(({ category, label, icon, styleClass }) => (
              <label key={category} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name={`type-${category}`}
                  value={category}
                  aria-label={`${label} type`}
                  checked={activeTypes.includes(category)}
                  onChange={() => toggleType(category)}
                />
                <span className={styles.filterOptionLabel}>
                  <span
                    className={`${styles.filterOptionIcon} ${styles[styleClass]}`}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  {label}
                </span>
              </label>
            ))}
          </fieldset>
          {authorOptions.length > 0 && (
            <fieldset className={styles.filterGroup}>
              <legend className={styles.filterLabel}>Author</legend>
              {authorOptions.map((option) => (
                <label key={option.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name={`author-${option.id}`}
                    value={option.id}
                    aria-label={`Author ${option.name}`}
                    checked={activeAuthorIds.includes(option.id)}
                    onChange={() => toggleAuthor(option.id)}
                  />
                  {option.name}
                </label>
              ))}
            </fieldset>
          )}
          {hasActiveFilters && (
            <button type="button" className={styles.resetButton} onClick={resetFilters}>
              Reset filters
            </button>
          )}
        </div>
        <section className={styles.listSection} aria-labelledby="pattern-catalog-preview-heading">
          <h3 className={styles.subsectionTitle} id="pattern-catalog-preview-heading">
            Catalog preview
          </h3>
          {filteredGroups.length === 0 ? (
            <p className={styles.emptyState} role="status" aria-live="polite">
              No entries match these filters yet. Try adjusting the filters above.
            </p>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.category} className={styles.catalogGroup}>
                <h4 className={styles.groupTitle}>
                  <span
                    className={`${styles.groupTitleIcon} ${styles[group.styleClass]}`}
                    aria-hidden="true"
                  >
                    {group.icon}
                  </span>
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
                        aria-current={isSelected(group.label, item) ? "true" : undefined}
                        onClick={(event) => handleSelect(event, group.label, group.category, item)}
                        onKeyDown={(event) => handleKeyDown(event, group.label, group.category, item)}
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
            ))
          )}
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
