import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PatternCategory, PatternContent } from './types'

const PATTERNS_BASE_PATH = path.join(process.cwd(), '..', 'patterns')

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
  const files = fs.readdirSync(categoryPath)

  return files
    .filter(isMarkdownFile)
    .map(filenameToSlug)
}

export function getPatternBySlug(category: PatternCategory, slug: string): PatternContent {
  validateSlug(slug)
  const categoryPath = getCategoryPath(category)
  const fullPath = path.join(categoryPath, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')

  const { content } = matter(fileContents)

  const lines = content.split('\n')
  const firstLine = lines.find(line => line.trim().startsWith('#')) || ''
  const { title, emoji } = extractTitleAndEmoji(firstLine)

  return {
    title,
    category,
    slug,
    ...(emoji && { emojiIndicator: emoji }),
    content,
    rawContent: fileContents
  }
}

export function getAllPatterns(category: PatternCategory): PatternContent[] {
  const slugs = getPatternSlugs(category)
  return slugs.map(slug => getPatternBySlug(category, slug))
}
