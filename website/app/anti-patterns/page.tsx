import Link from "next/link";
import { getAllPatterns } from "@/lib/markdown";
import styles from "../pattern-list.module.css";

export default function AntiPatternsPage() {
  const antiPatterns = getAllPatterns("anti-patterns");

  return (
    <div className={`${styles.container} ${styles.antiPatterns}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>⚠️</span>
          Anti-Patterns
        </h1>
        <p className={styles.description}>
          Common mistakes and pitfalls to avoid when working with AI coding assistants.
          Learn from these anti-patterns to prevent costly errors and maintain code quality.
        </p>
        <p className={styles.count}>{antiPatterns.length} anti-patterns documented</p>
      </header>

      <div className={styles.patternList}>
        {antiPatterns.map((pattern) => (
          <Link
            key={pattern.slug}
            href={`/anti-patterns/${pattern.slug}`}
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
