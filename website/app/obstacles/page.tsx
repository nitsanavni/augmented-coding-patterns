import Link from "next/link";
import { getAllPatterns } from "@/lib/markdown";
import styles from "../pattern-list.module.css";

export default function ObstaclesPage() {
  const obstacles = getAllPatterns("obstacles");

  return (
    <div className={`${styles.container} ${styles.obstacles}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>⛰️</span>
          Obstacles
        </h1>
        <p className={styles.description}>
          Understand the inherent limitations and challenges of AI-augmented coding.
          Be aware of these obstacles to set realistic expectations and work around constraints.
        </p>
        <p className={styles.count}>{obstacles.length} obstacles identified</p>
      </header>

      <div className={styles.patternList}>
        {obstacles.map((pattern) => (
          <Link
            key={pattern.slug}
            href={`/obstacles/${pattern.slug}`}
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
