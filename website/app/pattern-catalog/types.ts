import { PatternCategory } from "@/lib/types";

export interface CatalogPreviewItem {
  slug: string;
  title: string;
  emojiIndicator?: string;
  authorIds: string[];
  authorNames: string[];
  authorGithubs: string[];
  summary?: string;
  content: string;
}

export interface CatalogGroupData {
  category: PatternCategory;
  label: string;
  icon: string;
  styleClass: string;
  items: CatalogPreviewItem[];
}
