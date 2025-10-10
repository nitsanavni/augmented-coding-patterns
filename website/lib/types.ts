export type PatternCategory = 'patterns' | 'anti-patterns' | 'obstacles'

export interface PatternMetadata {
  title: string
  category: PatternCategory
  slug: string
  emojiIndicator?: string
}

export interface PatternContent extends PatternMetadata {
  content: string
  rawContent: string
}

export interface PatternData {
  metadata: PatternMetadata
  content: string
}
