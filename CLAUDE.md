# CLAUDE.md — aratus-cookbook

Angular 21 frontend + Node/Express API + Electron desktop app — a monster cooking rules reference and campaign tracker. Uses SQLite (better-sqlite3) — no external database required.

## Build targets

There are three distinct build targets, each with its own Angular environment file:

| Target | Config | Environment file | Data source | Persistence |
| --- | --- | --- | --- | --- |
| `ng serve` / `ng build` | `development` / `production` | `environment.ts` / `environment.prod.ts` | API at `localhost:3000` | SQLite via API |
| `npm run build:electron` | `electron` | `environment.electron.ts` | API at `localhost:3000` | SQLite via API |
| `npm run build:static` | `static` | `environment.static.ts` | Static TS data files | `localStorage` only |

`build:static` is a PWA build — Angular's service worker (`ngsw-worker.js`) and a web app manifest are included in the output. The service worker is only registered when `environment.staticData === true`, so it never activates in dev or Electron. The static output must be hosted at `/cooking-rules/` (matches `baseHref`).

The `staticData` boolean in each environment file controls whether `CookingDataService` uses `toSignal(http.get(...))` or `signal(STATIC_DATA)`. Angular's build optimiser tree-shakes the unused path.

## Development — starting everything

Two processes need to be running:

```bash
# Terminal 1 — API server (port 3000, restarts on file change)
cd server
npm run dev

# Terminal 2 — Angular dev server (port 4200)
ng serve
```

The Angular app is at `http://localhost:4200`. The API is at `http://localhost:3000`.

The SQLite database is created automatically at `data/cooking-rules.db` on first API server start. No manual setup needed.

> **After any `dist:mac` or `dist:win` run**, `better-sqlite3` in `server/node_modules/` will be compiled against Electron's Node ABI. The dev server will crash with a `NODE_MODULE_VERSION` mismatch until you restore it:

```bash
cd server && npm rebuild better-sqlite3
```

## Electron desktop app

```bash
# Dev — build Angular + server, then launch Electron (no packaging)
npm run electron:start

# Package macOS DMGs (x64 + arm64) → release/
npm run dist:mac

# Package Windows NSIS installer → release/
npm run dist:win
```

### How the Electron app works

`electron/main.js` is the main process. On `app.whenReady()` it:

1. Opens a log stream to `userData/server.log` for debugging
2. Spawns `server/dist/index.js` as a child process using `process.execPath` (Electron's own Node) with `ELECTRON_RUN_AS_NODE=1`
3. Passes `DB_PATH=<userData>/cooking-rules.db` and `RESOURCES_PATH=<resourcesPath>` to the child
4. Polls `http://localhost:3000/api/health` every 500 ms (max 30 s) before opening the `BrowserWindow`
5. Kills the server child process on `will-quit`

The `serverReady` flag prevents the macOS `activate` event (fires on first launch before the server is up) from calling `createWindow()` prematurely.

### Native module version management

`better-sqlite3` is a native Node addon and must be compiled against the exact Node version bundled in Electron. `postinstall` runs `electron-builder install-app-deps` automatically. If you upgrade Electron, run `npm install` again to recompile.

For dev, the server is spawned with Electron's own binary (`process.execPath`) + `ELECTRON_RUN_AS_NODE=1` so the compiled addon version always matches. The `ELECTRON_RUN_AS_NODE` env var is stripped from the parent env spread so it doesn't affect the main Electron process.

#### Multi-arch packaging and the afterPack hook

**The problem:** `electron-builder`'s built-in native module rebuild only scans root `node_modules/` — it never touches `server/node_modules/`. When `dist:mac` builds both x64 and arm64 DMGs, whatever `better_sqlite3.node` was compiled on the host machine ends up in both bundles. The arm64 DMG then contains an x64 binary, causing a crash on Apple Silicon (`node:electron/js2c/node_init` dumps its own source to stdout before any user code runs).

**The fix:** `electron/after-pack.js` is an `electron-builder` `afterPack` hook. After each platform bundle is assembled it:

1. Backs up the current `better_sqlite3.node` (the system-Node dev binary)
2. Rebuilds `better_sqlite3.node` for the exact target arch against Electron's Node ABI
3. Copies the result into the assembled bundle (`app.asar.unpacked/...`)
4. Attempts to restore the backup so local `npm run dev` still works

**Known issue — restore step is unreliable:** Despite backing up and restoring, `npm run dev` fails after a `dist:mac` run with a NODE_MODULE_VERSION mismatch (binary compiled for Electron NMV 128, system Node 22 needs NMV 127). The root cause is not yet fully diagnosed — likely electron-builder mutates something beyond env vars (possibly a temporary `.npmrc` or node-gyp config) that causes `better-sqlite3` to remain compiled against Electron's ABI even after the file-level restore.

**Workaround:** After any `dist:mac` or `dist:win` run, restore the dev binary manually:

```bash
cd server && npm rebuild better-sqlite3
```

**Resuming investigation:** When revisiting, start by logging what `better_sqlite3.node` contains (via `file` command) immediately before and after the restore step to confirm whether the file copy itself is the problem or whether something else rebuilds the binary a second time after the hook returns.

### Packaging internals

`server/dist/`, `server/node_modules/`, and `server/package.json` are listed in `asarUnpack` — they must be outside `app.asar` because spawned processes cannot read files from inside an asar archive. The server entry path in `main.js` uses `app.getAppPath().replace('app.asar', 'app.asar.unpacked')` when `app.isPackaged` is true.

`db/sqlite/schema.sql` and `db/seeds/001_reference_data.sql` go into `extraResources` (landing at `process.resourcesPath`). The server reads them via the `RESOURCES_PATH` env var when packaged, falling back to the project root for dev.

## API server (`server/`)

TypeScript + Express + better-sqlite3. `"type": "module"` in `server/package.json` — all source is ESM. Config lives in `server/.env` (gitignored).

```text
server/
├── .env                  ← PORT, CORS_ORIGINS (not committed)
├── .env.example          ← template
└── src/
    ├── index.ts          ← Express app, helmet, rate-limit, CORS, routes, error handler
    ├── db.ts             ← better-sqlite3 connection, WAL mode, first-run init via user_version pragma
    └── routes/
        ├── creature-types.ts       GET /api/creature-types
        ├── component-types.ts      GET /api/component-types
        ├── monsters.ts             GET /api/monsters
        ├── ingredients.ts          GET /api/ingredients
        ├── recipes.ts              GET /api/recipes
        ├── harvest-components.ts   GET /api/harvest-components[?creatureTypeId=]
        └── magic-items.ts          GET /api/magic-items[?category=][&rarity=][&creatureTypeId=]
```

All routes are synchronous (better-sqlite3 is sync). Each runs a single SQL query using `json_group_array` + `json_object` for junction table aggregation, returning nested camelCase JSON. Results include `JSON.parse()` for SQLite's JSON string columns.

The two harvesting/crafting routes support optional query params for filtering:

- `GET /api/harvest-components?creatureTypeId=<id>` — filter by creature type
- `GET /api/magic-items?category=<cat>&rarity=<rar>&creatureTypeId=<id>` — filter by any combination

```bash
cd server
npm run dev     # tsx watch — restarts on file change
npm run build   # tsc → server/dist/
npm start       # node server/dist/index.js
```

## Database (`db/`)

SQLite. Schema uses `CHECK` constraints (no ENUMs), `INTEGER` booleans, and `TEXT` timestamps.

```text
db/
├── sqlite/
│   └── schema.sql              ← full SQLite schema
└── seeds/
    └── 001_reference_data.sql  ← all rulebook data (idempotent — INSERT OR IGNORE)
```

First-run initialisation is handled in `server/src/db.ts` using `PRAGMA user_version`:

- `0` → apply schema + seed, set `user_version = 1`
- `1` → skip init, log "Connected to …"

To reset: delete the `.db` file and restart the server.

### Database locations

| Context | Path |
| --- | --- |
| Dev | `data/cooking-rules.db` (project root, gitignored) |
| Packaged macOS | `~/Library/Application Support/Cooking Rules/cooking-rules.db` |
| Packaged Windows | `%APPDATA%\Cooking Rules\cooking-rules.db` |

Override with the `DB_PATH` environment variable.

### Tables

| Table | Description |
| --- | --- |
| `creature_types` | 14 creature types |
| `component_types` | 10 component types (blood, bone, brain…) |
| `creature_type_components` | Junction: which components each creature type yields |
| `component_effects` | Per-(component × creature type) effect with 4 rarity scaling columns |
| `monsters` | ~55 monsters with `is_boss` flag |
| `monster_harvestable_components` | Junction: harvestable components per monster |
| `ingredients` | ~109 ingredients |
| `ingredient_source_monsters` | Junction: which monsters drop each ingredient |
| `recipes` | 32 recipes across 5 tiers (novice → boss) |
| `recipe_ingredients` | Junction: required components per recipe with optional `boss_specific` label |
| `harvest_components` | 208 harvestable parts per creature type — DC, skill, edibility, volatility |
| `magic_item_recipes` | Magic item crafting recipes — category, rarity, DC, time, essence type |
| `magic_item_components` | Junction: component requirements per magic item recipe |

Campaign/inventory tables (`campaigns`, `inventory_entries`, `essence_stock`) exist in the schema but are currently managed client-side by `InventoryService` via `localStorage`.

## Angular app (`src/`)

**Standalone components** (Angular 21, no NgModules). App config in `src/app/app.config.ts`.

### Routing (hash-based)

| Route | Component | Purpose |
| --- | --- | --- |
| `/#/search` | `SearchComponent` | Federated search across monsters, recipes, ingredients |
| `/#/browse` | `BrowseComponent` | Filter/browse by creature type, component type, tier |
| `/#/builder` | `RecipeBuilderComponent` | Select ingredients, see which recipes are craftable |
| `/#/inventory` | `InventoryComponent` | Track ingredient stock and loose essence |
| `/#/harvesting` | `HarvestingComponent` | Browse harvest components by creature type — DC, skill, edibility, volatility |
| `/#/crafting` | `CraftingComponent` | Browse magic item recipes by category/rarity; craft from inventory |
| `/#/rules` | `RulesComponent` | Rules reference — effects by component/creature, quirks |

### Services

**`CookingDataService`** (`src/app/services/cooking-data.service.ts`)

- Central data access layer — all components inject this, none import data directly
- In API mode: fetches all 7 datasets via `toSignal(api.get(...))` — loads once, cached in signals
- In static mode (`environment.staticData === true`): initialises signals directly from `src/app/data/*.data.ts`
- All 7 private signals are typed as `Signal<T>` with a ternary on `environment.staticData`
- `loading` computed returns `false` immediately in static mode
- Merges custom user-created entities from `InventoryService` into every getter
- Exposes `harvestComponents()` and `magicItems()` getters alongside the original 5

**`InventoryService`** (`src/app/services/inventory.service.ts`)

- Manages per-session state with Angular signals persisted to `localStorage`
- Tracks: ingredient quantities, essence stock (by rarity), custom monsters/recipes/ingredients, effect overrides (house rules)

**`ApiService`** (`src/app/services/api.service.ts`)

- Thin HTTP wrapper — prepends `environment.apiBaseUrl` and centralises error handling
- All HTTP calls go through this, never direct `HttpClient` calls in other services

### Environments

| File | `staticData` | `apiBaseUrl` | Used by |
| --- | --- | --- | --- |
| `environment.ts` | `false` | `http://localhost:3000/api` | `ng serve` / dev |
| `environment.prod.ts` | `false` | `/api` | `ng build` (production) |
| `environment.electron.ts` | `false` | `http://localhost:3000/api` | `build:electron` |
| `environment.static.ts` | `true` | `''` | `build:static` |

### Shared components (`src/app/components/shared/`)

| Component | Role |
| --- | --- |
| `monster-card` | Monster summary card; opens `MonsterDetailDialogComponent` |
| `ingredient-card` | Ingredient card with inventory controls |
| `recipe-card` | Recipe card with tier badge; opens `RecipeDetailDialogComponent` |
| `monster-detail-dialog` | Full monster sheet in a MatDialog |
| `ingredient-detail-dialog` | Ingredient detail with source monsters and related recipes |
| `recipe-detail-dialog` | Recipe detail with component effects |
| `edit-dialog` | Generic edit form for custom entities |

### Angular commands

```bash
ng serve                                    # Dev server at http://localhost:4200
ng serve --configuration=static            # Static build dev server
ng build                                   # Production build
ng build --configuration=static            # Static web build
ng build --configuration=electron          # Electron build
ng test                                    # Unit tests via Vitest
ng lint                                    # ESLint
ng generate component components/<name>    # Scaffold a new component
```

## Data models (`src/app/models/`)

TypeScript interfaces matching the API response shapes exactly (camelCase). The API SQL handles all snake_case → camelCase mapping and junction table joins server-side.

| Model file | Key types |
| --- | --- |
| `creature-type.model.ts` | `CreatureType` |
| `component-type.model.ts` | `ComponentType`, `ComponentEffect`, `RarityScaling`, `ComponentTypeName`, `Rarity` |
| `monster.model.ts` | `Monster`, `MonsterRarity` |
| `ingredient.model.ts` | `Ingredient` |
| `recipe.model.ts` | `Recipe`, `RecipeIngredient`, `RecipeTier` |
| `inventory.model.ts` | `InventoryEntry`, `EssenceStock` |
| `harvest-component.model.ts` | `HarvestComponent` |
| `magic-item.model.ts` | `MagicItem`, `MagicItemComponent`, `MagicItemCategory`, `MAGIC_ITEM_CATEGORY_LABELS` |
