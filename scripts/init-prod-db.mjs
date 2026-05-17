#!/usr/bin/env node
// One-shot: pull Vercel env, switch schema to the right provider,
// push the schema to the remote DB, then seed the menu + admin user.
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

function sh(cmd, env = {}) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });
}

console.log('🔑 Pulling production env vars from Vercel...');
sh('vercel env pull .env.production.local --environment=production --yes');

if (!existsSync('.env.production.local')) {
  console.error('❌ .env.production.local was not created. Are you linked to the right project?');
  process.exit(1);
}

const envFile = readFileSync('.env.production.local', 'utf8');
const m = envFile.match(/^DATABASE_URL\s*=\s*"?([^"\n]+)"?\s*$/m);
if (!m) {
  console.error('❌ DATABASE_URL not found in production env.');
  console.error('   → Add a Postgres database in the Vercel dashboard first.');
  process.exit(1);
}
const databaseUrl = m[1];
const env = { DATABASE_URL: databaseUrl };

console.log(`\n📡 Target database: ${databaseUrl.replace(/:[^:@]+@/, ':***@')}`);

sh('node scripts/sync-prisma-provider.mjs', env);
sh('npx prisma generate', env);
sh('npx prisma db push --accept-data-loss', env);
sh('node prisma/seed.mjs', env);

console.log('\n✅ Production database is ready.');
console.log('   Now run `vercel --prod` (or trigger a redeploy) — admin + menu will work.');
