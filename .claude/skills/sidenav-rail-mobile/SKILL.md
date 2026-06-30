---
name: sidenav-rail-mobile
description: >
  Implement an Angular Material sidenav that has three states: an expanded desktop sidebar (with labels), a collapsed icon-only rail (desktop), and a full overlay drawer on mobile. Use this skill whenever the user wants to add a nav sidebar, app shell, or shell layout to an Angular project — especially if they mention "rail nav", "collapsible sidebar", "mobile nav", "hamburger menu", or want navigation that works across breakpoints. Also trigger when the user asks to adapt the cooking-rules app nav to a new project.
---

# MatSidenav: Collapsible Rail + Mobile Overlay

Three-state navigation shell for Angular 21 + Angular Material:

| State | Trigger | Visual |
|---|---|---|
| **Expanded** | Desktop, user-expanded | Full-width sidebar (default 260px) with icons + labels |
| **Rail** | Desktop, user-collapsed | Narrow strip (default 80px), icons only, labels hidden via animated `max-width` |
| **Overlay** | Mobile (≤768px) | Full sidebar that slides over content; closes on nav or backdrop click |

Desktop always uses `mode="side"` — content shifts right. Mobile switches to `mode="over"` and hides the sidenav; a sticky top toolbar with a hamburger button appears instead.

---

## Complete example files

Read these before writing any code — they are the full working implementation, not excerpts:

- **[`assets/example.html`](assets/example.html)** — complete `app.html` template
- **[`assets/example.scss`](assets/example.scss)** — complete `app.scss` with all states, transitions, and `!important` overrides

When adapting to a new project, copy these files and adjust only what the project needs.

---

## TypeScript (`app.ts`)

### Imports and encapsulation

```ts
import { Component, computed, signal, inject, DestroyRef, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None,   // REQUIRED — see below
  imports: [ /* all of the above */ ],
})
```

`ViewEncapsulation.None` is **non-negotiable**. Angular Material's MDC internals (`.mdc-list-item__start`, `.mat-drawer`, etc.) don't carry the component's attribute selector, so scoped styles can never reach them. Disabling encapsulation on the root app component lets `app.scss` reach AM's internals. Guard against global bleed by wrapping all styles in `app-root { }`.

### Signal state

```ts
const COLLAPSED_KEY = 'sidenav-collapsed';

sidenavOpened    = signal(true);
sidenavMode      = signal<'side' | 'over'>('side');
sidenavCollapsed = signal(localStorage.getItem(COLLAPSED_KEY) === 'true');

isRail     = computed(() => this.sidenavCollapsed() && this.sidenavMode() === 'side');
isSideOpen = computed(() => this.sidenavMode() === 'side' && this.sidenavOpened());
```

`isRail` is only `true` on desktop in the collapsed state. `isSideOpen` is used to apply a CSS class to the container so we can manually own `margin-left` (necessary because AM sets it as an inline style).

### Breakpoint observer

```ts
private destroyRef = inject(DestroyRef);
private breakpointObserver = inject(BreakpointObserver);

constructor() {
  this.breakpointObserver.observe(['(max-width: 768px)'])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(result => {
      this.sidenavOpened.set(!result.matches);
      this.sidenavMode.set(result.matches ? 'over' : 'side');
    });
}
```

`takeUntilDestroyed` handles cleanup automatically — no manual `unsubscribe`.

### Toggle method

The same button collapses/expands on desktop and closes the drawer on mobile:

```ts
toggleCollapsed(): void {
  if (this.sidenavMode() === 'over') {
    this.sidenavOpened.set(false);   // mobile: close the drawer
    return;
  }
  const next = !this.sidenavCollapsed();
  this.sidenavCollapsed.set(next);
  localStorage.setItem(COLLAPSED_KEY, String(next));
}
```

Also wire up `onSidenavClosed()` to sync state when the user clicks the backdrop:

```ts
onSidenavClosed(): void {
  if (this.sidenavMode() === 'over') this.sidenavOpened.set(false);
}

onNavClick(): void {
  if (this.sidenavMode() === 'over') this.sidenavOpened.set(false);
}
```

---

## HTML class binding points

Four distinct elements need dynamic class bindings:

```html
<!-- 1. Container — drives margin-left CSS -->
<mat-sidenav-container [class.rail-active]="isRail()" [class.side-open]="isSideOpen()">

  <!-- 2. Sidenav — drives width CSS -->
  <mat-sidenav [mode]="sidenavMode()" [opened]="sidenavOpened()"
               [class.rail]="isRail()" (closed)="onSidenavClosed()">

    <!-- 3. Content wrapper — drives internal layout (centering, hidden labels) -->
    <div class="sidebar-content" [class.rail]="isRail()">

      <!-- 4. Each nav item — drives icon centering -->
      <a mat-list-item [class.rail-item]="isRail()"
         [matTooltip]="isRail() ? item.label : ''" matTooltipPosition="right">
```

Read `assets/example.html` for the full template including nav groups, theme toggle, and mobile toolbar.

---

## SCSS — why `!important` is unavoidable

Angular Material sets `width` (on the drawer) and `margin-left` (on sidenav-content) as **inline styles** via JavaScript. Inline styles beat any class-based CSS, regardless of selector specificity. Two overrides are required:

**Drawer width:**
```scss
mat-sidenav {
  width: $sidenav-expanded-width !important;   // beats AM's inline 360px default
  transition: width $nav-transition, transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  overflow: hidden !important;
  border-radius: 0 !important;   // Material 3 adds rounded corners by default

  &.rail { width: $sidenav-rail-width !important; }
}
```

**Content margin (full ownership):**
```scss
mat-sidenav-content {
  transition: margin-left $nav-transition !important;
}
&.side-open   mat-sidenav-content { margin-left: $sidenav-expanded-width !important; }
&.rail-active mat-sidenav-content { margin-left: $sidenav-rail-width !important; }
```

`.rail-active` must come **after** `.side-open` in the source so it wins during the transition when both classes are momentarily present.

**Rail item centering** (MDC internals):
```scss
.rail-item {
  padding-inline: 0 !important;
  justify-content: center !important;
  .mdc-list-item__start   { margin: 0 !important; }
  .mdc-list-item__content { flex-grow: 0 !important; flex-shrink: 1 !important; }
}
```

**Label hide animation** (use `max-width` not `display:none` — you can't transition `none`):
```scss
.nav-label {
  max-width: 160px;
  opacity: 1;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width $nav-transition, opacity $nav-transition;
}
.rail .nav-label { max-width: 0; opacity: 0; }
```

Read `assets/example.scss` for the complete file including all layout, sidebar bottom section, mobile toolbar, and nav group headers.

---

## Common pitfalls

**Width doesn't animate (instant snap):** The `transition` on `mat-sidenav` must include `!important` — AM's own transition declaration also uses `!important` internally and wins without it.

**Content jumps on collapse:** `mat-sidenav-content` `margin-left` transition must use the same duration and cubic-bezier as the drawer width transition.

**Nested `.rail &` SCSS breaks:** Inside a nested block, `.rail & .child` compiles to `.rail app-root .child` which won't match. Write rail overrides at the root level of `app-root`:

```scss
// WRONG — SCSS compiles this to ".rail app-root .sidebar-header"
.sidebar-content {
  .rail & .sidebar-header { justify-content: center; }
}

// CORRECT — compiles to ".rail .sidebar-header"
.rail .sidebar-header { justify-content: center; }
```

**Mobile toolbar visible on desktop:** Ensure `.mobile-toolbar { display: none; }` is set at base level and only `display: flex` inside the `@media (max-width: 768px)` block.

---

## Adapting to a new project

1. Copy `assets/example.html` → `src/app/app.html`. Update the title strings and nav items.
2. Copy `assets/example.scss` → `src/app/app.scss`. Adjust the three variables at the top (`$sidenav-expanded-width`, `$sidenav-rail-width`, `$nav-transition`) and the breakpoint if needed.
3. In `app.ts`: add the signal state, `BreakpointObserver` injection, and the three methods above. Update `navGroups` to match the project's routes.
4. In `app.config.ts`: ensure `provideAnimationsAsync()` is present.
5. **Do not remove** `ViewEncapsulation.None`.
