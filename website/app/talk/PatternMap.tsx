"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./PatternMap.module.css";
import PatternModal from "./PatternModal";

interface PatternMapProps {
  patternData: Record<string, any>;
}

export default function PatternMap({ patternData }: PatternMapProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/maps/semantic_map.svg")
      .then(res => res.text())
      .then(svg => setSvgContent(svg))
      .catch(err => console.error("Failed to load map:", err));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!svgContent || !container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const node = target.closest('.interactive-node');
      if (node) {
        const number = node.getAttribute('data-number');
        if (number) {
          setSelectedPattern(number);
        }
      }
    };

    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [svgContent]);

  const closeModal = useCallback(() => {
    setSelectedPattern(null);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedPattern) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedPattern, closeModal]);

  if (!svgContent) {
    return <div>Loading map...</div>;
  }

  return (
    <>
      <div
        ref={containerRef}
        className={styles.mapContainer}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {selectedPattern && patternData[selectedPattern] && (
        <PatternModal pattern={patternData[selectedPattern]} onClose={closeModal} />
      )}
    </>
  );
}
