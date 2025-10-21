'use client';

import Link from "next/link";
import Image from "next/image";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./page.module.css";
import { CatalogGroupData, CatalogPreviewItem } from "./types";
import { PATTERN_CATALOG_TEST_IDS } from "./test-ids";
import { getCategoryConfig } from "@/app/lib/category-config";
import SearchBar from "@/app/components/SearchBar";
import { PatternContent } from "@/lib/types";

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
  github: string;
}

function extractAuthorOptions(groups: CatalogGroupData[]): AuthorOption[] {
  const authorMap = new Map<string, { name: string; github: string }>();

  groups.forEach((group) => {
    group.items.forEach((item) => {
      item.authorIds.forEach((authorId, index) => {
        if (!authorMap.has(authorId)) {
          const name = item.authorNames[index];
          const github = item.authorGithubs[index];
          if (name && github) {
            authorMap.set(authorId, { name, github });
          }
        }
      });
    });
  });

  const authorOrder = ['lada_kesseler', 'ivett_ordog', 'nitsan_avni', 'llewellyn_falco'];

  return Array.from(authorMap.entries())
    .map(([id, { name, github }]) => ({ id, name, github }))
    .sort((a, b) => {
      const indexA = authorOrder.indexOf(a.id);
      const indexB = authorOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
}

export default function CatalogView({ groups }: CatalogViewProps) {
  const [activeTypes, setActiveTypes] = useState<string[]>(() => groups.map((group) => group.category));
  const [activeAuthorIds, setActiveAuthorIds] = useState<string[]>(() => {
    const options = extractAuthorOptions(groups);
    return options.map((option) => option.id);
  });

  const [selected, setSelected] = useState<SelectedCatalogItem | null>(null);
  const selectedConfig = selected ? getCategoryConfig(selected.category) : null;
  const selectedItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const sidebarRef = useRef<HTMLElement>(null);

  const handleSearchSelect = (pattern: PatternContent) => {
    const group = groups.find((g) => g.category === pattern.category);
    const item = group?.items.find((i) => i.slug === pattern.slug);
    if (group && item) {
      setActiveTypes((prev) => {
        if (prev.includes(group.category)) {
          return prev;
        }

        const next = new Set(prev);
        next.add(group.category);
        const orderedCategories = typeOptions.map(({ category }) => category);
        const nextList = orderedCategories.filter((category) => next.has(category));
        return nextList.length === prev.length && prev.every((category, index) => category === nextList[index])
          ? prev
          : nextList;
      });

      if (authorOptions.length > 0 && item.authorIds.length > 0) {
        setActiveAuthorIds((prev) => {
          const next = new Set(prev);
          item.authorIds.forEach((authorId) => next.add(authorId));
          const orderedAuthorIds = authorOptions.map(({ id }) => id).filter((id) => next.has(id));
          if (orderedAuthorIds.length === prev.length && prev.every((id, index) => id === orderedAuthorIds[index])) {
            return prev;
          }
          return orderedAuthorIds;
        });
      }

      setSelected({ groupLabel: group.label, category: group.category, item });
    }
  };

  const allPatterns = useMemo(
    () =>
      groups.flatMap((group) =>
        group.items.map((item) => ({
          slug: item.slug,
          title: item.title,
          category: group.category,
          emojiIndicator: item.emojiIndicator,
          authors: item.authorIds,
          content: item.content,
        }))
      ),
    [groups]
  );

  const typeOptions = useMemo(
    () => groups.map(({ category, label, icon, styleClass }) => ({ category, label, icon, styleClass })),
    [groups],
  );

  const authorOptions = useMemo(() => extractAuthorOptions(groups), [groups]);

  const allAuthorsSelected = activeAuthorIds.length === authorOptions.length || authorOptions.length === 0;
  const hasTypeFilter = activeTypes.length !== typeOptions.length;
  const hasAuthorFilter = authorOptions.length > 0 && activeAuthorIds.length !== authorOptions.length;
  const hasActiveFilters = hasTypeFilter || hasAuthorFilter;
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => ({}));

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
    setCollapsedGroups((prev) => {
      const next: Record<string, boolean> = {};
      filteredGroups.forEach((group) => {
        next[group.category] = prev[group.category] ?? false;
      });
      return next;
    });
  }, [filteredGroups]);

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

  useEffect(() => {
    if (selected) {
      setCollapsedGroups((prev) => ({
        ...prev,
        [selected.category]: false,
      }));

      setTimeout(() => {
        const itemKey = `${selected.category}-${selected.item.slug}`;
        const itemElement = selectedItemRefs.current.get(itemKey);

        if (itemElement) {
          let offsetTop = 0;
          let element: HTMLElement | null = itemElement;

          while (element && element !== sidebarRef.current) {
            offsetTop += element.offsetTop;
            element = element.offsetParent as HTMLElement | null;
          }

          if (sidebarRef.current) {
            sidebarRef.current.scrollTo({ top: offsetTop - 20, behavior: 'smooth' });
          }
        }
      }, 150);
    }
  }, [selected]);

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

  const isSelected = (groupLabel: string, item: CatalogPreviewItem) => {
    return selected?.groupLabel === groupLabel && selected.item.slug === item.slug;
  };

  const detailFallback = (
    <p className={styles.placeholderCopy}>Pick a pattern to see its guidance.</p>
  );

  const allTypesSelected = activeTypes.length === typeOptions.length;

  const toggleAllTypes = () => {
    if (allTypesSelected) {
      setActiveTypes([]);
    } else {
      setActiveTypes(typeOptions.map(({ category }) => category));
    }
  };

  return (
    <>
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <SearchBar patterns={allPatterns} onSelect={handleSearchSelect} />
        </div>
        <div className={styles.filterGroup}>
          <h3 className={styles.filterGroupLabel}>Type</h3>
          <div className={styles.typeButtonGroup} role="group" aria-label="Type filter">
            <button
              type="button"
              className={`${styles.typeButton} ${allTypesSelected ? styles.typeButtonActive : ""}`}
              onClick={toggleAllTypes}
              aria-pressed={allTypesSelected}
              title="Show All"
            >
              ∞
            </button>
            {typeOptions.map(({ category, label, icon }) => (
              <button
                key={category}
                type="button"
                className={`${styles.typeButton} ${activeTypes.includes(category) ? styles.typeButtonActive : ""}`}
                onClick={() => toggleType(category)}
                aria-pressed={activeTypes.includes(category)}
                aria-label={label}
                title={label}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        {authorOptions.length > 0 && (
          <div className={styles.filterGroup}>
            <h3 className={styles.filterGroupLabel}>Author</h3>
            <div className={styles.authorButtonGroup} role="group" aria-label="Author filter">
              <button
                type="button"
                className={`${styles.authorButton} ${allAuthorsSelected ? styles.authorButtonActive : ""}`}
                onClick={() => {
                  if (allAuthorsSelected) {
                    setActiveAuthorIds([]);
                  } else {
                    setActiveAuthorIds(authorOptions.map(({ id }) => id));
                  }
                }}
                aria-pressed={allAuthorsSelected}
                title="Show All"
              >
                ∞
              </button>
              {authorOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.authorButton} ${activeAuthorIds.includes(option.id) ? styles.authorButtonActive : ""}`}
                  onClick={() => toggleAuthor(option.id)}
                  aria-pressed={activeAuthorIds.includes(option.id)}
                  aria-label={option.name}
                  title={option.name}
                >
                  <Image
                    src={`https://github.com/${option.github}.png`}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.authorAvatar}
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.layout}>
      <aside ref={sidebarRef} data-testid={PATTERN_CATALOG_TEST_IDS.sidebar} className={styles.sidebar}>
        <section className={styles.listSection}>
          {filteredGroups.length === 0 ? (
            <p className={styles.emptyState} role="status" aria-live="polite">
              No entries match these filters yet. Try adjusting the filters above.
            </p>
          ) : (
            filteredGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.category] ?? false;
              return (
                <div key={group.category} className={styles.catalogGroup}>
                  <button
                    type="button"
                    className={styles.groupToggle}
                    onClick={() =>
                      setCollapsedGroups((prev) => ({
                        ...prev,
                        [group.category]: !isCollapsed,
                      }))
                    }
                    aria-expanded={!isCollapsed}
                  >
                    <span
                      className={`${styles.groupTitleIcon} ${styles[group.styleClass]}`}
                      aria-hidden="true"
                    >
                      {group.icon}
                    </span>
                    <span className={styles.groupTitleText}>
                      {group.label} ({group.items.length})
                    </span>
                    <span className={styles.groupToggleIndicator} aria-hidden="true">
                      {isCollapsed ? "▸" : "▾"}
                    </span>
                  </button>
                  {!isCollapsed && (
                    <ul className={styles.catalogList} aria-label={group.label}>
                      {group.items.map((item) => {
                        const itemKey = `${group.category}-${item.slug}`;
                        return (
                          <li
                            key={item.slug}
                            ref={(el) => {
                              if (el) {
                                selectedItemRefs.current.set(itemKey, el);
                              } else {
                                selectedItemRefs.current.delete(itemKey);
                              }
                            }}
                            className={`${styles.catalogListItem} ${
                              isSelected(group.label, item) ? styles.catalogListItemActive : ""
                            }`}
                          >
                          <Link
                            href={`/${group.category}/${item.slug}`}
                            className={styles.catalogLink}
                            aria-current={isSelected(group.label, item) ? "true" : undefined}
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
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })
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
              <div className={styles.authorsSection}>
                <div className={styles.authorsLabel}>Documented by</div>
                <div className={styles.authorsList}>
                  {selected.item.authorIds.map((authorId, index) => {
                    const name = selected.item.authorNames[index];
                    const github = selected.item.authorGithubs[index];
                    if (!name || !github) return null;

                    return (
                      <Link
                        key={authorId}
                        href={`https://github.com/${github}`}
                        className={styles.authorLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={`https://github.com/${github}.png`}
                          alt={`${name}'s avatar`}
                          width={32}
                          height={32}
                          className={styles.authorAvatar}
                          unoptimized
                        />
                        <span className={styles.authorName}>{name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        ) : (
          detailFallback
        )}
      </section>
      </div>
    </>
  );
}
