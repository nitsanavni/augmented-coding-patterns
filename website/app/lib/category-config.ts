import { PatternCategory } from './types'

export interface CategoryConfig {
  id: PatternCategory
  label: string
  labelPlural: string
  icon: string
  description: string
  listDescription: string
  countText: (count: number) => string
  styleClass: string
}

export const CATEGORY_CONFIGS: Record<PatternCategory, CategoryConfig> = {
  'obstacles': {
    id: 'obstacles',
    label: 'Obstacle',
    labelPlural: 'Obstacles',
    icon: '⛰️',
    description: 'Understand the inherent limitations and challenges of AI-augmented coding.',
    listDescription: 'Understand the inherent limitations and challenges of AI-augmented coding. Be aware of these obstacles to set realistic expectations and work around constraints.',
    countText: (count) => `${count} obstacles identified`,
    styleClass: 'obstacles'
  },
  'anti-patterns': {
    id: 'anti-patterns',
    label: 'Anti-Pattern',
    labelPlural: 'Anti-Patterns',
    icon: '⚠️',
    description: 'Common mistakes and pitfalls to avoid when working with AI assistants.',
    listDescription: 'Common mistakes and pitfalls to avoid when working with AI coding assistants. Learn from these anti-patterns to prevent costly errors and maintain code quality.',
    countText: (count) => `${count} anti-patterns documented`,
    styleClass: 'antiPatterns'
  },
  'patterns': {
    id: 'patterns',
    label: 'Pattern',
    labelPlural: 'Patterns',
    icon: '🧩',
    description: 'Proven strategies and best practices for working effectively with AI coding assistants.',
    listDescription: 'Proven strategies and best practices for working effectively with AI coding assistants. These patterns help you maximize productivity, maintain code quality, and collaborate successfully with AI.',
    countText: (count) => `${count} patterns available`,
    styleClass: 'patterns'
  }
}

export function getCategoryConfig(category: PatternCategory): CategoryConfig {
  return CATEGORY_CONFIGS[category]
}

export function isValidCategory(category: string): category is PatternCategory {
  return category in CATEGORY_CONFIGS
}
