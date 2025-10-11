export type PatternCategory = 'patterns' | 'anti-patterns' | 'obstacles'

export interface Author {
  name: string
  github: string
  url?: string
}

export interface RelatedPattern {
  slug: string
  type: RelationshipType
}

export interface PatternMetadata {
  title: string
  category: PatternCategory
  slug: string
  emojiIndicator?: string
  authors?: string[]
  relatedPatterns?: RelatedPattern[]
  relatedAntiPatterns?: RelatedPattern[]
  relatedObstacles?: RelatedPattern[]
}

export interface PatternContent extends PatternMetadata {
  content: string
  rawContent: string
}

export interface PatternData {
  metadata: PatternMetadata
  content: string
}

export type RelationshipType =
  | 'related'
  | 'solves'
  | 'similar'
  | 'enabled-by'
  | 'uses'
  | 'causes'
  | 'alternative'

export interface Relationship {
  from: string
  to: string
  type: RelationshipType
  bidirectional: boolean
}

export interface RelationshipGraph {
  relationships: Relationship[]
}
