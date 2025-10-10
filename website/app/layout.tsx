import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Augmented Coding Patterns",
  description: "A comprehensive collection of patterns, anti-patterns, and obstacles for effective AI-augmented software development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <Link href="/" className={styles.logo}>
                Augmented Coding Patterns
              </Link>
              <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>
                <Link href="/obstacles" className={styles.navLink}>
                  Obstacles
                </Link>
                <Link href="/anti-patterns" className={styles.navLink}>
                  Anti-Patterns
                </Link>
                <Link href="/patterns" className={styles.navLink}>
                  Patterns
                </Link>
              </nav>
            </div>
          </header>

          <main className={styles.main}>
            {children}
          </main>

          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <p>
                Augmented Coding Patterns - A guide to effective AI-augmented software development
              </p>
              <div className={styles.footerLinks}>
                <a
                  href="https://github.com/ivettevaldez/augmented-coding-patterns"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
