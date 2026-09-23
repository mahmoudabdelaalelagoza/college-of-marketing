import { existsSync, readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (process.env[key]) continue;
    process.env[key] = rest.join('=').trim().replace(/^"|"$/g, '');
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Add it to .env first.');
}

const sql = neon(process.env.DATABASE_URL);
const schema = readFileSync('backend/db/schema.sql', 'utf8').replace(/^\uFEFF/, '');
const statements = splitSql(schema);
let applied = 0;
for (const statement of statements) {
  await sql.query(statement);
  applied += 1;
}
console.log(JSON.stringify({ ok: true, applied }));

function splitSql(input) {
  const statements = [];
  let current = '';
  let dollarQuote = '';
  let singleQuote = false;
  let lineComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1] || '';
    current += char;

    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }

    if (!singleQuote && !dollarQuote && char === '-' && next === '-') {
      lineComment = true;
      continue;
    }

    if (!dollarQuote && char === "'" && input[index - 1] !== "\\") {
      singleQuote = !singleQuote;
      continue;
    }

    if (!singleQuote && char === '$') {
      const rest = input.slice(index);
      const match = rest.match(/^\$[A-Za-z0-9_]*\$/);
      if (match) {
        if (!dollarQuote) dollarQuote = match[0];
        else if (dollarQuote === match[0]) dollarQuote = '';
        current += match[0].slice(1);
        index += match[0].length - 1;
        continue;
      }
    }

    if (!singleQuote && !dollarQuote && char === ';') {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = '';
    }
  }

  const tail = current.trim();
  if (tail) statements.push(tail);
  return statements;
}
