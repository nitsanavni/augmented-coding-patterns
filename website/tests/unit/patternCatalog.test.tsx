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
    const typeSelect = screen.getByRole('combobox', { name: /Type/i })
    const authorSelect = screen.getByRole('combobox', { name: /Author/i })
    const list = screen.getByRole('list', { name: /Catalog preview/i })

    expect(filtersHeading).toBeInTheDocument()
    expect(typeSelect).toBeDisabled()
    expect(authorSelect).toBeDisabled()
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
  })
})
