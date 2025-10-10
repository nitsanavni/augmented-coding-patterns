import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { Author } from './types'

const AUTHORS_FILE_PATH = path.join(process.cwd(), 'config', 'authors.yaml')

interface AuthorsData {
  [github: string]: {
    name: string
    github: string
    url?: string
  }
}

let authorsCache: AuthorsData | null = null

export function loadAuthors(): AuthorsData {
  if (authorsCache) {
    return authorsCache
  }

  try {
    const fileContents = fs.readFileSync(AUTHORS_FILE_PATH, 'utf-8')
    const data = yaml.load(fileContents) as AuthorsData
    authorsCache = data
    return data
  } catch (error) {
    console.error(`Failed to load authors file: ${AUTHORS_FILE_PATH}`, error)
    return {}
  }
}

export function getAuthorByGithub(github: string): Author | null {
  const authors = loadAuthors()
  const authorData = authors[github]

  if (!authorData) {
    return null
  }

  return {
    name: authorData.name,
    github: authorData.github,
    ...(authorData.url && { url: authorData.url })
  }
}

export function getGithubAvatarUrl(github: string): string {
  return `https://github.com/${github}.png`
}
