# Chef Aratus Cookbook

A monster cooking rules reference and campaign tracker. Look up recipes, browse creature components and their effects, build meals from your inventory, and track your party's ingredient stock across sessions.

Built with Angular 21, Node/Express, SQLite, and Electron.

---

## Data

This repo ships with **empty data stubs** — the reference content is not included. To use the app with your own data:

1. Populate `db/seeds/001_reference_data.sql` with your creature types, component types, monsters, recipes, and ingredients (see the file for the expected schema).
2. Populate `src/app/data/*.data.ts` if you want to use the static web build (no API).
3. Run `git update-index --skip-worktree` on those files so git ignores your local changes (see `.gitignore` for the exact command).

See [db/sqlite/schema.sql](db/sqlite/schema.sql) for the full database schema and `src/app/models/` for the TypeScript interfaces each data file must conform to.

---

## Features

- **Search** — federated search across recipes, monsters, and ingredients
- **Browse** — filter by creature type, component type, or recipe tier
- **Recipe Builder** — select the components you have and see which recipes you can craft
- **Cook Session** — guided step-by-step cook session: pick a recipe, roll the cook check, assign ingredients, roll for quirks, and spend from inventory
- **Harvest Session** — guided harvest session stepper: select a monster, roll harvest DCs per component, and record what was collected
- **Inventory** — track ingredient quantities, harvest component stock, and loose essence by rarity
- **Crafting** — browse magic item recipes by category and rarity; craft directly from your inventory with a confirm dialog
- **Rules Reference** — full component effect tables with rarity scaling, and rules quirks
- **Monster Editor** — create and edit custom monsters, assign harvestable components, and manage their named ingredients

---

## Build targets

| Target | Description |
| --- | --- |
| **Desktop (Electron)** | Native macOS / Windows app with a local SQLite database. Data persists across restarts. |
| **Static web (PWA)** | No-backend build for hosting on a website. Installable as a Progressive Web App. Inventory lives in `localStorage` — nothing is server-persisted. Must be served from the `/cooking-rules/` path. |
| **Dev server** | Angular dev server + Express API server running locally against a local SQLite file. |

---

## Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| Node.js | 22+ | [nodejs.org](https://nodejs.org) |
| npm | 10+ | Bundled with Node |
| Angular CLI | 21 | Installed via `npm install` |

No database setup required — SQLite is embedded and the database file is created automatically on first run.

---

## Local development setup

### 1. Install dependencies

```bash
# From the project root — installs Angular deps and rebuilds native modules for Electron
npm install

# API server deps
cd server && npm install
```

> `postinstall` automatically runs `electron-builder install-app-deps` to compile
> `better-sqlite3` for the local Electron version. Re-run `npm install` any time you
> upgrade Electron.

### 2. Configure the API server

```bash
cd server
cp .env.example .env
# .env defaults work out of the box for local dev — no edits needed
```

### 3. Run the dev environment

Two terminals:

```bash
# Terminal 1 — API server (port 3000, restarts on file change)
cd server && npm run dev

# Terminal 2 — Angular dev server (port 4200)
ng serve
```

Open `http://localhost:4200`.

The SQLite database is created automatically at `data/cooking-rules.db` on first API server start.

---

## Common workflows

### Deploy the static web build to your personal site

```bash
npm run build:static
# Output: dist/cooking-rules/browser/
# Host at: https://yoursite.com/cooking-rules/
```

The output is a self-contained PWA — no server needed. Upload the contents of `dist/cooking-rules/browser/` to your host. It must be served from the `/cooking-rules/` path (matching `baseHref`). On first load in Chrome/Safari, users will be offered an "Add to Home Screen" / install prompt.

### Package a macOS distribution

```bash
npm run dist:mac
# Output: release/*.dmg (x64 and arm64)
```

This builds Angular + the Express server, recompiles `better-sqlite3` for Electron's Node ABI, then packages two DMGs. After it completes, the native module in `server/node_modules/` is compiled for Electron — **you must restore it before using the dev server again** (see step below).

### Return to the development server (after a dist build)

```bash
# Restore better-sqlite3 for your system Node (required after any dist:mac or dist:win run)
cd server && npm rebuild better-sqlite3

# Then start both processes as normal:
# Terminal 1
cd server && npm run dev

# Terminal 2 (from project root)
ng serve
```

Open `http://localhost:4200`. If you skip the rebuild step, the API server will crash with a `NODE_MODULE_VERSION` mismatch error.

---

## Scripts

All scripts are run from the **project root** unless noted.

### Development

| Script | What it does |
| --- | --- |
| `npm start` | Angular dev server at `http://localhost:4200` |
| `npm run start:static` | Angular dev server using the static build config (no API) |
| `npm run watch` | Angular build in watch mode (development config) |
| `npm test` | Run unit tests via Vitest |
| `ng lint` | ESLint across `src/**/*.ts` and `src/**/*.html` |
| `npm run docs` | Generate TypeDoc for the Angular app and the API server |

### Building

| Script | What it does |
| --- | --- |
| `npm run build` | Production Angular build (outputs to `dist/`) |
| `npm run build:static` | Static PWA build — data from local TS files, no API, service worker included |
| `npm run build:electron` | Electron Angular build — points API at `localhost:3000` |
| `npm run build:server` | Compiles the Express server TypeScript to `server/dist/` |

### Electron

| Script | What it does |
| --- | --- |
| `npm run electron:start` | Build Angular + server, then launch Electron (dev, no packaging) |
| `npm run electron:rebuild` | Recompile `better-sqlite3` for the current Electron Node version |
| `npm run dist:mac` | Full build + package → `release/*.dmg` (x64 and arm64) |
| `npm run dist:win` | Full build + package → `release/*.exe` (x64 NSIS installer) |

### Server (run from `server/`)

| Script | What it does |
| --- | --- |
| `npm run dev` | Start API with `tsx watch` — restarts on file change |
| `npm run build` | Compile TypeScript to `server/dist/` |
| `npm start` | Run the compiled server (`server/dist/index.js`) |

---

## Project structure

```text
aratus-cookbook/
├── electron/
│   └── main.js                 # Electron main process — spawns server, manages lifecycle
├── src/                        # Angular app
│   ├── app/
│   │   ├── components/
│   │   │   ├── cooking/        # Recipe builder page
│   │   │   ├── cook-session/   # Guided cook session stepper
│   │   │   ├── harvest-session/ # Guided harvest session stepper
│   │   │   ├── monsters/       # Monster edit page
│   │   │   │   └── monster-edit-page/
│   │   │   └── shared/         # Cards, detail dialogs, create dialogs, rarity-label, skill-badge
│   │   ├── data/               # Static TypeScript data (used by static build; not committed)
│   │   ├── models/             # TypeScript interfaces matching API shapes + session/payload models
│   │   └── services/
│   │       ├── cooking-data.service.ts   # Central read-only data layer (signals + HTTP caching)
│   │       ├── cooking-create.service.ts # All write operations (create/update/delete via API)
│   │       ├── inventory.service.ts      # Per-session inventory state, localStorage persistence
│   │       └── api.service.ts            # Thin HTTP wrapper
│   └── environments/
│       ├── environment.ts              # Dev — API at localhost:3000
│       ├── environment.prod.ts         # Prod web — API at /api
│       ├── environment.electron.ts     # Electron — API at localhost:3000, staticData: false
│       └── environment.static.ts       # Static web — no API, staticData: true
├── server/                     # Node/Express API
│   ├── .env                    # Local config (gitignored)
│   ├── .env.example            # Config template
│   └── src/
│       ├── index.ts            # Express app, CORS, security middleware, routes
│       ├── db.ts               # better-sqlite3 connection + first-run initialisation
│       └── routes/             # One file per endpoint
├── db/
│   ├── sqlite/
│   │   └── schema.sql          # SQLite schema (CHECK constraints, INTEGER booleans)
│   └── seeds/
│       └── 001_reference_data.sql   # Local seed data (not committed — see Data section above)
├── build/
│   └── icon.png                # Master app icon (512×512) — source for all derived icons
├── public/
│   ├── favicon.ico / favicon.png   # Web favicons (generated from build/icon.png)
│   └── icons/
│       ├── icon-192x192.png    # PWA icon (generated from build/icon.png)
│       └── icon-512x512.png    # PWA icon (generated from build/icon.png)
├── src/
│   └── manifest.webmanifest    # Web app manifest (PWA install metadata)
├── ngsw-config.json            # Angular service worker cache config (static build only)
└── release/                    # Packaged installers output (gitignored)
```

---

## API endpoints

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/api/creature-types` | All creature types with available component IDs |
| `GET` | `/api/component-types` | All component types with full effect tables and rarity scaling |
| `GET` | `/api/monsters` | All monsters with harvestable component types and selected harvest component IDs |
| `POST` | `/api/monsters` | Create a custom monster + its named ingredients atomically |
| `PUT` | `/api/monsters/:id` | Update a custom monster; diffs harvest selections to cascade-create/delete ingredients |
| `DELETE` | `/api/monsters/:id` | Delete a custom monster and cascade to its ingredients |
| `GET` | `/api/ingredients` | All ingredients with source monster IDs |
| `DELETE` | `/api/ingredients/:id` | Delete a custom ingredient |
| `GET` | `/api/recipes` | All recipes with nested ingredient slots |
| `GET` | `/api/harvest-components` | All 208 harvest components — optional `?creatureTypeId=` filter |
| `GET` | `/api/magic-items` | All magic item recipes — optional `?category=`, `?rarity=`, `?creatureTypeId=` filters |
| `GET` | `/api/health` | `{ "status": "ok" }` |

All responses are camelCase JSON. Junction table joins are handled server-side — every endpoint is a single SQL query with no N+1.

---

## Database

SQLite via `better-sqlite3`. The database file is created automatically on first run if it does not exist.

| Context | Database location |
| --- | --- |
| Dev server | `data/cooking-rules.db` (project root) |
| Packaged Electron (macOS) | `~/Library/Application Support/Chef Aratus Cookbook/cooking-rules.db` |
| Packaged Electron (Windows) | `%APPDATA%\Chef Aratus Cookbook\cooking-rules.db` |

Override the path with the `DB_PATH` environment variable.

Schema and seed files are applied automatically using `PRAGMA user_version` as a migration flag. To reset, delete the `.db` file and restart the server.

---

## Packaging (desktop installers)

```bash
# macOS — produces x64 and arm64 DMGs in release/
npm run dist:mac

# Windows — produces an NSIS installer in release/
# Must be run on Windows, or via a Windows CI runner
npm run dist:win
```

Output files land in `release/` (gitignored).

### macOS Gatekeeper

The app is not code-signed with an Apple Developer ID. On first launch, macOS will block it. Users must **right-click → Open** to bypass the warning. After that, it opens normally.

### Windows SmartScreen

Similarly, Windows SmartScreen will warn about an unknown publisher on first run. Click **More info → Run anyway** to proceed.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular 21, Angular Material, SCSS |
| State | Angular Signals + `toSignal()` for HTTP caching |
| API | Node.js 22, Express 4, TypeScript |
| Database | SQLite via `better-sqlite3` |
| Desktop shell | Electron 32 |
| Packaging | electron-builder 26 |
| Dev runner | `tsx watch` |
