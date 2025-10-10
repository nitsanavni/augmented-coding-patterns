export type PatternCategory = 'patterns' | 'anti-patterns' | 'obstacles'

export interface Author {
  name: string
  github: string
  url?: string
}

export interface PatternMetadata {
  title: string
  category: PatternCategory
  slug: string
  emojiIndicator?: string
  authors?: string[]
  relatedPatterns?: string[]
  relatedAntiPatterns?: string[]
  relatedObstacles?: string[]
}

export interface PatternContent extends PatternMetadata {
  content: string
  rawContent: string
}

export interface PatternData {
  metadata: PatternMetadata
  content: string
}
