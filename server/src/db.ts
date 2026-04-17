import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In a packaged Electron app, extraResources land in process.resourcesPath.
// In dev/server-only mode, schema and seeds live two directories up from server/src/.
const resourcesPath: string =
  (process.env['RESOURCES_PATH'] as string | undefined) ??
  path.join(__dirname, '../..');

// DB_PATH env var lets Electron pass in the userData path at runtime.
// Falls back to <project>/data/cooking-rules.db for local dev.
const dbPath = process.env['DB_PATH'] ?? path.join(resourcesPath, 'data/cooking-rules.db');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const userVersion = db.pragma('user_version', { simple: true }) as number;

// user_version === 0 means this is a fresh database — run schema + all seeds.
if (userVersion === 0) {
  const schema = fs.readFileSync(path.join(resourcesPath, 'db/sqlite/schema.sql'), 'utf8');
  const seed   = fs.readFileSync(path.join(resourcesPath, 'db/seeds/001_reference_data.sql'), 'utf8');
  const seed2  = fs.readFileSync(path.join(resourcesPath, 'db/seeds/002_harvest_data.sql'), 'utf8');
  const seed3  = fs.readFileSync(path.join(resourcesPath, 'db/seeds/003_magic_items_full.sql'), 'utf8');
  db.exec(schema);
  db.exec(seed);
  db.exec(seed2);
  db.exec(seed3);
  db.pragma('user_version = 3');
  console.log('[db] SQLite database initialised at', dbPath);
} else {
  if (userVersion < 2) {
    // Migration: add harvesting & crafting tables (v1 → v2)
    const migration = fs.readFileSync(path.join(resourcesPath, 'db/migrations/002_harvesting_crafting.sql'), 'utf8');
    const seed2     = fs.readFileSync(path.join(resourcesPath, 'db/seeds/002_harvest_data.sql'), 'utf8');
    db.exec(migration);
    db.exec(seed2);
    db.pragma('user_version = 2');
    console.log('[db] Migration v2 applied — harvesting & crafting tables added');
  }
  if (userVersion < 3) {
    // Migration: seed full magic item catalogue (v2 → v3, no DDL changes)
    const seed3 = fs.readFileSync(path.join(resourcesPath, 'db/seeds/003_magic_items_full.sql'), 'utf8');
    db.exec(seed3);
    db.pragma('user_version = 3');
    console.log('[db] Migration v3 applied — full magic item catalogue seeded');
  }
  console.log('[db] Connected to', dbPath);
}
