import styles from "./page.module.css";

export default function PatternCatalogPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pattern Catalog</h1>
        <p className={styles.description}>
          Explore every pattern, anti-pattern, and obstacle in one organized place as we shape the next
          evolution of the knowledge base.
        </p>
      </header>
    </div>
  );
}
