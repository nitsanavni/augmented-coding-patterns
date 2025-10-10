import Link from "next/link";
import styles from "./page.module.css";
import { getPatternSlugs } from "@/lib/markdown";

export default function Home() {
  const patternsCount = getPatternSlugs("patterns").length;
  const antiPatternsCount = getPatternSlugs("anti-patterns").length;
  const obstaclesCount = getPatternSlugs("obstacles").length;

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Augmented Coding Patterns</h1>
        <p>
          A comprehensive collection of patterns, anti-patterns, and obstacles for effective AI-augmented software development.
          Learn how to collaborate successfully with AI coding assistants and avoid common pitfalls.
        </p>
      </section>

      <div className={styles.categories}>
        <Link href="/obstacles" className={`${styles.categoryCard} ${styles.obstacles}`}>
          <div className={styles.categoryIcon}>⛰️</div>
          <h2 className={styles.categoryTitle}>Obstacles</h2>
          <p className={styles.categoryDescription}>
            Understand the inherent limitations and challenges of AI-augmented coding.
            Be aware of these obstacles to set realistic expectations.
          </p>
          <div className={styles.categoryCount}>{obstaclesCount} Obstacles</div>
        </Link>

        <Link href="/anti-patterns" className={`${styles.categoryCard} ${styles.antiPatterns}`}>
          <div className={styles.categoryIcon}>⚠️</div>
          <h2 className={styles.categoryTitle}>Anti-Patterns</h2>
          <p className={styles.categoryDescription}>
            Common mistakes and pitfalls to avoid when working with AI assistants.
            Learn from these anti-patterns to prevent costly errors.
          </p>
          <div className={styles.categoryCount}>{antiPatternsCount} Anti-Patterns</div>
        </Link>

        <Link href="/patterns" className={`${styles.categoryCard} ${styles.patterns}`}>
          <div className={styles.categoryIcon}>🧩</div>
          <h2 className={styles.categoryTitle}>Patterns</h2>
          <p className={styles.categoryDescription}>
            Proven strategies and best practices for working effectively with AI coding assistants.
            These patterns help you maximize productivity and code quality.
          </p>
          <div className={styles.categoryCount}>{patternsCount} Patterns</div>
        </Link>
      </div>
    </div>
  );
}
