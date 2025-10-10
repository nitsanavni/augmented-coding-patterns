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
      mockedPath.join.mockReturnValue('/fake/path/patterns/patterns')
      mockedFs.readdirSync.mockReturnValue([
        'active-partner.md',
        'chain-of-small-steps.md',
        'check-alignment.md',
      ] as any)

      const slugs = getPatternSlugs('patterns')

      expect(slugs).toEqual([
        'active-partner',
        'chain-of-small-steps',
        'check-alignment',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/patterns/patterns')
    })

    it('should return array of slugs for anti-patterns category', () => {
      mockedPath.join.mockReturnValue('/fake/path/patterns/anti-patterns')
      mockedFs.readdirSync.mockReturnValue([
        'answer-injection.md',
        'distracted-agent.md',
      ] as any)

      const slugs = getPatternSlugs('anti-patterns')

      expect(slugs).toEqual([
        'answer-injection',
        'distracted-agent',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/patterns/anti-patterns')
    })

    it('should return array of slugs for obstacles category', () => {
      mockedPath.join.mockReturnValue('/fake/path/patterns/obstacles')
      mockedFs.readdirSync.mockReturnValue([
        'black-box-ai.md',
        'context-rot.md',
      ] as any)

      const slugs = getPatternSlugs('obstacles')

      expect(slugs).toEqual([
        'black-box-ai',
        'context-rot',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/patterns/obstacles')
    })

    it('should filter out non-markdown files', () => {
      mockedPath.join.mockReturnValue('/fake/path/patterns/patterns')
      mockedFs.readdirSync.mockReturnValue([
        'active-partner.md',
        '.DS_Store',
        'README.txt',
        'check-alignment.md',
      ] as any)

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

      mockedPath.join.mockReturnValue('/fake/path/patterns/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Active Partner')
      expect(pattern.category).toBe('patterns')
      expect(pattern.slug).toBe('active-partner')
      expect(pattern.content).toContain('AI defaults to silent compliance')
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(
        '/fake/path/patterns/patterns/active-partner.md',
        'utf-8'
      )
    })

    it('should correctly parse an anti-pattern', () => {
      const mockMarkdown = `# Answer Injection (Anti-pattern)

## Problem
Putting solutions in your questions, limiting AI to your preconceived approach.`

      mockedPath.join.mockReturnValue('/fake/path/patterns/anti-patterns/answer-injection.md')
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

      mockedPath.join.mockReturnValue('/fake/path/patterns/obstacles/black-box-ai.md')
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

      mockedPath.join.mockReturnValue('/fake/path/patterns/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern.title).toBe('Active Partner')
      expect(pattern.emojiIndicator).toBe('🎯')
    })
  })

  describe('getAllPatterns', () => {
    it('should return all patterns for a category', () => {
      mockedPath.join
        .mockReturnValueOnce('/fake/path/patterns/patterns')
        .mockReturnValueOnce('/fake/path/patterns/patterns/pattern-one.md')
        .mockReturnValueOnce('/fake/path/patterns/patterns/pattern-two.md')

      mockedFs.readdirSync.mockReturnValue([
        'pattern-one.md',
        'pattern-two.md',
      ] as any)

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
      mockedPath.join.mockReturnValue('/fake/path/patterns/patterns')
      mockedFs.readdirSync.mockReturnValue([] as any)

      const patterns = getAllPatterns('patterns')

      expect(patterns).toHaveLength(0)
    })

    it('should skip non-markdown files', () => {
      mockedPath.join
        .mockReturnValueOnce('/fake/path/patterns/patterns')
        .mockReturnValueOnce('/fake/path/patterns/patterns/pattern-one.md')

      mockedFs.readdirSync.mockReturnValue([
        'pattern-one.md',
        '.DS_Store',
        'README.txt',
      ] as any)

      mockedFs.readFileSync.mockReturnValue('# Pattern One\n\n## Problem\nFirst problem.')

      const patterns = getAllPatterns('patterns')

      expect(patterns).toHaveLength(1)
      expect(patterns[0].slug).toBe('pattern-one')
    })
  })
})
