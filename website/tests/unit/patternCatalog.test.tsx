import { render, screen } from '@testing-library/react'
import PatternCatalogPage from '@/app/pattern-catalog/page'

describe('PatternCatalogPage', () => {
  it('renders title heading', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const heading = screen.getByRole('heading', { level: 1, name: /Pattern Catalog/i })
    expect(heading).toBeInTheDocument()
  })
})
