import { render, screen } from '@testing-library/react'
import Authors from '@/app/components/Authors'
import * as authorsLib from '@/lib/authors'

jest.mock('@/lib/authors')

const mockedGetAuthorById = authorsLib.getAuthorById as jest.MockedFunction<typeof authorsLib.getAuthorById>
const mockedGetGithubAvatarUrl = authorsLib.getGithubAvatarUrl as jest.MockedFunction<typeof authorsLib.getGithubAvatarUrl>

describe('Authors Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetGithubAvatarUrl.mockImplementation((github: string) => `https://github.com/${github}.png`)
  })

  it('renders nothing when authors array is empty', () => {
    const { container } = render(<Authors authors={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when authors prop is undefined', () => {
    const { container } = render(<Authors authors={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders "Documented by" label when authors exist', () => {
    mockedGetAuthorById.mockReturnValue({
      name: 'Lada Kesseler',
      github: 'lexler'
    })

    render(<Authors authors={['lada_kesseler']} />)

    expect(screen.getByText('Documented by')).toBeInTheDocument()
  })

  it('renders a single author correctly', () => {
    mockedGetAuthorById.mockReturnValue({
      name: 'Lada Kesseler',
      github: 'lexler'
    })

    render(<Authors authors={['lada_kesseler']} />)

    expect(screen.getByText('Lada Kesseler')).toBeInTheDocument()
    expect(mockedGetAuthorById).toHaveBeenCalledWith('lada_kesseler')
  })

  it('renders multiple authors correctly', () => {
    mockedGetAuthorById
      .mockReturnValueOnce({
        name: 'Lada Kesseler',
        github: 'lexler'
      })
      .mockReturnValueOnce({
        name: 'John Doe',
        github: 'johndoe'
      })

    render(<Authors authors={['lada_kesseler', 'john_doe']} />)

    expect(screen.getByText('Lada Kesseler')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('displays author avatar with correct src', () => {
    mockedGetAuthorById.mockReturnValue({
      name: 'Lada Kesseler',
      github: 'lexler'
    })

    render(<Authors authors={['lada_kesseler']} />)

    const avatar = screen.getByAltText("Lada Kesseler's avatar")
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'https://github.com/lexler.png')
  })

  it('links to GitHub profile when no custom URL provided', () => {
    mockedGetAuthorById.mockReturnValue({
      name: 'Lada Kesseler',
      github: 'lexler'
    })

    render(<Authors authors={['lada_kesseler']} />)

    const link = screen.getByRole('link', { name: /Lada Kesseler/ })
    expect(link).toHaveAttribute('href', 'https://github.com/lexler')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('links to custom URL when provided', () => {
    mockedGetAuthorById.mockReturnValue({
      name: 'John Doe',
      github: 'johndoe',
      url: 'https://example.com'
    })

    render(<Authors authors={['john_doe']} />)

    const link = screen.getByRole('link', { name: /John Doe/ })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('skips authors that are not found in the authors file', () => {
    mockedGetAuthorById
      .mockReturnValueOnce({
        name: 'Lada Kesseler',
        github: 'lexler'
      })
      .mockReturnValueOnce(null)

    render(<Authors authors={['lada_kesseler', 'nonexistent']} />)

    expect(screen.getByText('Lada Kesseler')).toBeInTheDocument()
    expect(screen.queryByText('nonexistent')).not.toBeInTheDocument()
  })

  it('renders nothing when all authors are not found', () => {
    mockedGetAuthorById.mockReturnValue(null)

    render(<Authors authors={['nonexistent1', 'nonexistent2']} />)

    // Should still render the container with "Documented by" label
    expect(screen.getByText('Documented by')).toBeInTheDocument()
  })

  describe('Avatar image attributes', () => {
    it('uses correct width and height for avatar', () => {
      mockedGetAuthorById.mockReturnValue({
        name: 'Lada Kesseler',
        github: 'lexler'
      })

      render(<Authors authors={['lada_kesseler']} />)

      const avatar = screen.getByAltText("Lada Kesseler's avatar")
      expect(avatar).toHaveAttribute('width', '32')
      expect(avatar).toHaveAttribute('height', '32')
    })
  })

  describe('Semantic HTML', () => {
    it('uses appropriate container structure', () => {
      mockedGetAuthorById.mockReturnValue({
        name: 'Lada Kesseler',
        github: 'lexler'
      })

      const { container } = render(<Authors authors={['lada_kesseler']} />)

      const authorContainer = container.querySelector('div')
      expect(authorContainer).toBeInTheDocument()
    })

    it('uses link elements for author cards', () => {
      mockedGetAuthorById.mockReturnValue({
        name: 'Lada Kesseler',
        github: 'lexler'
      })

      render(<Authors authors={['lada_kesseler']} />)

      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
    })
  })
})
