import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PatternCategory, PatternContent } from './types'
import { getRelationshipsFor } from './relationships'

const PATTERNS_BASE_PATH = path.join(process.cwd(), '..', 'documents')

function getCategoryPath(category: PatternCategory): string {
  return path.join(PATTERNS_BASE_PATH, category)
}

function removeCategorySuffix(title: string): string {
  const categoryPattern = /\s*\((Anti-pattern|Obstacle)\)\s*$/i
  return title.replace(categoryPattern, '').trim()
}

function extractEmojiFromTitle(title: string): { title: string; emoji?: string } {
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s+/u
  const match = title.match(emojiRegex)

  if (match) {
    return {
      emoji: match[1],
      title: title.substring(match[0].length).trim()
    }
  }

  return { title }
}

function extractTitleAndEmoji(firstLine: string): { title: string; emoji?: string } {
  const withoutHash = firstLine.replace(/^#\s*/, '').trim()
  const withoutCategory = removeCategorySuffix(withoutHash)
  return extractEmojiFromTitle(withoutCategory)
}

function isMarkdownFile(filename: string): boolean {
  return filename.endsWith('.md')
}

function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, '')
}

function validateSlug(slug: string): void {
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    throw new Error('Invalid slug format: Path traversal detected')
  }

  const validSlugPattern = /^[a-zA-Z0-9_-]+$/
  if (!validSlugPattern.test(slug)) {
    throw new Error('Invalid slug format: Only alphanumeric characters, hyphens, and underscores allowed')
  }
}

export function getPatternSlugs(category: PatternCategory): string[] {
  const categoryPath = getCategoryPath(category)

  try {
    const files = fs.readdirSync(categoryPath)
    return files
      .filter(isMarkdownFile)
      .map(filenameToSlug)
  } catch (error) {
    console.error(`Failed to read patterns directory: ${categoryPath}`, error)
    return []
  }
}

export function getPatternBySlug(
  category: PatternCategory,
  slug: string
): PatternContent | null {
  validateSlug(slug)
  const categoryPath = getCategoryPath(category)
  const fullPath = path.join(categoryPath, `${slug}.md`)

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf-8')
    const { content, data } = matter(fileContents)

    const lines = content.split('\n')
    const firstLineIndex = lines.findIndex(line => line.trim().startsWith('#'))
    const firstLine = firstLineIndex >= 0 ? lines[firstLineIndex] : ''
    const { title, emoji } = extractTitleAndEmoji(firstLine)

    // Remove the first H1 from content since it's displayed in the page header
    const contentWithoutTitle = firstLineIndex >= 0
      ? [...lines.slice(0, firstLineIndex), ...lines.slice(firstLineIndex + 1)].join('\n')
      : content

    // Load relationships from centralized registry
    const centralizedRels = getRelationshipsFor(slug, category)

    // Group by target category and create RelatedPattern objects
    const relPatterns = centralizedRels
      .filter(r => r.to.startsWith('patterns/'))
      .map(r => ({ slug: r.to.replace('patterns/', ''), type: r.type }))

    const relAntiPatterns = centralizedRels
      .filter(r => r.to.startsWith('anti-patterns/'))
      .map(r => ({ slug: r.to.replace('anti-patterns/', ''), type: r.type }))

    const relObstacles = centralizedRels
      .filter(r => r.to.startsWith('obstacles/'))
      .map(r => ({ slug: r.to.replace('obstacles/', ''), type: r.type }))

    // Merge centralized relationships with frontmatter (remove duplicates by slug)
    // For frontmatter relationships without type info, default to 'related'
    const frontmatterPatterns = (data.related_patterns || []).map((slug: string) => ({ slug, type: 'related' as const }))
    const frontmatterAntiPatterns = (data.related_anti_patterns || []).map((slug: string) => ({ slug, type: 'related' as const }))
    const frontmatterObstacles = (data.related_obstacles || []).map((slug: string) => ({ slug, type: 'related' as const }))

    // Merge and deduplicate by slug, preferring centralized type over frontmatter
    const mergeRelatedPatterns = (centralized: Array<{slug: string, type: string}>, frontmatter: Array<{slug: string, type: string}>) => {
      const slugMap = new Map<string, {slug: string, type: string}>()
      frontmatter.forEach(item => slugMap.set(item.slug, item))
      centralized.forEach(item => slugMap.set(item.slug, item)) // Centralized overwrites
      return Array.from(slugMap.values())
    }

    const mergedPatterns = mergeRelatedPatterns(relPatterns, frontmatterPatterns)
    const mergedAntiPatterns = mergeRelatedPatterns(relAntiPatterns, frontmatterAntiPatterns)
    const mergedObstacles = mergeRelatedPatterns(relObstacles, frontmatterObstacles)

    return {
      title,
      category,
      slug,
      ...(emoji && { emojiIndicator: emoji }),
      ...(data.authors && { authors: data.authors }),
      ...(mergedPatterns.length > 0 && { relatedPatterns: mergedPatterns }),
      ...(mergedAntiPatterns.length > 0 && { relatedAntiPatterns: mergedAntiPatterns }),
      ...(mergedObstacles.length > 0 && { relatedObstacles: mergedObstacles }),
      content: contentWithoutTitle,
      rawContent: fileContents
    }
  } catch (error) {
    console.error(`Failed to read pattern file: ${fullPath}`, error)
    return null
  }
}

export function getAllPatterns(category: PatternCategory): PatternContent[] {
  const slugs = getPatternSlugs(category)
  return slugs
    .map(slug => getPatternBySlug(category, slug))
    .filter((pattern): pattern is PatternContent => pattern !== null)
}
