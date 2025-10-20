import { render, screen, within } from '@testing-library/react'
import PatternCatalogPage from '@/app/pattern-catalog/page'
import { PATTERN_CATALOG_TEST_IDS } from '@/app/pattern-catalog/test-ids'

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
    expect(within(patternList).getAllByRole('listitem')).toHaveLength(1)
    expect(within(antiPatternList).getAllByRole('listitem')).toHaveLength(1)
    expect(within(obstacleList).getAllByRole('listitem')).toHaveLength(1)
  })
})
