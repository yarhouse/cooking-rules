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

// user_version === 0 means this is a fresh database — run schema + seed.
if ((db.pragma('user_version', { simple: true }) as number) === 0) {
  const schema = fs.readFileSync(path.join(resourcesPath, 'db/sqlite/schema.sql'), 'utf8');
  const seed   = fs.readFileSync(path.join(resourcesPath, 'db/seeds/001_reference_data.sql'), 'utf8');
  db.exec(schema);
  db.exec(seed);
  db.pragma('user_version = 1');
  console.log('[db] SQLite database initialised at', dbPath);
} else {
  console.log('[db] Connected to', dbPath);
}
