import PatternMap from "./PatternMap";
import { getAllPatterns } from "@/lib/markdown";
import mapIndex from "@/public/maps/map-index.json";

export default function TalkPage() {
  const allPatterns = [
    ...getAllPatterns("patterns"),
    ...getAllPatterns("anti-patterns"),
    ...getAllPatterns("obstacles")
  ];

  const patternDataByNumber: Record<string, any> = {};
  const patternDataByLabel: Record<string, any> = {};

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
