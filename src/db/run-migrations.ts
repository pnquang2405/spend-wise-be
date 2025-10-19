import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function runMigrations() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT now()
    );
  `);

  const migrationsDir = join(__dirname, 'migrations');
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`🚀 Checking ${files.length} migration files...`);

  for (const file of files) {
    const check = await pool.query(
      `SELECT 1 FROM _migrations WHERE filename = $1`,
      [file],
    );
    if (check.rowCount > 0) {
      console.log(`✅ Skipping already executed: ${file}`);
      continue;
    }

    console.log(`⚙️  Executing ${file}...`);
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    await pool.query(sql);
    await pool.query(`INSERT INTO _migrations (filename) VALUES ($1)`, [file]);
  }

  console.log('✅ All pending migrations executed successfully.');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
