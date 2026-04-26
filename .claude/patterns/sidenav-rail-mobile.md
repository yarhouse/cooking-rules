# Pattern: MatSidenav with Collapsible Rail + Mobile Overlay

## Overview

The navigation sidebar has three states:

| State | Trigger | Visual |
|---|---|---|
| **Expanded** (side mode) | Desktop, user-expanded | Full 240px sidebar with labels visible |
| **Rail** (side mode) | Desktop, user-collapsed | Narrow 80px strip showing icons only, labels hidden |
| **Overlay** (over mode) | Mobile (≤768px) | Full sidebar that slides over content, closes on nav |

On desktop the sidebar is always present in `side` mode — content shifts right to make room. On mobile it switches to `over` mode, hides itself, and a top toolbar takes over with a hamburger button.

---

## Key files

| File | Role |
|---|---|
| [`src/app/app.ts`](../../src/app/app.ts) | Signals, `BreakpointObserver`, toggle logic |
| [`src/app/app.html`](../../src/app/app.html) | Template — `mat-sidenav-container`, `mat-sidenav`, `mat-sidenav-content` |
| [`src/app/app.scss`](../../src/app/app.scss) | All nav CSS — widths, transitions, rail overrides, mobile toolbar |

---

## Signal state (`src/app/app.ts`)

```ts
sidenavOpened    = signal(true);
sidenavMode      = signal<'side' | 'over'>('side');
sidenavCollapsed = signal(localStorage.getItem(COLLAPSED_KEY) === 'true');

isRail     = computed(() => this.sidenavCollapsed() && this.sidenavMode() === 'side');
isSideOpen = computed(() => this.sidenavMode() === 'side' && this.sidenavOpened());
```

`isRail` is only true on desktop in the collapsed state — never on mobile. `isSideOpen` drives a CSS class on the container so we can manually control `margin-left` (see below).

### BreakpointObserver for mobile

```ts
this.breakpointObserver.observe(['(max-width: 768px)'])
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(result => {
    this.sidenavOpened.set(!result.matches);
    this.sidenavMode.set(result.matches ? 'over' : 'side');
  });
```

When the viewport drops below 768px: mode becomes `over`, sidenav closes. When it returns to desktop: mode becomes `side`, sidenav opens. `takeUntilDestroyed` handles cleanup automatically.

### Toggle logic

```ts
toggleCollapsed(): void {
  if (this.sidenavMode() === 'over') {
    // On mobile the menu button closes the drawer instead of collapsing it
    this.sidenavOpened.set(false);
    return;
  }
  const next = !this.sidenavCollapsed();
  this.sidenavCollapsed.set(next);
  localStorage.setItem(COLLAPSED_KEY, String(next));
}
```

The same menu button serves two purposes: collapse/expand on desktop, close on mobile.

---

## Template structure (`src/app/app.html`)

```html
<mat-sidenav-container [class.rail-active]="isRail()" [class.side-open]="isSideOpen()">
  <mat-sidenav [mode]="sidenavMode()" [opened]="sidenavOpened()" [class.rail]="isRail()" (closed)="onSidenavClosed()">
    <div class="sidebar-content" [class.rail]="isRail()">
      <!-- nav items use [class.rail-item]="isRail()" -->
    </div>
  </mat-sidenav>

  <mat-sidenav-content>
    <mat-toolbar class="mobile-toolbar">...</mat-toolbar>
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```

Key binding points:
- `[class.rail-active]` on the **container** — lets CSS target `margin-left` on the content area
- `[class.rail]` on the **sidenav** — lets CSS shrink its width
- `[class.rail]` on the **sidebar-content div** — lets CSS adjust internal layout (centering, hidden labels)
- `[class.rail-item]` on each **nav item** — overrides padding/justification for icon-only mode

---

## The CSS `!important` problem (and why it's unavoidable)

Angular Material sets `width` and `margin-left` as **inline styles** via JavaScript. Inline styles have higher specificity than any class-based CSS. There are two places where this forces `!important`:

### 1. Sidenav width

```scss
mat-sidenav {
  width: $sidenav-expanded-width !important;  // overrides AM's inline 360px default
  transition: width $nav-transition, transform 400ms ... !important;

  &.rail {
    width: $sidenav-rail-width !important;
  }
}
```

AM's `.mat-drawer` class sets `width: var(--mat-sidenav-container-width, 360px)`. `!important` is the only reliable solution since AM also sets it as an inline style in some configurations.

### 2. Sidenav content margin

```scss
mat-sidenav-content {
  transition: margin-left $nav-transition !important;
}

&.side-open mat-sidenav-content {
  margin-left: $sidenav-expanded-width !important;
}

&.rail-active mat-sidenav-content {
  margin-left: $sidenav-rail-width !important;
}
```

AM computes and sets `margin-left` as an inline style on `mat-sidenav-content` when the drawer opens/closes. Because we're animating a CSS `width` transition on the drawer (not AM's built-in open/close), AM's inline margin value becomes stale immediately after the width animation completes. We take **full ownership** of `margin-left`.

**The rule:** `.rail-active` comes after `.side-open` in the CSS so it wins when both classes are present simultaneously during the transition.

---

## Rail item centering

When in rail mode, list items need to centre their icon and hide everything else:

```scss
.rail-item {
  padding-inline: 0 !important;
  justify-content: center !important;

  .mdc-list-item__start   { margin: 0 !important; }
  .mdc-list-item__content { flex-grow: 0 !important; flex-shrink: 1 !important; }
}
```

The MDC list item internal layout uses `flex` with specific padding/margin set by Angular Material. `!important` is again required.

The label text is hidden via `max-width` + `opacity` transition rather than `display: none`, so the collapse animates smoothly:

```scss
.nav-label {
  max-width: 160px;
  opacity: 1;
  transition: max-width $nav-transition, opacity 150ms ease;
}

.rail .nav-label {
  max-width: 0;
  opacity: 0;
}
```

`max-width: 0` combined with `overflow: hidden` effectively hides the text while allowing CSS transitions.

---

## `ViewEncapsulation.None`

```ts
encapsulation: ViewEncapsulation.None,
```

This is required. Angular's default view encapsulation scopes styles to a generated attribute. Angular Material's internal MDC elements don't have this attribute, so scoped styles can't reach inside them. Disabling encapsulation on the root component lets `app.scss` style AM's internals directly.

Keep all styles inside the `app-root {}` wrapper in `app.scss` to avoid unintended global bleed.

---

## Mobile toolbar

```scss
.mobile-toolbar {
  display: none;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--mat-sys-outline-variant);
}

@media (max-width: 768px) {
  .mobile-toolbar { display: flex; }
}
```

`position: sticky; top: 0` keeps it pinned as the user scrolls. Always in the DOM but hidden on desktop.

---

## Pitfalls

**Width transition doesn't animate:** The `transition` on `mat-sidenav` must include `!important` — otherwise AM's own transition declaration overrides it and you get an instant snap.

**Content jumps on width change:** Happens when `mat-sidenav-content`'s `margin-left` transition doesn't match the drawer's width transition timing. Both must use the same cubic-bezier and duration.

**Nested SCSS `.rail &` syntax breaks:** If you write `.rail & .some-child` inside a nested block, SCSS compiles it to `.rail app-root .some-child` which doesn't match the DOM. Rail-mode overrides must be written as direct selectors at the same nesting level:

```scss
// BROKEN — compiles to ".rail app-root .sidebar-header"
.sidebar-content {
  .rail & .sidebar-header { justify-content: center; }
}

// CORRECT — compiles to ".rail .sidebar-header"
.rail .sidebar-header { justify-content: center; }
```

---

## Adapting for a new project

1. Copy `src/app/app.ts` — change `navItems`, app name strings, `COLLAPSED_KEY`/`DARK_MODE_KEY` constants
2. Copy `src/app/app.html` — update title, subtitle, nav icon names and routes
3. Copy `src/app/app.scss` entirely — adjust the three SCSS variables at the top (`$sidenav-expanded-width`, `$sidenav-rail-width`, breakpoint)
4. `ViewEncapsulation.None` is required — don't remove it
5. `BreakpointObserver` comes from `@angular/cdk/layout` — ensure `provideAnimationsAsync()` is in `app.config.ts`
