import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPatternBySlug, getPatternSlugs } from "@/lib/markdown";
import styles from "../../pattern-detail.module.css";

interface PatternPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getPatternSlugs("patterns");
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { slug } = await params;
  const pattern = getPatternBySlug("patterns", slug);

  return (
    <div className={styles.container}>
      <Link href="/patterns" className={styles.backLink}>
        <span className={styles.backArrow}>←</span>
        Back to Patterns
      </Link>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          {pattern.emojiIndicator && (
            <div className={styles.emoji}>{pattern.emojiIndicator}</div>
          )}
          <h1 className={styles.title}>{pattern.title}</h1>
        </div>
        <span className={`${styles.category} ${styles.patterns}`}>
          Pattern
        </span>
      </header>

      <article className={styles.content}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {pattern.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
