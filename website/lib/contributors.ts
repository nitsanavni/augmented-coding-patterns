import { getAllPatterns } from './markdown'
import { PatternCategory } from './types'
import { getAuthorById, getGithubAvatarUrl } from './authors'

export interface ContributorStats {
  authorId: string
  name: string
  github: string
  url?: string
  avatarUrl: string
  total: number
  patterns: number
  antiPatterns: number
  obstacles: number
}

interface AuthorCounts {
  patterns: number
  antiPatterns: number
  obstacles: number
}

export function getContributorStats(): ContributorStats[] {
  const authorCountsMap = new Map<string, AuthorCounts>()

  const categories: PatternCategory[] = ['patterns', 'anti-patterns', 'obstacles']

  categories.forEach(category => {
    const patterns = getAllPatterns(category)

    patterns.forEach(pattern => {
      if (!pattern.authors || pattern.authors.length === 0) {
        return
      }

      pattern.authors.forEach(authorId => {
        if (!authorCountsMap.has(authorId)) {
          authorCountsMap.set(authorId, {
            patterns: 0,
            antiPatterns: 0,
            obstacles: 0
          })
        }

        const counts = authorCountsMap.get(authorId)!

        if (category === 'patterns') {
          counts.patterns++
        } else if (category === 'anti-patterns') {
          counts.antiPatterns++
        } else if (category === 'obstacles') {
          counts.obstacles++
        }
      })
    })
  })

  const contributorStats: ContributorStats[] = []

  authorCountsMap.forEach((counts, authorId) => {
    const author = getAuthorById(authorId)

    if (!author) {
      console.warn(`Author not found: ${authorId}`)
      return
    }

    contributorStats.push({
      authorId,
      name: author.name,
      github: author.github,
      ...(author.url && { url: author.url }),
      avatarUrl: getGithubAvatarUrl(author.github),
      total: counts.patterns + counts.antiPatterns + counts.obstacles,
      patterns: counts.patterns,
      antiPatterns: counts.antiPatterns,
      obstacles: counts.obstacles
    })
  })

  return contributorStats.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total
    }
    return a.name.localeCompare(b.name)
  })
}
