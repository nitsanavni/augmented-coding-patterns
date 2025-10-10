import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/layout'
import { siteConfig } from '@/config/site'

describe('RootLayout', () => {
  const mockChildren = <div>Test Content</div>

  beforeEach(() => {
    render(<RootLayout>{mockChildren}</RootLayout>)
  })

  describe('Header', () => {
    it('renders header with site name as logo', () => {
      const logo = screen.getByRole('link', { name: siteConfig.name })
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('href', '/')
    })

    it('renders navigation with all category links', () => {
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()

      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')

      const obstaclesLink = screen.getByRole('link', { name: 'Obstacles' })
      expect(obstaclesLink).toBeInTheDocument()
      expect(obstaclesLink).toHaveAttribute('href', '/obstacles')

      const antiPatternsLink = screen.getByRole('link', { name: 'Anti-Patterns' })
      expect(antiPatternsLink).toBeInTheDocument()
      expect(antiPatternsLink).toHaveAttribute('href', '/anti-patterns')

      const patternsLink = screen.getByRole('link', { name: 'Patterns' })
      expect(patternsLink).toBeInTheDocument()
      expect(patternsLink).toHaveAttribute('href', '/patterns')
    })

    it('has proper semantic HTML structure with header element', () => {
      const header = document.querySelector('header')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Main Content', () => {
    it('renders children within main element', () => {
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveTextContent('Test Content')
    })

    it('has proper semantic HTML structure with main element', () => {
      const main = document.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders footer with site description', () => {
      const footerText = screen.getByText(/A guide to effective AI-augmented software development/i)
      expect(footerText).toBeInTheDocument()
    })

    it('renders GitHub link with proper attributes', () => {
      const githubLink = screen.getByRole('link', { name: 'GitHub' })
      expect(githubLink).toBeInTheDocument()
      expect(githubLink).toHaveAttribute('href', siteConfig.links.github)
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('has proper semantic HTML structure with footer element', () => {
      const footer = document.querySelector('footer')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('sets proper language attribute on html element', () => {
      const html = document.querySelector('html')
      expect(html).toHaveAttribute('lang', 'en')
    })

    it('renders all navigation links as proper anchor elements', () => {
      const navLinks = screen.getAllByRole('link')
      expect(navLinks.length).toBeGreaterThan(0)
      navLinks.forEach(link => {
        expect(link.tagName).toBe('A')
      })
    })
  })
})
