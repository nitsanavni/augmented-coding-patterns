import Link from 'next/link'
import { getCategoryConfig } from '@/app/lib/category-config'
import { PatternCategory } from '@/lib/types'
import styles from './RelatedLinks.module.css'

interface RelatedLinksProps {
  relatedPatterns?: string[]
  relatedAntiPatterns?: string[]
  relatedObstacles?: string[]
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface RelationshipGroup {
  category: PatternCategory
  slugs: string[]
}

export default function RelatedLinks({
  relatedPatterns,
  relatedAntiPatterns,
  relatedObstacles
}: RelatedLinksProps) {
  const hasAnyRelations =
    (relatedPatterns && relatedPatterns.length > 0) ||
    (relatedAntiPatterns && relatedAntiPatterns.length > 0) ||
    (relatedObstacles && relatedObstacles.length > 0)

  if (!hasAnyRelations) {
    return null
  }

  const relationshipGroups: RelationshipGroup[] = []

  if (relatedPatterns && relatedPatterns.length > 0) {
    relationshipGroups.push({
      category: 'patterns',
      slugs: relatedPatterns
    })
  }

  if (relatedAntiPatterns && relatedAntiPatterns.length > 0) {
    relationshipGroups.push({
      category: 'anti-patterns',
      slugs: relatedAntiPatterns
    })
  }

  if (relatedObstacles && relatedObstacles.length > 0) {
    relationshipGroups.push({
      category: 'obstacles',
      slugs: relatedObstacles
    })
  }

  return (
    <aside className={styles.container}>
      <h2 className={styles.heading}>Related</h2>

      {relationshipGroups.map(({ category, slugs }) => {
        const config = getCategoryConfig(category)

        return (
          <div key={category} className={styles.section}>
            <h3 className={`${styles.categoryHeading} ${styles[config.styleClass]}`}>
              <span className={styles.categoryIcon}>{config.icon}</span>
              {config.labelPlural}
            </h3>
            <ul className={styles.list}>
              {slugs.map(slug => (
                <li key={slug} className={styles.listItem}>
                  <Link
                    href={`/${category}/${slug}/`}
                    className={`${styles.link} ${styles[config.styleClass]}`}
                  >
                    {slugToTitle(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </aside>
  )
}
