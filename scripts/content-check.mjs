import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['frontend/src', 'frontend/index.html'];

const suspicious = [
  'kentbusinesscollege.example',
  '/vite.svg',
  'This page has not been generated',
  'This is homepage',
  // Third-party placeholder services previously supplied site imagery. Both
  // now fail at runtime, so any reintroduction breaks pages silently.
  'readdy.ai/api/search-image',
  'helloreaddy.io',
];

/**
 * American spellings that must not reach UK-facing copy. Matched as whole
 * words only, and against copy with URLs and attribute values removed so that
 * identifiers such as a database column name are not reported.
 */
const americanisms = [
  'enroll', 'enrollment', 'enrollments',
  'program', 'programs',
  'organization', 'organizations', 'organize', 'organized',
  'center', 'centers', 'centered',
  'behavior', 'behaviors',
  'personalized', 'personalization',
  'customize', 'customized',
  'specialize', 'specialized',
  'utilize',
  'recognize', 'recognized',
  'analyze', 'analyzed',
  'catalog', 'defense', 'favor', 'honor', 'traveled',
  'color', 'colors', 'colored', 'colorful',
];

const textExtensions = new Set(['.ts', '.tsx', '.css', '.html', '.md', '.json']);
const failures = [];

for (const file of listFiles(roots)) {
  const body = readFileSync(file, 'utf8');

  for (const pattern of suspicious) {
    if (body.includes(pattern)) {
      failures.push(file + ': contains "' + pattern + '"');
    }
  }

  const copy = stripNonCopy(body);
  for (const word of americanisms) {
    const match = new RegExp('\\b' + word + '\\b', 'i').exec(copy);
    if (match) {
      failures.push(file + ': American English "' + match[0] + '" (use the British spelling)');
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('content-check: ' + 'ok');

/** Removes URLs and attribute values so only human-facing copy is inspected. */
function stripNonCopy(body) {
  return body
    .replace(/https?:\/\/[^\s'"<>)]+/g, ' ')
    .replace(/(?:class|className|id|htmlFor|name|href|src|type|role|placeholder|title)="[^"]*"/g, ' ')
    .replace(/(?:class|className|id|htmlFor|name|href|src|type|role|placeholder|title)='[^']*'/g, ' ')
    .replace(/`(?:[^`\\]|\\.)*`/g, ' ')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ');
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
