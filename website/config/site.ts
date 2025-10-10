export const siteConfig = {
  name: 'Augmented Coding Patterns',
  description: 'A comprehensive collection of patterns, anti-patterns, and obstacles for effective AI-augmented software development',
  author: {
    name: 'Ivette Valdez',
    github: 'ivettevaldez'
  },
  repository: {
    owner: 'ivettevaldez',
    name: 'augmented-coding-patterns',
    url: 'https://github.com/ivettevaldez/augmented-coding-patterns'
  },
  links: {
    github: 'https://github.com/ivettevaldez/augmented-coding-patterns'
  }
} as const

export type SiteConfig = typeof siteConfig
