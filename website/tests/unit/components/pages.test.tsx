import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import CategoryPage from '@/app/[category]/page'
import PatternPage from '@/app/[category]/[slug]/page'
import { getPatternSlugs, getAllPatterns, getPatternBySlug } from '@/lib/markdown'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}))

jest.mock('@/lib/markdown', () => ({
  getPatternSlugs: jest.fn(),
  getAllPatterns: jest.fn(),
  getPatternBySlug: jest.fn(),
}))

const mockGetPatternSlugs = getPatternSlugs as jest.MockedFunction<typeof getPatternSlugs>
const mockGetAllPatterns = getAllPatterns as jest.MockedFunction<typeof getAllPatterns>
const mockGetPatternBySlug = getPatternBySlug as jest.MockedFunction<typeof getPatternBySlug>

describe('Home Page', () => {
  beforeEach(() => {
    mockGetPatternSlugs.mockImplementation((category) => {
      if (category === 'patterns') return ['pattern-1', 'pattern-2', 'pattern-3']
      if (category === 'anti-patterns') return ['anti-1', 'anti-2']
      if (category === 'obstacles') return ['obstacle-1']
      return []
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /Augmented Coding Patterns/i, level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders the hero description', () => {
    render(<Home />)
    const description = screen.getByText(/A comprehensive collection of patterns/i)
    expect(description).toBeInTheDocument()
  })

  describe('Category Cards', () => {
    it('renders all three category cards', () => {
      render(<Home />)
      const cards = screen.getAllByRole('link')
      const categoryCards = cards.filter(card =>
        card.getAttribute('href')?.match(/^\/(obstacles|anti-patterns|patterns)$/)
      )
      expect(categoryCards).toHaveLength(3)
    })

    it('renders Obstacles card with correct count and link', () => {
      render(<Home />)
      const obstaclesCard = screen.getByRole('link', { name: /Obstacles/i })
      expect(obstaclesCard).toHaveAttribute('href', '/obstacles')
      expect(screen.getByText('1 Obstacles')).toBeInTheDocument()
    })

    it('renders Anti-Patterns card with correct count and link', () => {
      render(<Home />)
      const antiPatternsCard = screen.getByRole('link', { name: /Anti-Patterns/i })
      expect(antiPatternsCard).toHaveAttribute('href', '/anti-patterns')
      expect(screen.getByText('2 Anti-Patterns')).toBeInTheDocument()
    })

    it('renders Patterns card with correct count and link', () => {
      render(<Home />)
      const links = screen.getAllByRole('link')
      const patternsCard = links.find(link =>
        link.getAttribute('href') === '/patterns'
      )
      expect(patternsCard).toBeDefined()
      expect(patternsCard).toHaveAttribute('href', '/patterns')
      expect(screen.getByText('3 Patterns')).toBeInTheDocument()
    })

    it('displays category icons', () => {
      render(<Home />)
      expect(screen.getByText('⛰️')).toBeInTheDocument()
      expect(screen.getByText('⚠️')).toBeInTheDocument()
      expect(screen.getByText('🧩')).toBeInTheDocument()
    })

    it('displays category descriptions', () => {
      render(<Home />)
      expect(screen.getByText(/Understand the inherent limitations/i)).toBeInTheDocument()
      expect(screen.getByText(/Common mistakes and pitfalls/i)).toBeInTheDocument()
      expect(screen.getByText(/Proven strategies and best practices/i)).toBeInTheDocument()
    })
  })

  describe('Semantic HTML', () => {
    it('uses h1 for main heading', () => {
      render(<Home />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Augmented Coding Patterns')
    })

    it('uses h2 for category titles', () => {
      render(<Home />)
      const h2Headings = screen.getAllByRole('heading', { level: 2 })
      expect(h2Headings).toHaveLength(4)
      expect(h2Headings[0]).toHaveTextContent('Obstacles')
      expect(h2Headings[1]).toHaveTextContent('Anti-Patterns')
      expect(h2Headings[2]).toHaveTextContent('Patterns')
      expect(h2Headings[3]).toHaveTextContent('Pattern Relationships')
    })
  })
})

describe('Category List Page', () => {
  const mockPatterns = [
    {
      title: 'Test Pattern 1',
      slug: 'test-pattern-1',
      category: 'patterns' as const,
      content: '# Test Pattern 1\n\nTest content',
      emojiIndicator: '✅',
      rawContent: '---\n---\n# Test Pattern 1\n\nTest content'
    },
    {
      title: 'Test Pattern 2',
      slug: 'test-pattern-2',
      category: 'patterns' as const,
      content: '# Test Pattern 2\n\nMore content',
      emojiIndicator: '🎯',
      rawContent: '---\n---\n# Test Pattern 2\n\nMore content'
    }
  ]

  beforeEach(() => {
    mockGetAllPatterns.mockReturnValue(mockPatterns)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders category header with correct title for patterns', async () => {
    const params = Promise.resolve({ category: 'patterns' })
    render(await CategoryPage({ params }))

    const heading = screen.getByRole('heading', { name: /Patterns/i, level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders category header with correct title for obstacles', async () => {
    const params = Promise.resolve({ category: 'obstacles' })
    render(await CategoryPage({ params }))

    const heading = screen.getByRole('heading', { name: /Obstacles/i, level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders category header with correct title for anti-patterns', async () => {
    const params = Promise.resolve({ category: 'anti-patterns' })
    render(await CategoryPage({ params }))

    const heading = screen.getByRole('heading', { name: /Anti-Patterns/i, level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders category description', async () => {
    const params = Promise.resolve({ category: 'patterns' })
    render(await CategoryPage({ params }))

    expect(screen.getByText(/Proven strategies and best practices/i)).toBeInTheDocument()
  })

  it('renders category icon', async () => {
    const params = Promise.resolve({ category: 'patterns' })
    render(await CategoryPage({ params }))

    expect(screen.getByText('🧩')).toBeInTheDocument()
  })

  it('renders pattern count', async () => {
    const params = Promise.resolve({ category: 'patterns' })
    render(await CategoryPage({ params }))

    expect(screen.getByText('2 patterns available')).toBeInTheDocument()
  })

  it('renders all pattern cards as links', async () => {
    const params = Promise.resolve({ category: 'patterns' })
    render(await CategoryPage({ params }))

    const pattern1Link = screen.getByRole('link', { name: /Test Pattern 1/i })
    const pattern2Link = screen.getByRole('link', { name: /Test Pattern 2/i })

    expect(pattern1Link).toBeInTheDocument()
    expect(pattern1Link).toHaveAttribute('href', '/patterns/test-pattern-1')

    expect(pattern2Link).toBeInTheDocument()
    expect(pattern2Link).toHaveAttribute('href', '/patterns/test-pattern-2')
  })

  it('renders pattern emojis when present', async () => {
    const params = Promise.resolve({ category: 'patterns' })
    render(await CategoryPage({ params }))

    expect(screen.getByText('✅')).toBeInTheDocument()
    expect(screen.getByText('🎯')).toBeInTheDocument()
  })

  it('renders pattern titles as h2 headings', async () => {
    const params = Promise.resolve({ category: 'patterns' })
    render(await CategoryPage({ params }))

    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    const patternHeadings = h2Headings.filter(h =>
      h.textContent === 'Test Pattern 1' || h.textContent === 'Test Pattern 2'
    )
    expect(patternHeadings).toHaveLength(2)
  })

  describe('Semantic HTML', () => {
    it('uses h1 for category title', async () => {
      const params = Promise.resolve({ category: 'patterns' })
      render(await CategoryPage({ params }))

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent(/Patterns/)
    })

    it('uses header element for category header', async () => {
      const params = Promise.resolve({ category: 'patterns' })
      render(await CategoryPage({ params }))

      const headers = document.querySelectorAll('header')
      expect(headers.length).toBeGreaterThan(0)
    })
  })
})

describe('Pattern Detail Page', () => {
  const mockPattern = {
    title: 'Test Pattern Detail',
    slug: 'test-pattern-detail',
    category: 'patterns' as const,
    content: '# Test Pattern Detail\n\nThis is the pattern content.\n\n## Section 1\n\nMore details here.',
    emojiIndicator: '🚀',
    rawContent: '---\n---\n# Test Pattern Detail\n\nThis is the pattern content.\n\n## Section 1\n\nMore details here.'
  }

  beforeEach(() => {
    mockGetPatternBySlug.mockReturnValue(mockPattern)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders pattern title as h1', async () => {
    const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
    render(await PatternPage({ params }))

    const heading = screen.getByRole('heading', { name: /Test Pattern Detail/i, level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders back link to category page', async () => {
    const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
    render(await PatternPage({ params }))

    const backLink = screen.getByRole('link', { name: /Back to Patterns/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/patterns')
  })

  it('renders pattern emoji when present', async () => {
    const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
    render(await PatternPage({ params }))

    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  it('renders category badge', async () => {
    const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
    render(await PatternPage({ params }))

    expect(screen.getByText('Pattern')).toBeInTheDocument()
  })

  it('renders markdown content', async () => {
    const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
    render(await PatternPage({ params }))

    expect(screen.getByText(/This is the pattern content/i)).toBeInTheDocument()
    expect(screen.getByText(/More details here/i)).toBeInTheDocument()
  })

  it('renders content within article element', async () => {
    const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
    render(await PatternPage({ params }))

    const article = document.querySelector('article')
    expect(article).toBeInTheDocument()
    expect(article).toHaveTextContent(/This is the pattern content/)
  })

  describe('Different Categories', () => {
    it('renders correct category label for obstacles', async () => {
      const obstaclePattern = { ...mockPattern, category: 'obstacles' as const }
      mockGetPatternBySlug.mockReturnValue(obstaclePattern)

      const params = Promise.resolve({ category: 'obstacles', slug: 'test-pattern-detail' })
      render(await PatternPage({ params }))

      expect(screen.getByText('Obstacle')).toBeInTheDocument()
      const backLink = screen.getByRole('link', { name: /Back to Obstacles/i })
      expect(backLink).toHaveAttribute('href', '/obstacles')
    })

    it('renders correct category label for anti-patterns', async () => {
      const antiPattern = { ...mockPattern, category: 'anti-patterns' as const }
      mockGetPatternBySlug.mockReturnValue(antiPattern)

      const params = Promise.resolve({ category: 'anti-patterns', slug: 'test-pattern-detail' })
      render(await PatternPage({ params }))

      expect(screen.getByText('Anti-Pattern')).toBeInTheDocument()
      const backLink = screen.getByRole('link', { name: /Back to Anti-Patterns/i })
      expect(backLink).toHaveAttribute('href', '/anti-patterns')
    })
  })

  describe('Semantic HTML', () => {
    it('uses h1 for pattern title', async () => {
      const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
      render(await PatternPage({ params }))

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Test Pattern Detail')
    })

    it('uses article element for content', async () => {
      const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
      render(await PatternPage({ params }))

      const article = document.querySelector('article')
      expect(article).toBeInTheDocument()
    })

    it('uses header element for pattern header', async () => {
      const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
      render(await PatternPage({ params }))

      const headers = document.querySelectorAll('header')
      expect(headers.length).toBeGreaterThan(0)
    })
  })

  describe('Pattern without emoji', () => {
    it('renders correctly when pattern has no emoji', async () => {
      const patternWithoutEmoji = { ...mockPattern, emojiIndicator: undefined }
      mockGetPatternBySlug.mockReturnValue(patternWithoutEmoji)

      const params = Promise.resolve({ category: 'patterns', slug: 'test-pattern-detail' })
      render(await PatternPage({ params }))

      const heading = screen.getByRole('heading', { name: /Test Pattern Detail/i, level: 1 })
      expect(heading).toBeInTheDocument()
      expect(screen.queryByText('🚀')).not.toBeInTheDocument()
    })
  })
})
