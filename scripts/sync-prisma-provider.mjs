// Picks the Prisma datasource provider that matches DATABASE_URL.
// - file:...        → sqlite (local dev)
// - postgres://...  → postgresql (Vercel / Neon)
// Runs before `prisma generate` so the right client is built.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, '..', 'prisma', 'schema.prisma');

// Best-effort .env loader so the script works without dotenv installed.
const envPath = resolve(__dirname, '..', '.env');
if (!process.env.DATABASE_URL && existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n]+)"?\s*$/);
    if (m) { process.env.DATABASE_URL = m[1]; break; }
  }
}

const url = (process.env.DATABASE_URL || '').trim();
let provider;
if (url.startsWith('file:')) provider = 'sqlite';
else if (url.startsWith('postgres://') || url.startsWith('postgresql://')) provider = 'postgresql';
else {
  // No URL yet — default to postgresql so `prisma generate` builds a prod-shaped client.
  provider = 'postgresql';
  console.warn('[prisma] DATABASE_URL not set, defaulting provider to postgresql');
}

const schema = readFileSync(schemaPath, 'utf8');
const patched = schema.replace(
  /(datasource\s+db\s*\{[\s\S]*?provider\s*=\s*")[a-z]+(")/,
  `$1${provider}$2`,
);

if (patched === schema) {
  console.log(`[prisma] provider already ${provider}`);
} else {
  writeFileSync(schemaPath, patched);
  console.log(`[prisma] provider set to ${provider}`);
}
