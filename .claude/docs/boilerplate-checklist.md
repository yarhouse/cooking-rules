# D&D App Boilerplate Checklist

Ordered list of what to copy and adapt when starting a new D&D reference/campaign app from this project.

For the full reasoning and pitfall notes behind each step, see the linked pattern guides.

---

## 1. Scaffold the Angular project

```bash
ng new <project-name> --style=scss --routing=false --ssr=false
cd <project-name>
npm install @angular/material @angular/cdk
```

Set up hash-based routing in `app.config.ts`:

```ts
provideRouter(routes, withHashLocation())
```

---

## 2. Copy the sidenav shell

Files to copy and adapt:

- `src/app/app.ts` — update `navItems`, app name strings, `COLLAPSED_KEY`, `DARK_MODE_KEY`
- `src/app/app.html` — update title, subtitle, nav icon names and routes
- `src/app/app.scss` — copy as-is; adjust `$sidenav-expanded-width`, `$sidenav-rail-width`, breakpoint if needed

Required on the component:

```ts
encapsulation: ViewEncapsulation.None,
```

See [sidenav-rail-mobile.md](patterns/sidenav-rail-mobile.md) for why `!important` is unavoidable and how to avoid the nested `&` SCSS trap.

---

## 3. Copy the M3 theme

Files to copy and adapt:

- `src/styles.scss` — change `mat.$orange-palette` / `mat.$red-palette` to your project's colours

Global tokens used in components follow the `--mat-sys-*` naming scheme. Use them instead of hardcoded colours.

See [material-m3-theme.md](patterns/material-m3-theme.md) for the three-layer dark mode cascade and how to find override tokens in DevTools.

---

## 4. Set up the Express API server

Directory structure to copy:

```
server/
├── .env.example
├── package.json          ← must have "type": "module" and better-sqlite3 as a dep
├── tsconfig.json
└── src/
    ├── index.ts          ← copy as-is, change listen log message
    ├── db.ts             ← copy as-is, adjust log messages
    └── routes/           ← write your own routes
```

`server/src/db.ts` and `server/src/index.ts` are fully generic — only the listen log message mentions the app name. The `PRAGMA user_version` init pattern works for any schema.

Write your own schema in `db/sqlite/schema.sql` and seeds in `db/seeds/001_reference_data.sql`.

See [electron-sqlite.md](patterns/electron-sqlite.md) for the first-run init pattern and migration path.

---

## 5. Add the dual-build environment setup

Files to copy:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `src/environments/environment.electron.ts`
- `src/environments/environment.static.ts`

Update `apiBaseUrl` values and `baseHref` entries in `angular.json`. Add the `configurations` block:

```json
"configurations": {
  "electron": { "baseHref": "./",           "fileReplacements": [...] },
  "static":   { "baseHref": "/your-path/",  "fileReplacements": [...] },
  "production":{ "baseHref": "/your-path/", "fileReplacements": [...] }
}
```

**Critical:** Electron must use `baseHref: "./"` — an absolute path breaks asset loading from disk.

Create your static data files in `src/app/data/*.data.ts`.

See [dual-build-static-api.md](patterns/dual-build-static-api.md) for the `CookingDataService` signal pattern and the `ApiService` wrapper.

---

## 6. Wire up Electron

Files to copy:

- `electron/main.js` — update three strings: app name in `dialog.showErrorBox`, `DB_PATH` filename, log prefix
- Add `"main": "electron/main.js"` to the root `package.json`
- Add the `build` block to `package.json` (update `appId`, `productName`, `copyright`, icon paths)
- Add the npm scripts: `electron:start`, `dist:mac`, `dist:win`, `build:electron`, `postinstall`

Install dev dependencies:

```bash
npm install --save-dev electron electron-builder @electron/rebuild
```

Run `npm install` once after adding `electron` — `postinstall` will compile `better-sqlite3` against Electron's Node.

See [electron-sqlite.md](patterns/electron-sqlite.md) for the asar unpacking configuration and native module pitfalls.

---

## 7. Write your data models and routes

For each entity type in your D&D game:

1. Add a TypeScript interface in `src/app/models/<entity>.model.ts`
2. Write the SQL table in `db/sqlite/schema.sql`
3. Write seed data in `db/seeds/001_reference_data.sql`
4. Add an Express route in `server/src/routes/<entity>.ts`
5. Add the route to `server/src/index.ts`
6. Add a static data file in `src/app/data/<entity>.data.ts`
7. Add the signal + getter to `CookingDataService`

---

## 8. Common starting routes for a D&D reference app

| Route | Component | Purpose |
|---|---|---|
| `/#/search` | `SearchComponent` | Federated search across all entity types |
| `/#/browse` | `BrowseComponent` | Filter/browse by category or type |
| `/#/rules` | `RulesComponent` | Quick reference for rules and effects |
| `/#/inventory` | `InventoryComponent` | Campaign tracking, session notes |

---

## Checklist summary

- [ ] Angular project scaffolded with hash routing
- [ ] `app.ts` / `app.html` / `app.scss` copied and names updated
- [ ] `ViewEncapsulation.None` set on root component
- [ ] `src/styles.scss` theme copied, palettes updated
- [ ] `server/` directory set up with `db.ts`, `index.ts`, routes skeleton
- [ ] `db/sqlite/schema.sql` written for your domain
- [ ] `db/seeds/001_reference_data.sql` written
- [ ] Four `src/environments/` files in place
- [ ] `angular.json` `configurations` block updated with correct `baseHref` values
- [ ] `CookingDataService` pattern replicated for your entity types
- [ ] Static data files in `src/app/data/`
- [ ] `electron/main.js` copied and app name strings updated
- [ ] `package.json` `build` block configured with correct `appId` and icon paths
- [ ] `npm install` run to compile native modules against Electron
- [ ] Icons dropped in `build/icon.icns` (macOS) and `build/icon.ico` (Windows)
