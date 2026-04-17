# Pattern: Angular Material M3 Theme with Dark/Light Mode

## Overview

This project uses Angular Material's M3 (Material Design 3) theming system with:
- Two themes defined in SCSS (`$light-theme`, `$dark-theme`)
- OS-level dark preference respected via `@media (prefers-color-scheme: dark)` — **before any JavaScript loads**
- User-overridable toggle that persists preference to `localStorage`
- Card colour override pattern for the one case where M3's defaults don't match what we want

---

## Key files

| File | Role |
|---|---|
| [`src/styles.scss`](../../src/styles.scss) | Global theme definition — the only file that calls `mat.*-theme` mixins |
| [`src/app/app.ts`](../../src/app/app.ts) | `isDarkMode` signal + `toggleTheme()` + `initDarkMode()` |
| [`src/app/app.html`](../../src/app/app.html) | Theme toggle button |

---

## Theme definition (`src/styles.scss`)

```scss
@use '@angular/material' as mat;
@include mat.core();

$light-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$orange-palette,
    tertiary: mat.$red-palette,
  ),
));

$dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.$orange-palette,
    tertiary: mat.$red-palette,
  ),
));
```

`mat.core()` must be called exactly once globally — it emits elevation, ripple, and typography base styles. Calling it more than once produces duplicate CSS.

Only `primary` and `tertiary` are set here. M3 derives `secondary`, `error`, `surface`, and all their variants automatically from the primary hue. If you need to override secondary/error, add them to the map.

### Available built-in palettes

`mat.$orange-palette`, `mat.$red-palette`, `mat.$blue-palette`, `mat.$green-palette`, `mat.$purple-palette`, `mat.$cyan-palette`, `mat.$pink-palette`, `mat.$indigo-palette`, `mat.$teal-palette`, `mat.$yellow-palette`, `mat.$brown-palette`, `mat.$blue-grey-palette`.

For a custom colour, use `mat.define-theme` with a custom palette map or use the [Material Theme Builder](https://m3.material.io/theme-builder) to generate one.

---

## The three-layer theme application

```scss
// 1. Default: light theme on all components
html {
  @include mat.all-component-themes($light-theme);
  @include mat.card-overrides($card-overrides);
  color-scheme: light;
}

// 2. OS dark preference — applies before JS loads (no class on html needed)
@media (prefers-color-scheme: dark) {
  html:not(.light-theme) {
    @include mat.all-component-colors($dark-theme);
    @include mat.card-overrides($card-overrides);
    color-scheme: dark;
  }
}

// 3. Explicit JS overrides — take priority over OS preference
html.dark-theme {
  @include mat.all-component-colors($dark-theme);
  @include mat.card-overrides($card-overrides);
  color-scheme: dark;
}

html.light-theme {
  @include mat.all-component-colors($light-theme);
  @include mat.card-overrides($card-overrides);
  color-scheme: light;
}
```

**Why this layering matters:**

- Layer 1 is the default. No class needed.
- Layer 2 fires from CSS alone — the user gets the correct theme on first paint, before Angular boots and JavaScript runs. This prevents the flash of wrong theme on page load.
- Layer 3 lets the JS toggle override the OS preference. If the user has set dark mode in the OS but clicks "light mode" in the app, `html.light-theme` wins because it comes after the `@media` block in the cascade.
- The `:not(.light-theme)` guard on layer 2 is critical — without it, the OS dark preference overrides an explicit `.light-theme` class set by the toggle.

`color-scheme` tells the browser to use dark/light native UI controls (scrollbars, form inputs, etc.) to match.

---

## Card colour override

M3's `outlined` card variant uses a transparent background by default. We want it to use the same surface colour as the `elevated` variant:

```scss
$card-overrides: (
  outlined-container-color: var(--mat-card-elevated-container-color),
);
```

This is passed to every `mat.card-overrides()` call. Without it, outlined cards are invisible on dark backgrounds.

**How to find other override tokens:** Inspect the rendered element in browser DevTools and look for `--mat-*` CSS custom properties. The token names follow the pattern `--mat-<component>-<variant>-<property>`.

---

## Dark mode toggle logic (`src/app/app.ts`)

```ts
// :22-32
function initDarkMode(): boolean {
  const stored = localStorage.getItem(DARK_MODE_KEY);
  if (stored !== null) {
    const isDark = stored === 'true';
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    return isDark;
  }
  // No stored preference — defer to OS via CSS media query
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
```

This runs synchronously during component construction. It reads `localStorage` before Angular renders anything, adding the correct class to `<html>` immediately. The CSS already handles the OS case via `@media`, so if there's no stored preference, we just read the current OS state for the signal's initial value without touching the DOM.

```ts
// :63
isDarkMode = signal(initDarkMode());
```

```ts
// :92-97
toggleTheme(): void {
  const next = !this.isDarkMode();
  this.isDarkMode.set(next);
  document.documentElement.classList.toggle('dark-theme', next);
  document.documentElement.classList.toggle('light-theme', !next);
  localStorage.setItem(DARK_MODE_KEY, String(next));
}
```

Both the `dark-theme` and `light-theme` classes are always set together — one on, one off. This ensures the cascade logic in layer 3 above always has exactly one explicit class present.

---

## Using M3 system tokens in component SCSS

Once the theme is applied to `html`, all M3 system tokens are available as CSS custom properties everywhere in the app:

```scss
// Common tokens used throughout this project
color: var(--mat-sys-primary);
color: var(--mat-sys-on-primary);
color: var(--mat-sys-on-surface-variant);
background-color: var(--mat-sys-background);
background-color: var(--mat-sys-primary-container);
color: var(--mat-sys-on-primary-container);
border-color: var(--mat-sys-outline-variant);
```

These automatically switch between light and dark values when the theme class changes. Use these tokens instead of hardcoded colours — it's what makes the dark mode toggle work for free across all components.

Body background and text colour are set globally:

```scss
// src/styles.scss:67-70
body {
  background-color: var(--mat-sys-background, #fffbfe);
  color: var(--mat-sys-on-background, #1c1b1f);
}
```

The fallback values are M3's default light surface colours — they show only if the theme fails to load.

---

## Pitfalls

**`mat.core()` called in a component:** Only ever call it once in `styles.scss`. Calling it inside a component's styles emits duplicate base CSS and can cause specificity fights.

**Using `mat.all-component-themes()` in multiple places:** Use `mat.all-component-themes()` only in the default `html {}` block. Use `mat.all-component-colors()` (colors only, no layout) for the dark/light overrides — it's far smaller.

**Forgetting `color-scheme`:** Without this, native browser controls (scrollbars, `<select>` dropdowns, `<input>` date pickers) stay in light mode even when your app is dark.

**Hardcoding colours in component SCSS:** If you write `color: #333` instead of `color: var(--mat-sys-on-surface)`, that component won't respond to the theme toggle. Always reach for a `--mat-sys-*` token first.

---

## Adapting for a new project

1. Copy `src/styles.scss` in its entirety
2. Change `mat.$orange-palette` and `mat.$red-palette` to your project's palettes
3. Copy the `initDarkMode()` function and `toggleTheme()` method from `src/app/app.ts` — they're self-contained
4. Add the theme toggle button from `src/app/app.html` wherever you want the control
5. For card overrides or other component tweaks, look up the `--mat-<component>-*` token in DevTools and add it to the overrides map in `styles.scss`
