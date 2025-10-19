import PatternMap from "./PatternMap";
import { getAllPatterns } from "@/lib/markdown";
import { PatternContent } from "@/lib/types";
import mapIndex from "@/public/maps/map-index.json";

type PatternData = PatternContent & {
  name: string;
  category: string;
};

export default function TalkPage() {
  const allPatterns = [
    ...getAllPatterns("patterns"),
    ...getAllPatterns("anti-patterns"),
    ...getAllPatterns("obstacles")
  ];

  const patternDataByNumber: Record<string, PatternData> = {};
  const patternDataByLabel: Record<string, PatternContent> = {};

  Object.entries(mapIndex).forEach(([number, info]) => {
    const pattern = allPatterns.find(p => p.slug === info.slug);
    if (pattern) {
      patternDataByNumber[number] = {
        ...info,
        ...pattern
      };
    }
  });

  allPatterns.forEach(pattern => {
    patternDataByLabel[pattern.title] = pattern;
  });

  return (
    <div>
      <PatternMap
        patternDataByNumber={patternDataByNumber}
        patternDataByLabel={patternDataByLabel}
      />
    </div>
  );
}
