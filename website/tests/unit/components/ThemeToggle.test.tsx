import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '@/app/components/ThemeToggle'

jest.mock('@/app/hooks/useTheme', () => ({
  useTheme: jest.fn()
}))

import { useTheme } from '@/app/hooks/useTheme'
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with sun emoji when theme is light', () => {
    const useThemeNullable = {
      theme: 'light' as const,
      toggleTheme: jest.fn()
    }
    mockUseTheme.mockReturnValue(useThemeNullable)

    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toHaveTextContent('☀️')
  })

  it('renders with moon emoji when theme is dark', () => {
    const useThemeNullable = {
      theme: 'dark' as const,
      toggleTheme: jest.fn()
    }
    mockUseTheme.mockReturnValue(useThemeNullable)

    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toHaveTextContent('🌙')
  })

  it('calls toggleTheme when clicked', async () => {
    const toggleTheme = jest.fn()
    const useThemeNullable = {
      theme: 'light' as const,
      toggleTheme
    }
    mockUseTheme.mockReturnValue(useThemeNullable)

    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button'))

    expect(toggleTheme).toHaveBeenCalledTimes(1)
  })

  it('has accessible label for screen readers', () => {
    const useThemeNullable = {
      theme: 'light' as const,
      toggleTheme: jest.fn()
    }
    mockUseTheme.mockReturnValue(useThemeNullable)

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })
})