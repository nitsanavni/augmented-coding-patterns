#!/usr/bin/env node

/**
 * Fix frontmatter formatting where closing --- is on the same line as the last field
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

let filesFixed = 0;

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  // Check if frontmatter has the issue: ]---
  if (!content.match(/\]---\n/)) {
    return;
  }

  // Fix by adding newline before ---
  const fixed = content.replace(/(\])---\n/, '$1\n---\n');

  fs.writeFileSync(filePath, fixed, 'utf8');
  filesFixed++;
  console.log(`Fixed: ${relativePath}`);
});

console.log(`\nFixed ${filesFixed} files`);
