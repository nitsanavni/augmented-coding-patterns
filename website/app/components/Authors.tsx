import Image from 'next/image'
import Link from 'next/link'
import { getAuthorById, getGithubAvatarUrl } from '@/lib/authors'
import styles from './Authors.module.css'

interface AuthorsProps {
  authors: string[]
}

export default function Authors({ authors }: AuthorsProps) {
  if (!authors || authors.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.label}>Documented by</div>
      <div className={styles.authorsList}>
        {authors.map(authorId => {
          const author = getAuthorById(authorId)

          if (!author) {
            return null
          }

          const avatarUrl = getGithubAvatarUrl(author.github)
          const linkUrl = author.url || `https://github.com/${author.github}`

          return (
            <Link
              key={authorId}
              href={linkUrl}
              className={styles.authorLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={avatarUrl}
                alt={`${author.name}'s avatar`}
                width={32}
                height={32}
                className={styles.avatar}
                unoptimized
              />
              <span className={styles.authorName}>{author.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
