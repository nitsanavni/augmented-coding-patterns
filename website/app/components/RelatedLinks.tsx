import Link from 'next/link'
import { getCategoryConfig } from '@/app/lib/category-config'
import { PatternCategory, RelatedPattern, RelationshipType } from '@/lib/types'
import styles from './RelatedLinks.module.css'

interface RelatedLinksProps {
  relatedPatterns?: RelatedPattern[]
  relatedAntiPatterns?: RelatedPattern[]
  relatedObstacles?: RelatedPattern[]
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatRelationshipType(type: RelationshipType): string {
  const formatMap: Record<RelationshipType, string> = {
    'related': '',
    'solves': 'Solves',
    'similar': 'Similar to',
    'enabled-by': 'Enabled by',
    'uses': 'Uses',
    'causes': 'Causes',
    'alternative': 'Alternative to'
  }
  return formatMap[type] || type
}

interface RelationshipGroup {
  category: PatternCategory
  patterns: RelatedPattern[]
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
      patterns: relatedPatterns
    })
  }

  if (relatedAntiPatterns && relatedAntiPatterns.length > 0) {
    relationshipGroups.push({
      category: 'anti-patterns',
      patterns: relatedAntiPatterns
    })
  }

  if (relatedObstacles && relatedObstacles.length > 0) {
    relationshipGroups.push({
      category: 'obstacles',
      patterns: relatedObstacles
    })
  }

  return (
    <aside className={styles.container}>
      <h2 className={styles.heading}>Related</h2>

      {relationshipGroups.map(({ category, patterns }) => {
        const config = getCategoryConfig(category)

        // Group patterns by relationship type
        const patternsByType = patterns.reduce((acc, pattern) => {
          const typeLabel = formatRelationshipType(pattern.type)
          if (!acc[typeLabel]) {
            acc[typeLabel] = []
          }
          acc[typeLabel].push(pattern)
          return acc
        }, {} as Record<string, RelatedPattern[]>)

        // Sort type groups: empty string (related) first, then alphabetically
        const sortedTypes = Object.keys(patternsByType).sort((a, b) => {
          if (a === '') return -1
          if (b === '') return 1
          return a.localeCompare(b)
        })

        return (
          <div key={category} className={styles.section}>
            <h3 className={`${styles.categoryHeading} ${styles[config.styleClass]}`}>
              <span className={styles.categoryIcon}>{config.icon}</span>
              {config.labelPlural}
            </h3>
            {sortedTypes.map(typeLabel => (
              <div key={typeLabel || 'related'}>
                {typeLabel && <h4 className={styles.typeHeading}>{typeLabel}</h4>}
                <ul className={styles.list}>
                  {patternsByType[typeLabel].map(pattern => (
                    <li key={pattern.slug} className={styles.listItem}>
                      <Link
                        href={`/${category}/${pattern.slug}/`}
                        className={`${styles.link} ${styles[config.styleClass]}`}
                      >
                        {slugToTitle(pattern.slug)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      })}
    </aside>
  )
}
