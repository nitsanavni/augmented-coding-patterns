import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPatternBySlug, getPatternSlugs } from "@/lib/markdown";
import { getCategoryConfig, isValidCategory } from "@/app/lib/category-config";
import { PatternCategory } from "@/lib/types";
import RelatedLinks from "@/app/components/RelatedLinks";
import styles from "../../pattern-detail.module.css";

interface PatternPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const categories: PatternCategory[] = ['patterns', 'anti-patterns', 'obstacles'];
  const params: { category: string; slug: string }[] = [];

  for (const category of categories) {
    const slugs = getPatternSlugs(category);
    for (const slug of slugs) {
      params.push({ category, slug });
    }
  }

  return params;
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { category, slug } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const config = getCategoryConfig(category as PatternCategory);
  const pattern = getPatternBySlug(category as PatternCategory, slug);

  if (!pattern) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href={`/${category}`} className={styles.backLink}>
        <span className={styles.backArrow}>←</span>
        Back to {config.labelPlural}
      </Link>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          {pattern.emojiIndicator && (
            <div className={styles.emoji}>{pattern.emojiIndicator}</div>
          )}
          <h1 className={styles.title}>{pattern.title}</h1>
        </div>
        <span className={`${styles.category} ${styles[config.styleClass]}`}>
          {config.label}
        </span>
      </header>

      <article className={styles.content}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {pattern.content}
        </ReactMarkdown>
      </article>

      <RelatedLinks
        relatedPatterns={pattern.relatedPatterns}
        relatedAntiPatterns={pattern.relatedAntiPatterns}
        relatedObstacles={pattern.relatedObstacles}
      />
    </div>
  );
}
