import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatternCatalogPage from '@/app/pattern-catalog/page'
import { PATTERN_CATALOG_TEST_IDS } from '@/app/pattern-catalog/test-ids'
import { PATTERN_CATALOG_GROUPS } from '@/app/pattern-catalog/constants'
import { getAllPatterns } from '@/lib/markdown'

describe('PatternCatalogPage', () => {
  it('renders title heading', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const heading = screen.getByRole('heading', { level: 1, name: /Pattern Catalog/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders sidebar navigation and detail placeholders', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const sidebar = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.sidebar)
    const detail = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.detail)

    expect(sidebar).toBeInTheDocument()
    expect(detail).toBeInTheDocument()
  })

  it('shows interactive filter controls and a stubbed catalog list within the sidebar', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const typeFilterGroup = screen.getByRole('group', { name: /Type filter/i })
    const allTypesButton = within(typeFilterGroup).getByRole('button', { name: '∞' })
    const patternsButton = screen.getByRole('button', { name: /^Patterns$/i })
    const antiPatternsButton = screen.getByRole('button', { name: /^Anti-patterns$/i })
    const obstaclesButton = screen.getByRole('button', { name: /^Obstacles$/i })
    const authorToggle = screen.getByRole('button', { name: /Author filter/i })
    const catalogRegion = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.sidebar)

    expect(typeFilterGroup).toBeInTheDocument()
    expect(allTypesButton).toHaveAttribute('aria-pressed', 'true')
    expect(allTypesButton).toHaveAttribute('title', 'All types')
    expect(patternsButton).toHaveAttribute('aria-pressed', 'true')
    expect(antiPatternsButton).toHaveAttribute('aria-pressed', 'true')
    expect(obstaclesButton).toHaveAttribute('aria-pressed', 'true')

    expect(authorToggle).toHaveTextContent(/All authors/i)
    await user.click(authorToggle)
    const authorMenu = screen.getByRole('group', { name: /Author filter options/i })
    within(authorMenu)
      .getAllByRole('checkbox')
      .forEach((checkbox) => {
        expect((checkbox as HTMLInputElement).checked).toBe(true)
      })
    await user.click(authorToggle)

    const patternList = within(catalogRegion).getByRole('list', { name: /^Patterns$/i })
    const antiPatternList = within(catalogRegion).getByRole('list', { name: /^Anti-patterns$/i })
    const obstacleList = within(catalogRegion).getByRole('list', { name: /^Obstacles$/i })

    expect(within(patternList).getAllByRole('listitem').length).toBeGreaterThan(0)
    expect(within(antiPatternList).getAllByRole('listitem').length).toBeGreaterThan(0)
    expect(within(obstacleList).getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('loads catalog items grouped by category with item counts', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.sidebar)

    PATTERN_CATALOG_GROUPS.forEach(({ category, label, headingPattern }) => {
      const items = getAllPatterns(category).sort((a, b) => a.title.localeCompare(b.title))
      const heading = within(catalogRegion).getByRole('button', {
        name: headingPattern(items.length),
      })
      expect(heading).toHaveAttribute('aria-expanded')

      const list = within(catalogRegion).getByRole('list', { name: new RegExp(`^${label}$`, 'i') })
      const links = within(list).getAllByRole('link')

      expect(links).toHaveLength(items.length)
      expect(links[0]).toHaveAttribute('href', `/${category}/${items[0].slug}`)
      expect(links[0]).toHaveTextContent(items[0].title)
    })
  })

  it('shows selected item details in the detail pane when an entry is chosen', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const detailPane = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.detail)
    expect(within(detailPane).getByText(/Pick a pattern to see its guidance/i)).toBeInTheDocument()

    const { category } = PATTERN_CATALOG_GROUPS[0]
    const items = getAllPatterns(category).sort((a, b) => a.title.localeCompare(b.title))
    const target = items[0]
    const catalogRegion = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.sidebar)
    const link = within(catalogRegion).getByRole('link', { name: target.title })

    await user.click(link)

    expect(within(detailPane).queryByText(/Pick a pattern to see its guidance/i)).not.toBeInTheDocument()
    expect(
      within(detailPane).getByRole('heading', { level: 2, name: target.title })
    ).toBeInTheDocument()
    expect(within(detailPane).getByText(/Push back on unclear instructions/i)).toBeInTheDocument()
    expect(within(detailPane).getByText(/Documented by/i)).toHaveTextContent(/Lada Kesseler/i)
    expect(within(detailPane).queryByText(/Open full entry/i)).not.toBeInTheDocument()
  })

  it('filters catalog entries by type selections', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.sidebar)
    const patternsButton = screen.getByRole('button', { name: /^Patterns$/i })
    const antiPatternsButton = screen.getByRole('button', { name: /^Anti-patterns$/i })

    await user.click(patternsButton)
    await user.click(antiPatternsButton)

    expect(within(catalogRegion).queryByRole('list', { name: /^Patterns$/i })).toBeNull()
    expect(within(catalogRegion).queryByRole('list', { name: /^Anti-patterns$/i })).toBeNull()
    expect(within(catalogRegion).getByRole('list', { name: /^Obstacles$/i })).toBeInTheDocument()

    await user.click(patternsButton)

    expect(
      await within(catalogRegion).findByRole('list', { name: /^Patterns$/i })
    ).toBeInTheDocument()
  })

  it('filters catalog entries by author selections', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.sidebar)
    const antiPatternsButton = screen.getByRole('button', { name: /^Anti-patterns$/i })
    const obstaclesButton = screen.getByRole('button', { name: /^Obstacles$/i })
    const authorToggle = screen.getByRole('button', { name: /Author filter/i })

    await user.click(antiPatternsButton)
    await user.click(obstaclesButton)

    await user.click(authorToggle)
    const authorMenu = screen.getByRole('group', { name: /Author filter options/i })
    const authorCheckboxes = within(authorMenu).getAllByRole('checkbox') as HTMLInputElement[]
    const ivettCheckbox =
      (within(authorMenu).queryByRole('checkbox', { name: /ivett/i }) as HTMLInputElement | null) ??
      authorCheckboxes[0]

    for (const checkbox of authorCheckboxes) {
      if (checkbox !== ivettCheckbox && checkbox.checked) {
        await user.click(checkbox)
      }
    }
    await user.click(authorToggle)

    const expectedPatterns = getAllPatterns('patterns')
      .filter((pattern) => pattern.authors?.includes(ivettCheckbox.value))
      .sort((a, b) => a.title.localeCompare(b.title))

    const patternList = await within(catalogRegion).findByRole('list', { name: /^Patterns$/i })
    const patternLinks = within(patternList).getAllByRole('link')
    const renderedTitles = patternLinks.map((link) => link.textContent?.trim())
    const expectedTitles = expectedPatterns.map((pattern) => pattern.title)

    expect(renderedTitles).toEqual(expectedTitles)
  })

  it('shows reset option when filters hide all entries', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(PATTERN_CATALOG_TEST_IDS.sidebar)
    const typeFilterGroup = screen.getByRole('group', { name: /Type filter/i })
    const allTypesButton = within(typeFilterGroup).getByRole('button', { name: '∞' })
    const patternsButton = screen.getByRole('button', { name: /^Patterns$/i })
    const antiPatternsButton = screen.getByRole('button', { name: /^Anti-patterns$/i })
    const obstaclesButton = screen.getByRole('button', { name: /^Obstacles$/i })

    await user.click(patternsButton)
    await user.click(antiPatternsButton)
    await user.click(obstaclesButton)

    expect(screen.getByText(/No entries match these filters/i)).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /Reset filters/i })
    await user.click(resetButton)

    expect(allTypesButton).toHaveAttribute('aria-pressed', 'true')
    expect(patternsButton).toHaveAttribute('aria-pressed', 'true')
    expect(antiPatternsButton).toHaveAttribute('aria-pressed', 'true')
    expect(obstaclesButton).toHaveAttribute('aria-pressed', 'true')
    expect(
      await within(catalogRegion).findByRole('list', { name: /^Patterns$/i })
    ).toBeInTheDocument()
  })
})
