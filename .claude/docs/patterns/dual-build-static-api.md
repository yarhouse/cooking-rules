# Pattern: Dual-Mode Build — Static Web Demo vs Live API

## Overview

The app supports two fundamentally different data sources selected at **build time**:

| Mode | Data source | Persistence | Use case |
|---|---|---|---|
| API mode (dev/prod/electron) | Express + SQLite via HTTP | Full server-side | Development, Electron, self-hosted |
| Static mode | TypeScript data files bundled into the JS | `localStorage` only | GitHub Pages, Netlify, demo links |

The switch is a single boolean in the environment file. Angular's build optimiser tree-shakes whichever code path isn't used, so neither data source adds weight to the other's bundle.

---

## Key files

| File | Role |
|---|---|
| [`src/environments/environment.ts`](../../src/environments/environment.ts) | Dev default — API mode |
| [`src/environments/environment.prod.ts`](../../src/environments/environment.prod.ts) | Production web — API mode |
| [`src/environments/environment.electron.ts`](../../src/environments/environment.electron.ts) | Electron build — API mode, `baseHref: './'` |
| [`src/environments/environment.static.ts`](../../src/environments/environment.static.ts) | Static build — static mode |
| [`src/app/services/cooking-data.service.ts`](../../src/app/services/cooking-data.service.ts) | Central data layer — the only file that branches on `environment.staticData` |
| [`angular.json`](../../angular.json) | `configurations` block — maps each config name to a `fileReplacements` entry |

---

## How the environment switch works

Each environment file exports the same shape:

```ts
// environment.ts (dev)
export const environment = {
  production: false,
  staticData: false,
  apiBaseUrl: 'http://localhost:3000/api',
};

// environment.static.ts
export const environment = {
  production: true,
  staticData: true,
  apiBaseUrl: '',
};
```

`angular.json` uses `fileReplacements` to swap which file gets compiled in:

```json
"static": {
  "baseHref": "/cooking-rules/",
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with":    "src/environments/environment.static.ts"
    }
  ]
}
```

At build time `environment.ts` is replaced by `environment.static.ts`. Every import of `environment` throughout the app gets the static version. Because `environment.staticData` is a literal `true`/`false`, the Angular build optimiser can statically evaluate the ternaries and dead-code-eliminate the unused branch.

---

## The data service pattern (`CookingDataService`)

All data access goes through a single service. No component imports data directly or calls `HttpClient` directly. The service is the only place that knows about the environment:

```ts
// src/app/services/cooking-data.service.ts:57-59
private _creatureTypes: Signal<CreatureType[]> = environment.staticData
  ? signal(CREATURE_TYPES)                                          // static: synchronous signal from TS file
  : toSignal(this.api.get<CreatureType[]>('/creature-types'), { initialValue: [] });  // API: HTTP signal
```

The `loading` computed follows the same pattern:

```ts
// :91-98
readonly loading = computed(() =>
  environment.staticData ? false :   // static builds are always loaded
  this._creatureTypes().length === 0 || ...
);
```

**Why this matters:** components never see a difference. They call `getMonsters()`, `getRecipes()`, etc. — all synchronous. The loading state is handled once at the app shell level. Adding a new data source later only touches this service.

### Refresh subjects for POST/PUT/DELETE

For datasets that can be mutated through the API, a `Subject` drives re-fetching:

```ts
// :65-71
private _monstersRefresh$ = new Subject<void>();
private _monsters: Signal<Monster[]> = environment.staticData
  ? signal(MONSTERS)
  : toSignal(
      this._monstersRefresh$.pipe(startWith(null), switchMap(() => this.api.get<Monster[]>('/monsters'))),
      { initialValue: [] }
    );
```

After a mutation, call `refreshMonsters()`. In static builds this is a no-op:

```ts
refreshMonsters(): void { if (!environment.staticData) this._monstersRefresh$.next(); }
```

---

## Static data files (`src/app/data/`)

These are plain TypeScript files exporting typed arrays. They're the source of truth for the static build and are maintained manually (or generated from the DB).

To regenerate from the live database, query the same endpoints the API serves and write the results to the data files. There's no automation for this currently — it's a manual export step when reference data changes significantly.

---

## The Electron `baseHref` difference

Normal web builds use an absolute `baseHref` (e.g. `/cooking-rules/`) because they're served from a web server. The Electron build uses `baseHref: './'` because the HTML file is loaded directly from disk via `win.loadFile(...)` — there's no server, so absolute paths break all asset references.

```json
"electron": {
  "baseHref": "./"
}
```

This is the most common Electron Angular gotcha. Forgetting it gives you a blank white window with 404s for all JS/CSS bundles.

---

## `ApiService` (`src/app/services/api.service.ts`)

All HTTP calls go through this thin wrapper — never direct `HttpClient` in components or other services:

- Prepends `environment.apiBaseUrl` to every request
- Centralises error handling in one place
- Makes the `apiBaseUrl` swap between dev/prod/electron transparent

---

## Adapting for a new project

1. Copy all four `src/environments/` files — change `apiBaseUrl` values and `baseHref` in `angular.json`
2. Copy the `configurations` block in `angular.json` — rename `cooking-rules` to your project name in the `buildTarget` strings
3. Create your own `src/app/data/*.data.ts` files — typed arrays matching your API response shapes
4. Copy the `CookingDataService` pattern: one private signal per dataset, one ternary per signal, one `loading` computed. Rename/replace the five datasets with your own
5. Copy `ApiService` as-is — it's already generic
6. No component changes needed — they call the service methods, which return the same types regardless of mode

### When to add a new dataset

For each new entity type (e.g. `spells`, `locations`, `factions`):
1. Add a `src/environments/` boolean — never needed, it's always `staticData`
2. Add `src/app/data/spells.data.ts` with a typed array
3. Add the API route in `server/src/routes/spells.ts`
4. Add three lines to `CookingDataService`: private signal, refresh subject (if mutable), public getter
5. Done — all components use the getter, static and API builds both work
