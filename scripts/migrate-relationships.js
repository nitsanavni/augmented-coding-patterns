#!/usr/bin/env node

/**
 * HISTORICAL REFERENCE ONLY
 *
 * This script was used for the initial migration of relationships from markdown frontmatter
 * to the centralized relationships.mmd file. The migration is now complete.
 *
 * All relationships are now maintained in documents/relationships.mmd with semantic types.
 * Markdown files no longer contain related_patterns, related_anti_patterns, or related_obstacles
 * in their frontmatter.
 *
 * This file is kept for historical reference and documentation purposes.
 */

const fs = require('fs');
const path = require('path');
const matter = require('../website/node_modules/gray-matter');

const DOCUMENTS_DIR = path.join(__dirname, '../documents');
const OUTPUT_FILE = path.join(DOCUMENTS_DIR, 'relationships.mmd');
const CATEGORIES = ['patterns', 'anti-patterns', 'obstacles'];

function getAllMarkdownFiles() {
  const files = [];

  for (const category of CATEGORIES) {
    const categoryDir = path.join(DOCUMENTS_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      console.warn(`Warning: Directory not found: ${categoryDir}`);
      continue;
    }

    const markdownFiles = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        category,
        slug: file.replace('.md', ''),
        path: path.join(categoryDir, file)
      }));

    files.push(...markdownFiles);
  }

  return files;
}

function extractRelationships(files) {
  const relationships = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const { data: frontmatter } = matter(content);

      const sourceNode = `${file.category}/${file.slug}`;

      // Extract related patterns
      if (frontmatter.related_patterns && Array.isArray(frontmatter.related_patterns)) {
        for (const targetSlug of frontmatter.related_patterns) {
          relationships.push({
            source: sourceNode,
            target: `patterns/${targetSlug}`,
            type: 'related'
          });
        }
      }

      // Extract related anti-patterns
      if (frontmatter.related_anti_patterns && Array.isArray(frontmatter.related_anti_patterns)) {
        for (const targetSlug of frontmatter.related_anti_patterns) {
          relationships.push({
            source: sourceNode,
            target: `anti-patterns/${targetSlug}`,
            type: 'related'
          });
        }
      }

      // Extract related obstacles
      if (frontmatter.related_obstacles && Array.isArray(frontmatter.related_obstacles)) {
        for (const targetSlug of frontmatter.related_obstacles) {
          relationships.push({
            source: sourceNode,
            target: `obstacles/${targetSlug}`,
            type: 'related'
          });
        }
      }
    } catch (error) {
      console.error(`Error processing ${file.path}:`, error.message);
    }
  }

  return relationships;
}

function generateMermaidSyntax(relationships) {
  const lines = [
    'graph LR',
    '  %% Relationships extracted from pattern frontmatter',
    ''
  ];

  // Group relationships by source category
  const groupedByCategory = {
    patterns: [],
    'anti-patterns': [],
    obstacles: []
  };

  for (const rel of relationships) {
    const [category] = rel.source.split('/');
    if (groupedByCategory[category]) {
      groupedByCategory[category].push(rel);
    }
  }

  // Add relationships grouped by category
  for (const category of CATEGORIES) {
    const rels = groupedByCategory[category];
    if (rels.length > 0) {
      lines.push(`  %% From ${category}`);
      for (const rel of rels) {
        lines.push(`  ${rel.source} -->|${rel.type}| ${rel.target}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function main() {
  console.log('Starting relationship migration...');
  console.log(`Reading markdown files from: ${DOCUMENTS_DIR}`);

  const files = getAllMarkdownFiles();
  console.log(`Found ${files.length} markdown files`);

  const relationships = extractRelationships(files);
  console.log(`Extracted ${relationships.length} relationships`);

  const mermaidContent = generateMermaidSyntax(relationships);

  fs.writeFileSync(OUTPUT_FILE, mermaidContent, 'utf8');
  console.log(`\nRelationships written to: ${OUTPUT_FILE}`);
  console.log('\nBreakdown by source category:');

  const byCategory = {
    patterns: relationships.filter(r => r.source.startsWith('patterns/')).length,
    'anti-patterns': relationships.filter(r => r.source.startsWith('anti-patterns/')).length,
    obstacles: relationships.filter(r => r.source.startsWith('obstacles/')).length
  };

  console.log(`  patterns: ${byCategory.patterns}`);
  console.log(`  anti-patterns: ${byCategory['anti-patterns']}`);
  console.log(`  obstacles: ${byCategory.obstacles}`);
  console.log('\nMigration complete!');
}

main();
