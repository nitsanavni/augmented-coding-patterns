import { getAuthorById } from '@/lib/authors'
import styles from './CompactAuthors.module.css'

interface CompactAuthorsProps {
  authors: string[]
}

export default function CompactAuthors({ authors }: CompactAuthorsProps) {
  if (!authors || authors.length === 0) {
    return null
  }

  const authorNames = authors
    .map(authorId => {
      const author = getAuthorById(authorId)
      return author ? author.name : null
    })
    .filter((name): name is string => name !== null)

  if (authorNames.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <span className={styles.authorNames}>{authorNames.join(', ')}</span>
    </div>
  )
}
