# Pattern: Electron + SQLite via Spawned Express Child Process

## Overview

The app runs as a standard Angular SPA loaded into an Electron `BrowserWindow`. All data access goes through a local Express API server that Electron spawns as a child process on startup. The database is `better-sqlite3` — a native Node addon that requires special handling because it must be compiled against the exact Node runtime version bundled inside Electron.

This pattern gives you:
- Full SQLite persistence with no external database
- The same Angular/API code path in both Electron and web
- A clean separation: Angular doesn't know it's in Electron

---

## Key files

| File | Role |
|---|---|
| [`electron/main.js`](../../electron/main.js) | Main process: spawns server, polls health, opens window |
| [`server/src/index.ts`](../../server/src/index.ts) | Express app entry — health route is critical |
| [`server/src/db.ts`](../../server/src/db.ts) | better-sqlite3 connection + first-run init |
| [`package.json`](../../package.json) | `build` config (asar, asarUnpack, extraResources), npm scripts |

---

## How it works

### 1. Startup sequence (`electron/main.js`)

```
app.whenReady()
  → openLogStream()        — write to userData/server.log for debugging
  → startServer()          — spawn server/dist/index.js as child process
  → waitForServer()        — poll /api/health every 500ms, max 60 attempts (30s)
  → serverReady = true
  → createWindow()         — only now open the BrowserWindow
```

The `serverReady` flag is critical. macOS fires the `activate` event (used for re-opening the window when clicking the Dock icon) before `waitForServer` resolves on first launch. Without the flag, `createWindow()` gets called twice — once from `activate` pointing at a server that isn't up yet.

### 2. Spawning the server with Electron's own Node

```js
// electron/main.js:55
serverProcess = spawn(process.execPath, [serverEntry], {
  env: {
    ...parentEnv,
    ELECTRON_RUN_AS_NODE: '1',
    DB_PATH: path.join(userData, 'cooking-rules.db'),
    ...
  },
});
```

`process.execPath` is Electron's own binary. Passing `ELECTRON_RUN_AS_NODE=1` makes it act as a plain Node process. This guarantees the native `better-sqlite3` addon (compiled against Electron's bundled Node) is loaded by the exact same Node ABI version. If you spawned system Node instead, you'd get an ABI mismatch crash.

**Pitfall:** You must strip `ELECTRON_RUN_AS_NODE` from the parent env spread before re-adding it, or the flag bleeds into unintended child processes:

```js
const { ELECTRON_RUN_AS_NODE: _strip, ...parentEnv } = process.env;
```

### 3. Database path handling (`server/src/db.ts`)

```ts
// server/src/db.ts:12-16
const resourcesPath =
  (process.env['RESOURCES_PATH'] as string | undefined) ??
  path.join(__dirname, '../..');

const dbPath = process.env['DB_PATH'] ?? path.join(resourcesPath, 'data/cooking-rules.db');
```

Electron's main process passes both env vars at spawn time. In dev (running `npm run dev` in `server/`), neither is set so the fallback paths resolve to the project root — the same db file either way.

### 4. First-run database initialisation

`db.ts` uses SQLite's `PRAGMA user_version` as a migration flag:

```ts
if ((db.pragma('user_version', { simple: true }) as number) === 0) {
  db.exec(schema);
  db.exec(seed);
  db.pragma('user_version = 1');
}
```

`user_version = 0` means a fresh database — apply schema and seed. Any other value means already initialised — skip. To reset: delete the `.db` file and restart. For future migrations, add a version check for `user_version = 1` → apply migration → set `user_version = 2`, etc.

---

## Packaging pitfalls

### The asar problem

Electron packages app files into `app.asar` — a read-only archive. Spawned child processes **cannot read files from inside an asar**. The server entry point and its entire `node_modules/` must be unpacked.

`package.json` `build` config:

```json
"asarUnpack": [
  "server/package.json",
  "server/dist/**/*",
  "server/node_modules/**/*"
]
```

And the server entry path at runtime:

```js
// electron/main.js:44-46
const appPath = app.isPackaged
  ? app.getAppPath().replace('app.asar', 'app.asar.unpacked')
  : app.getAppPath();
const serverEntry = path.join(appPath, 'server/dist/index.js');
```

### Schema and seed files as extraResources

SQL files can't be inside `server/dist/` (server reads them at runtime, not at build time). They go into `extraResources`, which lands at `process.resourcesPath` in the packaged app:

```json
"extraResources": [
  { "from": "db/sqlite/schema.sql",           "to": "db/sqlite/schema.sql" },
  { "from": "db/seeds/001_reference_data.sql", "to": "db/seeds/001_reference_data.sql" }
]
```

Electron passes `RESOURCES_PATH: process.resourcesPath` to the server child so `db.ts` knows where to find them.

### Native module version pinning

`better-sqlite3` must be rebuilt every time Electron is upgraded:

```json
"postinstall": "electron-builder install-app-deps --module-dir server"
```

This runs automatically after `npm install`. If you upgrade Electron and get an ABI crash on startup, run `npm install` again — it recompiles. Before packaging a release, also run `electron:rebuild` explicitly:

```json
"electron:rebuild": "electron-rebuild -f -w better-sqlite3 --module-dir server"
```

The `dist:mac` and `dist:win` scripts already include this step.

---

## Adapting for a new project

1. Copy `electron/main.js` — change the three app-name strings (`'Cooking Rules'`, `'cooking-rules'`, log prefix)
2. Copy `server/src/db.ts` — it's generic; only the log message mentions the app name
3. Copy `server/src/index.ts` — change the listen log message; keep the health route at `/api/health` exactly as-is
4. Copy the `build` block from `package.json` — update `appId`, `productName`, `copyright`, icon paths
5. Write your own `db/sqlite/schema.sql` and `db/seeds/` — the init pattern stays identical
6. Make sure `server/` has its own `package.json` with `better-sqlite3` as a dependency (not the root `package.json`)

### Database location by context

| Context | Path |
|---|---|
| Dev (`npm run dev` in server/) | `data/cooking-rules.db` at project root |
| Electron dev (`npm run electron:start`) | Same — `DB_PATH` points to `userData` |
| Packaged macOS | `~/Library/Application Support/<ProductName>/cooking-rules.db` |
| Packaged Windows | `%APPDATA%\<ProductName>\cooking-rules.db` |

Override all of these with the `DB_PATH` environment variable.
