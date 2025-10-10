import { loadAuthors, getAuthorByGithub, getGithubAvatarUrl } from '@/lib/authors'

describe('Author utilities', () => {

  describe('loadAuthors', () => {
    it('should load and parse authors from actual YAML file', () => {
      const authors = loadAuthors()

      // Test that the file was loaded successfully
      expect(authors).toBeDefined()
      expect(typeof authors).toBe('object')

      // Test the actual author from the config file
      expect(authors).toHaveProperty('lexler')
      expect(authors.lexler).toEqual({
        name: 'Lada Kesseler',
        github: 'lexler'
      })
    })
  })

  describe('getAuthorByGithub', () => {
    it('should return author data when GitHub username exists', () => {
      const author = getAuthorByGithub('lexler')

      expect(author).toEqual({
        name: 'Lada Kesseler',
        github: 'lexler'
      })
    })

    it('should return null when GitHub username does not exist', () => {
      const author = getAuthorByGithub('nonexistent')

      expect(author).toBeNull()
    })

    it('should handle empty string username', () => {
      const author = getAuthorByGithub('')

      expect(author).toBeNull()
    })
  })

  describe('getGithubAvatarUrl', () => {
    it('should return correct GitHub avatar URL', () => {
      const url = getGithubAvatarUrl('lexler')
      expect(url).toBe('https://github.com/lexler.png')
    })

    it('should work with any GitHub username', () => {
      const url = getGithubAvatarUrl('octocat')
      expect(url).toBe('https://github.com/octocat.png')
    })

    it('should handle empty string', () => {
      const url = getGithubAvatarUrl('')
      expect(url).toBe('https://github.com/.png')
    })
  })
})
