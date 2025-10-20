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

  it('shows static filter controls and a stubbed catalog list within the sidebar', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const filtersHeading = screen.getByRole('heading', { level: 3, name: /Filter catalog/i })
    const typeGroup = screen.getByRole('group', { name: /Type/i })
    const typeOptions = within(typeGroup).getAllByRole('checkbox')
    const authorGroup = screen.getByRole('group', { name: /Author/i })
    const authorOptions = within(authorGroup).getAllByRole('checkbox')
    const catalogRegion = screen.getByRole('region', { name: /Catalog preview/i })
    const patternList = within(catalogRegion).getByRole('list', { name: /^Patterns$/i })
    const antiPatternList = within(catalogRegion).getByRole('list', { name: /^Anti-patterns$/i })
    const obstacleList = within(catalogRegion).getByRole('list', { name: /^Obstacles$/i })

    expect(filtersHeading).toBeInTheDocument()
    typeOptions.forEach((checkbox) => {
      expect(checkbox).toBeDisabled()
    })
    authorOptions.forEach((checkbox) => {
      expect(checkbox).toBeDisabled()
    })
    expect(within(patternList).getAllByRole('listitem').length).toBeGreaterThan(0)
    expect(within(antiPatternList).getAllByRole('listitem').length).toBeGreaterThan(0)
    expect(within(obstacleList).getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('loads catalog items grouped by category with item counts', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByRole('region', { name: /Catalog preview/i })

    PATTERN_CATALOG_GROUPS.forEach(({ category, label, headingPattern }) => {
      const items = getAllPatterns(category).sort((a, b) => a.title.localeCompare(b.title))
      const heading = within(catalogRegion).getByRole('heading', {
        level: 4,
        name: headingPattern(items.length),
      })
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
    const catalogRegion = screen.getByRole('region', { name: /Catalog preview/i })
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
})
