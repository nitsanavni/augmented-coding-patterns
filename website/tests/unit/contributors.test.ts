import { getContributorStats } from '@/lib/contributors'
import { getAllPatterns } from '@/lib/markdown'
import { getAuthorById, getGithubAvatarUrl } from '@/lib/authors'
import { PatternContent } from '@/lib/types'

jest.mock('@/lib/markdown')
jest.mock('@/lib/authors')

const mockGetAllPatterns = getAllPatterns as jest.MockedFunction<typeof getAllPatterns>
const mockGetAuthorById = getAuthorById as jest.MockedFunction<typeof getAuthorById>
const mockGetGithubAvatarUrl = getGithubAvatarUrl as jest.MockedFunction<typeof getGithubAvatarUrl>

describe('Contributor utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getContributorStats', () => {
    it('should return correct aggregated statistics for multiple patterns', () => {
      const mockPatterns: PatternContent[] = [
        {
          title: 'Pattern 1',
          slug: 'pattern-1',
          category: 'patterns',
          content: 'Content 1',
          rawContent: 'Raw 1',
          authors: ['author1']
        },
        {
          title: 'Pattern 2',
          slug: 'pattern-2',
          category: 'patterns',
          content: 'Content 2',
          rawContent: 'Raw 2',
          authors: ['author1']
        }
      ]

      const mockAntiPatterns: PatternContent[] = [
        {
          title: 'Anti-Pattern 1',
          slug: 'anti-pattern-1',
          category: 'anti-patterns',
          content: 'Content 3',
          rawContent: 'Raw 3',
          authors: ['author1']
        }
      ]

      const mockObstacles: PatternContent[] = [
        {
          title: 'Obstacle 1',
          slug: 'obstacle-1',
          category: 'obstacles',
          content: 'Content 4',
          rawContent: 'Raw 4',
          authors: ['author1']
        }
      ]

      mockGetAllPatterns.mockImplementation((category) => {
        if (category === 'patterns') return mockPatterns
        if (category === 'anti-patterns') return mockAntiPatterns
        if (category === 'obstacles') return mockObstacles
        return []
      })

      mockGetAuthorById.mockReturnValue({
        name: 'Author One',
        github: 'author1'
      })

      mockGetGithubAvatarUrl.mockReturnValue('https://github.com/author1.png')

      const stats = getContributorStats()

      expect(stats).toHaveLength(1)
      expect(stats[0]).toEqual({
        authorId: 'author1',
        name: 'Author One',
        github: 'author1',
        avatarUrl: 'https://github.com/author1.png',
        total: 4,
        patterns: 2,
        antiPatterns: 1,
        obstacles: 1
      })
    })

    it('should handle patterns with multiple authors - each author gets credit', () => {
      const mockPatterns: PatternContent[] = [
        {
          title: 'Pattern 1',
          slug: 'pattern-1',
          category: 'patterns',
          content: 'Content 1',
          rawContent: 'Raw 1',
          authors: ['author1', 'author2']
        }
      ]

      mockGetAllPatterns.mockImplementation((category) => {
        if (category === 'patterns') return mockPatterns
        return []
      })

      mockGetAuthorById.mockImplementation((authorId) => {
        if (authorId === 'author1') {
          return { name: 'Author One', github: 'author1' }
        }
        if (authorId === 'author2') {
          return { name: 'Author Two', github: 'author2' }
        }
        return null
      })

      mockGetGithubAvatarUrl.mockImplementation((github) => {
        return `https://github.com/${github}.png`
      })

      const stats = getContributorStats()

      expect(stats).toHaveLength(2)
      expect(stats[0].patterns).toBe(1)
      expect(stats[1].patterns).toBe(1)
      expect(stats.find(s => s.authorId === 'author1')).toBeDefined()
      expect(stats.find(s => s.authorId === 'author2')).toBeDefined()
    })

    it('should handle patterns with no authors gracefully', () => {
      const mockPatterns: PatternContent[] = [
        {
          title: 'Pattern 1',
          slug: 'pattern-1',
          category: 'patterns',
          content: 'Content 1',
          rawContent: 'Raw 1',
          authors: []
        },
        {
          title: 'Pattern 2',
          slug: 'pattern-2',
          category: 'patterns',
          content: 'Content 2',
          rawContent: 'Raw 2'
        },
        {
          title: 'Pattern 3',
          slug: 'pattern-3',
          category: 'patterns',
          content: 'Content 3',
          rawContent: 'Raw 3',
          authors: ['author1']
        }
      ]

      mockGetAllPatterns.mockImplementation((category) => {
        if (category === 'patterns') return mockPatterns
        return []
      })

      mockGetAuthorById.mockReturnValue({
        name: 'Author One',
        github: 'author1'
      })

      mockGetGithubAvatarUrl.mockReturnValue('https://github.com/author1.png')

      const stats = getContributorStats()

      expect(stats).toHaveLength(1)
      expect(stats[0].authorId).toBe('author1')
    })

    it('should sort results by total descending, then by name ascending', () => {
      const mockPatterns: PatternContent[] = [
        {
          title: 'Pattern 1',
          slug: 'pattern-1',
          category: 'patterns',
          content: 'Content 1',
          rawContent: 'Raw 1',
          authors: ['author1']
        },
        {
          title: 'Pattern 2',
          slug: 'pattern-2',
          category: 'patterns',
          content: 'Content 2',
          rawContent: 'Raw 2',
          authors: ['author2']
        },
        {
          title: 'Pattern 3',
          slug: 'pattern-3',
          category: 'patterns',
          content: 'Content 3',
          rawContent: 'Raw 3',
          authors: ['author2']
        },
        {
          title: 'Pattern 4',
          slug: 'pattern-4',
          category: 'patterns',
          content: 'Content 4',
          rawContent: 'Raw 4',
          authors: ['author3']
        }
      ]

      mockGetAllPatterns.mockImplementation((category) => {
        if (category === 'patterns') return mockPatterns
        return []
      })

      mockGetAuthorById.mockImplementation((authorId) => {
        if (authorId === 'author1') return { name: 'Charlie', github: 'author1' }
        if (authorId === 'author2') return { name: 'Alice', github: 'author2' }
        if (authorId === 'author3') return { name: 'Bob', github: 'author3' }
        return null
      })

      mockGetGithubAvatarUrl.mockImplementation((github) => {
        return `https://github.com/${github}.png`
      })

      const stats = getContributorStats()

      expect(stats).toHaveLength(3)
      expect(stats[0].authorId).toBe('author2')
      expect(stats[0].name).toBe('Alice')
      expect(stats[0].total).toBe(2)
      expect(stats[1].authorId).toBe('author3')
      expect(stats[1].name).toBe('Bob')
      expect(stats[1].total).toBe(1)
      expect(stats[2].authorId).toBe('author1')
      expect(stats[2].name).toBe('Charlie')
      expect(stats[2].total).toBe(1)
    })

    it('should return correct category breakdowns', () => {
      const mockPatterns: PatternContent[] = [
        {
          title: 'Pattern 1',
          slug: 'pattern-1',
          category: 'patterns',
          content: 'Content 1',
          rawContent: 'Raw 1',
          authors: ['author1']
        },
        {
          title: 'Pattern 2',
          slug: 'pattern-2',
          category: 'patterns',
          content: 'Content 2',
          rawContent: 'Raw 2',
          authors: ['author1']
        }
      ]

      const mockAntiPatterns: PatternContent[] = [
        {
          title: 'Anti-Pattern 1',
          slug: 'anti-pattern-1',
          category: 'anti-patterns',
          content: 'Content 3',
          rawContent: 'Raw 3',
          authors: ['author1']
        },
        {
          title: 'Anti-Pattern 2',
          slug: 'anti-pattern-2',
          category: 'anti-patterns',
          content: 'Content 4',
          rawContent: 'Raw 4',
          authors: ['author1']
        },
        {
          title: 'Anti-Pattern 3',
          slug: 'anti-pattern-3',
          category: 'anti-patterns',
          content: 'Content 5',
          rawContent: 'Raw 5',
          authors: ['author1']
        }
      ]

      const mockObstacles: PatternContent[] = [
        {
          title: 'Obstacle 1',
          slug: 'obstacle-1',
          category: 'obstacles',
          content: 'Content 6',
          rawContent: 'Raw 6',
          authors: ['author1']
        },
        {
          title: 'Obstacle 2',
          slug: 'obstacle-2',
          category: 'obstacles',
          content: 'Content 7',
          rawContent: 'Raw 7',
          authors: ['author1']
        },
        {
          title: 'Obstacle 3',
          slug: 'obstacle-3',
          category: 'obstacles',
          content: 'Content 8',
          rawContent: 'Raw 8',
          authors: ['author1']
        },
        {
          title: 'Obstacle 4',
          slug: 'obstacle-4',
          category: 'obstacles',
          content: 'Content 9',
          rawContent: 'Raw 9',
          authors: ['author1']
        }
      ]

      mockGetAllPatterns.mockImplementation((category) => {
        if (category === 'patterns') return mockPatterns
        if (category === 'anti-patterns') return mockAntiPatterns
        if (category === 'obstacles') return mockObstacles
        return []
      })

      mockGetAuthorById.mockReturnValue({
        name: 'Author One',
        github: 'author1'
      })

      mockGetGithubAvatarUrl.mockReturnValue('https://github.com/author1.png')

      const stats = getContributorStats()

      expect(stats).toHaveLength(1)
      expect(stats[0].patterns).toBe(2)
      expect(stats[0].antiPatterns).toBe(3)
      expect(stats[0].obstacles).toBe(4)
      expect(stats[0].total).toBe(9)
    })

    it('should handle author not found in registry by skipping gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      const mockPatterns: PatternContent[] = [
        {
          title: 'Pattern 1',
          slug: 'pattern-1',
          category: 'patterns',
          content: 'Content 1',
          rawContent: 'Raw 1',
          authors: ['author1', 'unknown_author']
        }
      ]

      mockGetAllPatterns.mockImplementation((category) => {
        if (category === 'patterns') return mockPatterns
        return []
      })

      mockGetAuthorById.mockImplementation((authorId) => {
        if (authorId === 'author1') {
          return { name: 'Author One', github: 'author1' }
        }
        return null
      })

      mockGetGithubAvatarUrl.mockReturnValue('https://github.com/author1.png')

      const stats = getContributorStats()

      expect(stats).toHaveLength(1)
      expect(stats[0].authorId).toBe('author1')
      expect(consoleWarnSpy).toHaveBeenCalledWith('Author not found: unknown_author')

      consoleWarnSpy.mockRestore()
    })

    it('should include optional url field when author has one', () => {
      const mockPatterns: PatternContent[] = [
        {
          title: 'Pattern 1',
          slug: 'pattern-1',
          category: 'patterns',
          content: 'Content 1',
          rawContent: 'Raw 1',
          authors: ['author1', 'author2']
        }
      ]

      mockGetAllPatterns.mockImplementation((category) => {
        if (category === 'patterns') return mockPatterns
        return []
      })

      mockGetAuthorById.mockImplementation((authorId) => {
        if (authorId === 'author1') {
          return { name: 'Author One', github: 'author1', url: 'https://example.com' }
        }
        if (authorId === 'author2') {
          return { name: 'Author Two', github: 'author2' }
        }
        return null
      })

      mockGetGithubAvatarUrl.mockImplementation((github) => {
        return `https://github.com/${github}.png`
      })

      const stats = getContributorStats()

      expect(stats).toHaveLength(2)
      const author1Stats = stats.find(s => s.authorId === 'author1')
      const author2Stats = stats.find(s => s.authorId === 'author2')

      expect(author1Stats?.url).toBe('https://example.com')
      expect(author2Stats?.url).toBeUndefined()
    })

    it('should handle empty patterns across all categories', () => {
      mockGetAllPatterns.mockReturnValue([])

      const stats = getContributorStats()

      expect(stats).toHaveLength(0)
    })
  })
})
