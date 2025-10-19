"use client";

import { useEffect, useState } from "react";
import styles from "./PatternMap.module.css";

export default function PatternMap() {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch("/maps/semantic_map.svg")
      .then(res => res.text())
      .then(svg => setSvgContent(svg))
      .catch(err => console.error("Failed to load map:", err));
  }, []);

  if (!svgContent) {
    return <div>Loading map...</div>;
  }

  return (
    <div
      className={styles.mapContainer}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
