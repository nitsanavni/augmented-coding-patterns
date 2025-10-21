import { PatternCategory } from "@/lib/types";

interface CatalogGroupDefinition {
  category: PatternCategory;
  label: string;
  headingPattern: (count: number) => RegExp;
}

export const PATTERN_CATALOG_GROUPS: CatalogGroupDefinition[] = [
  {
    category: "obstacles",
    label: "Obstacles",
    headingPattern: (count: number) => new RegExp(`^Obstacles \\(${count}\\)$`, "i"),
  },
  {
    category: "anti-patterns",
    label: "Anti-patterns",
    headingPattern: (count: number) => new RegExp(`^Anti-patterns \\(${count}\\)$`, "i"),
  },
  {
    category: "patterns",
    label: "Patterns",
    headingPattern: (count: number) => new RegExp(`^Patterns \\(${count}\\)$`, "i"),
  },
];
