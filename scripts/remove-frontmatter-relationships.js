#!/usr/bin/env node

/**
 * Remove related_patterns, related_anti_patterns, and related_obstacles from markdown frontmatter.
 * These relationships are now centralized in documents/relationships.mmd
 */

const fs = require('fs');
const path = require('path');

// Recursively find all markdown files
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.endsWith('.mmd')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const documentsDir = path.join(__dirname, '..', 'documents');
const files = findMarkdownFiles(documentsDir);

let filesModified = 0;
let filesSkipped = 0;

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  // Check if file has frontmatter with related fields
  if (!content.startsWith('---')) {
    filesSkipped++;
    return;
  }

  // Split into frontmatter and content
  const parts = content.split('---');
  if (parts.length < 3) {
    filesSkipped++;
    return;
  }

  const frontmatter = parts[1];
  const mainContent = parts.slice(2).join('---');

  // Check if any related fields exist
  if (!frontmatter.includes('related_patterns') &&
      !frontmatter.includes('related_anti_patterns') &&
      !frontmatter.includes('related_obstacles')) {
    filesSkipped++;
    return;
  }

  // Parse and rebuild frontmatter without related fields
  const lines = frontmatter.split('\n');
  const newLines = [];
  let skipMode = false;

  for (const line of lines) {
    // Check if this is a related field start
    if (line.match(/^(related_patterns|related_anti_patterns|related_obstacles):/)) {
      skipMode = true;
      continue;
    }

    // Check if we're exiting skip mode (non-indented line or new field)
    if (skipMode && line.match(/^[a-zA-Z_]/)) {
      skipMode = false;
    }

    // Include line if not in skip mode
    if (!skipMode) {
      newLines.push(line);
    }
  }

  // Rebuild the file - ensure proper spacing
  const newFrontmatter = newLines.join('\n');
  // Add newline before closing --- if not already present
  const needsNewline = !newFrontmatter.endsWith('\n');
  const newContent = `---${newFrontmatter}${needsNewline ? '\n' : ''}---${mainContent}`;

  fs.writeFileSync(filePath, newContent, 'utf8');
  filesModified++;
  console.log(`Modified: ${relativePath}`);
});

console.log(`\nSummary:`);
console.log(`  Files modified: ${filesModified}`);
console.log(`  Files skipped: ${filesSkipped}`);
console.log(`  Total files: ${files.length}`);
