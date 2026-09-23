import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['frontend/src', 'frontend/index.html'];
const suspicious = [
  'kentbusinesscollege.example',
  '/vite.svg',
  'This page has not been generated',
  'This is homepage',
];

const textExtensions = new Set(['.ts', '.tsx', '.css', '.html', '.md', '.json']);
const failures = [];

for (const file of listFiles(roots)) {
  const body = readFileSync(file, 'utf8');
  for (const pattern of suspicious) {
    if (body.includes(pattern)) {
      failures.push(`${file}: contains "${pattern}"`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

function listFiles(entries) {
  const files = [];
  for (const entry of entries) {
    if (!exists(entry)) continue;
    const stack = [entry];
    while (stack.length) {
      const current = stack.pop();
      const statEntries = readdirSafe(current);
      if (!statEntries) {
        if (isTextFile(current)) files.push(current);
        continue;
      }
      for (const child of statEntries) {
        stack.push(join(current, child.name));
      }
    }
  }
  return files;
}

function readdirSafe(path) {
  try {
    return readdirSync(path, { withFileTypes: true });
  } catch {
    return null;
  }
}

function exists(path) {
  try {
    readFileSync(path);
    return true;
  } catch {
    try {
      readdirSync(path);
      return true;
    } catch {
      return false;
    }
  }
}

function isTextFile(path) {
  return textExtensions.has(path.slice(path.lastIndexOf('.')));
}

