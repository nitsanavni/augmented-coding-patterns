import { getAllRelationships } from './relationships';
import { getPatternBySlug } from './markdown';
import { PatternCategory } from './types';

export interface GraphNode {
  id: string;
  name: string;
  category: PatternCategory;
  connections: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

function getCategoryFromFullSlug(fullSlug: string): PatternCategory {
  if (fullSlug.startsWith('patterns/')) return 'patterns';
  if (fullSlug.startsWith('anti-patterns/')) return 'anti-patterns';
  if (fullSlug.startsWith('obstacles/')) return 'obstacles';
  return 'patterns';
}

function getSlugFromFullSlug(fullSlug: string): string {
  const parts = fullSlug.split('/');
  return parts[parts.length - 1];
}

export function getGraphData(): GraphData {
  const relationshipGraph = getAllRelationships();
  const nodeMap = new Map<string, GraphNode>();

  relationshipGraph.relationships.forEach((rel) => {
    [rel.from, rel.to].forEach((fullSlug) => {
      if (!nodeMap.has(fullSlug)) {
        const category = getCategoryFromFullSlug(fullSlug);
        const slug = getSlugFromFullSlug(fullSlug);

        let name = slug;
        try {
          const content = getPatternBySlug(category, slug);
          if (content) {
            name = content.title;
          }
        } catch (error) {
          console.warn(`Could not load title for ${fullSlug}:`, error);
        }

        nodeMap.set(fullSlug, {
          id: fullSlug,
          name,
          category,
          connections: 0,
        });
      }
    });

    const fromNode = nodeMap.get(rel.from);
    if (fromNode) {
      fromNode.connections += 1;
    }
  });

  const dedupedLinks = new Map<string, GraphLink>();
  relationshipGraph.relationships.forEach((rel) => {
    const linkKey = rel.bidirectional
      ? [rel.from, rel.to].sort().join('|')
      : `${rel.from}|${rel.to}`;

    if (!dedupedLinks.has(linkKey)) {
      dedupedLinks.set(linkKey, {
        source: rel.from,
        target: rel.to,
        type: rel.type,
      });
    }
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links: Array.from(dedupedLinks.values()),
  };
}
