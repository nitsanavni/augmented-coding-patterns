import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPatternBySlug, getPatternSlugs } from "@/lib/markdown";
import styles from "../../pattern-detail.module.css";

interface AntiPatternPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getPatternSlugs("anti-patterns");
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function AntiPatternPage({ params }: AntiPatternPageProps) {
  const { slug } = await params;
  const pattern = getPatternBySlug("anti-patterns", slug);

  return (
    <div className={styles.container}>
      <Link href="/anti-patterns" className={styles.backLink}>
        <span className={styles.backArrow}>←</span>
        Back to Anti-Patterns
      </Link>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          {pattern.emojiIndicator && (
            <div className={styles.emoji}>{pattern.emojiIndicator}</div>
          )}
          <h1 className={styles.title}>{pattern.title}</h1>
        </div>
        <span className={`${styles.category} ${styles.antiPatterns}`}>
          Anti-Pattern
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
