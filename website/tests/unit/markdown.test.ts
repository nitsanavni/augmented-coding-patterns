import * as fs from 'fs'
import * as path from 'path'
import { getPatternSlugs, getPatternBySlug, getAllPatterns } from '@/lib/markdown'

jest.mock('fs')
jest.mock('path')

const mockedFs = fs as jest.Mocked<typeof fs>
const mockedPath = path as jest.Mocked<typeof path>

describe('Markdown utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPatternSlugs', () => {
    it('should return array of slugs for patterns category', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/patterns')
      mockedFs.readdirSync.mockReturnValue([
        'active-partner.md',
        'chain-of-small-steps.md',
        'check-alignment.md',
      ] as fs.Dirent[])

      const slugs = getPatternSlugs('patterns')

      expect(slugs).toEqual([
        'active-partner',
        'chain-of-small-steps',
        'check-alignment',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/documents/patterns')
    })

    it('should return array of slugs for anti-patterns category', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/anti-patterns')
      mockedFs.readdirSync.mockReturnValue([
        'answer-injection.md',
        'distracted-agent.md',
      ] as fs.Dirent[])

      const slugs = getPatternSlugs('anti-patterns')

      expect(slugs).toEqual([
        'answer-injection',
        'distracted-agent',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/documents/anti-patterns')
    })

    it('should return array of slugs for obstacles category', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/obstacles')
      mockedFs.readdirSync.mockReturnValue([
        'black-box-ai.md',
        'context-rot.md',
      ] as fs.Dirent[])

      const slugs = getPatternSlugs('obstacles')

      expect(slugs).toEqual([
        'black-box-ai',
        'context-rot',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/documents/obstacles')
    })

    it('should filter out non-markdown files', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/patterns')
      mockedFs.readdirSync.mockReturnValue([
        'active-partner.md',
        '.DS_Store',
        'README.txt',
        'check-alignment.md',
      ] as fs.Dirent[])

      const slugs = getPatternSlugs('patterns')

      expect(slugs).toEqual([
        'active-partner',
        'check-alignment',
      ])
    })
  })

  describe('getPatternBySlug', () => {
    it('should correctly parse a pattern with all sections', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance, even when instructions don't make sense.

## Pattern
Explicitly grant permission and encourage AI to:
- Push back on unclear instructions
- Challenge assumptions that seem wrong`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Active Partner')
      expect(pattern.category).toBe('patterns')
      expect(pattern.slug).toBe('active-partner')
      expect(pattern.content).toContain('AI defaults to silent compliance')
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(
        '/fake/path/documents/patterns/active-partner.md',
        'utf-8'
      )
    })

    it('should correctly parse an anti-pattern', () => {
      const mockMarkdown = `# Answer Injection (Anti-pattern)

## Problem
Putting solutions in your questions, limiting AI to your preconceived approach.`

      mockedPath.join.mockReturnValue('/fake/path/documents/anti-patterns/answer-injection.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('anti-patterns', 'answer-injection')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Answer Injection')
      expect(pattern.category).toBe('anti-patterns')
      expect(pattern.slug).toBe('answer-injection')
      expect(pattern.emojiIndicator).toBeUndefined()
    })

    it('should correctly parse an obstacle', () => {
      const mockMarkdown = `# Black Box AI (Obstacle)

## Description
AI reasoning is hidden. You only see inputs and outputs.`

      mockedPath.join.mockReturnValue('/fake/path/documents/obstacles/black-box-ai.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('obstacles', 'black-box-ai')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Black Box AI')
      expect(pattern.category).toBe('obstacles')
      expect(pattern.slug).toBe('black-box-ai')
    })

    it('should extract emoji indicator from title if present', () => {
      const mockMarkdown = `# 🎯 Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern.title).toBe('Active Partner')
      expect(pattern.emojiIndicator).toBe('🎯')
    })

    it('should extract authors from frontmatter', () => {
      const mockMarkdown = `---
authors: [lexler]
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.authors).toEqual(['lexler'])
    })

    it('should extract related_patterns from frontmatter and map to relatedPatterns', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
  - check-alignment
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual(['chain-of-small-steps', 'check-alignment'])
    })

    it('should extract related_anti_patterns from frontmatter and map to relatedAntiPatterns', () => {
      const mockMarkdown = `---
related_anti_patterns:
  - answer-injection
  - distracted-agent
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedAntiPatterns).toEqual(['answer-injection', 'distracted-agent'])
    })

    it('should extract related_obstacles from frontmatter and map to relatedObstacles', () => {
      const mockMarkdown = `---
related_obstacles:
  - black-box-ai
  - context-rot
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedObstacles).toEqual(['black-box-ai', 'context-rot'])
    })

    it('should work with files without frontmatter', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Active Partner')
      expect(pattern.relatedPatterns).toBeUndefined()
      expect(pattern.relatedAntiPatterns).toBeUndefined()
      expect(pattern.relatedObstacles).toBeUndefined()
    })

    it('should work with files with only some relationship fields', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual(['chain-of-small-steps'])
      expect(pattern.relatedAntiPatterns).toBeUndefined()
      expect(pattern.relatedObstacles).toBeUndefined()
    })

    it('should handle all three relationship types together', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
related_anti_patterns:
  - answer-injection
related_obstacles:
  - black-box-ai
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual(['chain-of-small-steps'])
      expect(pattern.relatedAntiPatterns).toEqual(['answer-injection'])
      expect(pattern.relatedObstacles).toEqual(['black-box-ai'])
    })

    it('should handle authors combined with relationship fields', () => {
      const mockMarkdown = `---
authors: [lexler, johndoe]
related_patterns:
  - chain-of-small-steps
related_anti_patterns:
  - answer-injection
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.authors).toEqual(['lexler', 'johndoe'])
      expect(pattern.relatedPatterns).toEqual(['chain-of-small-steps'])
      expect(pattern.relatedAntiPatterns).toEqual(['answer-injection'])
    })
  })

  describe('getAllPatterns', () => {
    it('should return all patterns for a category', () => {
      mockedPath.join
        .mockReturnValueOnce('/fake/path/documents/patterns')
        .mockReturnValueOnce('/fake/path/documents/patterns/pattern-one.md')
        .mockReturnValueOnce('/fake/path/documents/patterns/pattern-two.md')

      mockedFs.readdirSync.mockReturnValue([
        'pattern-one.md',
        'pattern-two.md',
      ] as fs.Dirent[])

      mockedFs.readFileSync
        .mockReturnValueOnce('# Pattern One\n\n## Problem\nFirst problem.')
        .mockReturnValueOnce('# Pattern Two\n\n## Pattern\nSecond pattern.')

      const patterns = getAllPatterns('patterns')

      expect(patterns).toHaveLength(2)
      expect(patterns[0].slug).toBe('pattern-one')
      expect(patterns[0].title).toBe('Pattern One')
      expect(patterns[1].slug).toBe('pattern-two')
      expect(patterns[1].title).toBe('Pattern Two')
    })

    it('should handle empty directory', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/patterns')
      mockedFs.readdirSync.mockReturnValue([] as fs.Dirent[])

      const patterns = getAllPatterns('patterns')

      expect(patterns).toHaveLength(0)
    })

    it('should skip non-markdown files', () => {
      mockedPath.join
        .mockReturnValueOnce('/fake/path/documents/patterns')
        .mockReturnValueOnce('/fake/path/documents/patterns/pattern-one.md')

      mockedFs.readdirSync.mockReturnValue([
        'pattern-one.md',
        '.DS_Store',
        'README.txt',
      ] as fs.Dirent[])

      mockedFs.readFileSync.mockReturnValue('# Pattern One\n\n## Problem\nFirst problem.')

      const patterns = getAllPatterns('patterns')

      expect(patterns).toHaveLength(1)
      expect(patterns[0].slug).toBe('pattern-one')
    })
  })
})
