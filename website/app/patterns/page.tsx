import Link from "next/link";
import { getAllPatterns } from "@/lib/markdown";
import styles from "../pattern-list.module.css";

export default function PatternsPage() {
  const patterns = getAllPatterns("patterns");

  return (
    <div className={`${styles.container} ${styles.patterns}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>🧩</span>
          Patterns
        </h1>
        <p className={styles.description}>
          Proven strategies and best practices for working effectively with AI coding assistants.
          These patterns help you maximize productivity, maintain code quality, and collaborate successfully with AI.
        </p>
        <p className={styles.count}>{patterns.length} patterns available</p>
      </header>

      <div className={styles.patternList}>
        {patterns.map((pattern) => (
          <Link
            key={pattern.slug}
            href={`/patterns/${pattern.slug}`}
            className={styles.patternCard}
          >
            {pattern.emojiIndicator && (
              <div className={styles.patternEmoji}>{pattern.emojiIndicator}</div>
            )}
            <div className={styles.patternContent}>
              <h2 className={styles.patternTitle}>{pattern.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
