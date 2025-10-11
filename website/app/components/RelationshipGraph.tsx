'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { GraphData, GraphNode, GraphLink } from '@/lib/graph-data';
import styles from './RelationshipGraph.module.css';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

const CATEGORY_COLORS = {
  patterns: '#10b981',
  'anti-patterns': '#ef4444',
  obstacles: '#f59e0b',
};

const RELATIONSHIP_COLORS = {
  solves: '#8b5cf6',
  similar: '#3b82f6',
  'enabled-by': '#06b6d4',
  uses: '#6366f1',
  causes: '#dc2626',
  alternative: '#84cc16',
  related: '#6b7280',
};

function getSlugFromFullSlug(fullSlug: string): string {
  const parts = fullSlug.split('/');
  return parts[parts.length - 1];
}

interface RelationshipGraphProps {
  graphData: GraphData;
}

interface ForceGraphNode extends GraphNode {
  x?: number;
  y?: number;
}

export default function RelationshipGraph({ graphData }: RelationshipGraphProps) {
  const router = useRouter();

  const handleNodeClick = useCallback((node: Record<string, unknown>) => {
    const typedNode = node as unknown as GraphNode;
    const slug = getSlugFromFullSlug(typedNode.id);
    router.push(`/${typedNode.category}/${slug}/`);
  }, [router]);

  const getNodeSize = (node: Record<string, unknown>) => {
    const typedNode = node as unknown as GraphNode;
    const baseSize = 4;
    const scaleFactor = 0.5;
    return baseSize + (typedNode.connections * scaleFactor);
  };

  const getNodeColor = (node: Record<string, unknown>) => {
    const typedNode = node as unknown as GraphNode;
    return CATEGORY_COLORS[typedNode.category];
  };

  const getLinkColor = (link: Record<string, unknown>) => {
    const typedLink = link as unknown as GraphLink;
    return RELATIONSHIP_COLORS[typedLink.type as keyof typeof RELATIONSHIP_COLORS] || '#999';
  };

  if (graphData.nodes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No relationships found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.graphWrapper}>
        <ForceGraph2D
          graphData={graphData}
          nodeId="id"
          nodeLabel="name"
          nodeVal={getNodeSize}
          nodeColor={getNodeColor}
          nodeCanvasObject={(node: Record<string, unknown>, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const typedNode = node as unknown as ForceGraphNode;
            if (typeof typedNode.x === 'undefined' || typeof typedNode.y === 'undefined') return;

            const label = typedNode.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

            const nodeSize = getNodeSize(node);

            ctx.fillStyle = getNodeColor(node);
            ctx.beginPath();
            ctx.arc(typedNode.x, typedNode.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fill();

            if (globalScale > 1) {
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fillRect(
                typedNode.x - bckgDimensions[0] / 2,
                typedNode.y + nodeSize + 2,
                bckgDimensions[0],
                bckgDimensions[1]
              );

              ctx.fillStyle = '#333';
              ctx.fillText(label, typedNode.x, typedNode.y + nodeSize + 2 + fontSize / 2);
            }
          }}
          linkColor={getLinkColor}
          linkWidth={1}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
          onNodeClick={handleNodeClick}
          cooldownTime={3000}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      </div>
      <div className={styles.legend}>
        <div className={styles.legendSection}>
          <h4>Categories</h4>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: CATEGORY_COLORS.patterns }}></span>
              <span>Patterns</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: CATEGORY_COLORS['anti-patterns'] }}></span>
              <span>Anti-Patterns</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: CATEGORY_COLORS.obstacles }}></span>
              <span>Obstacles</span>
            </div>
          </div>
        </div>
        <div className={styles.legendSection}>
          <h4>Relationships</h4>
          <div className={styles.legendItems}>
            {Object.entries(RELATIONSHIP_COLORS).map(([type, color]) => (
              <div key={type} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: color }}></span>
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
