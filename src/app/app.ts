import { Component, computed, signal, inject, DestroyRef, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

const COLLAPSED_KEY = 'sidenav-collapsed';
const DARK_MODE_KEY = 'dark-mode';

function initDarkMode(): boolean {
  const stored = localStorage.getItem(DARK_MODE_KEY);
  if (stored !== null) {
    const isDark = stored === 'true';
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    return isDark;
  }
  // No stored preference — defer to OS via CSS media query, just read current state
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  sidenavOpened = signal(true);
  sidenavMode = signal<'side' | 'over'>('side');
  sidenavCollapsed = signal(localStorage.getItem(COLLAPSED_KEY) === 'true');

  isRail = computed(() => this.sidenavCollapsed() && this.sidenavMode() === 'side');
  isSideOpen = computed(() => this.sidenavMode() === 'side' && this.sidenavOpened());

  private destroyRef = inject(DestroyRef);
  private breakpointObserver = inject(BreakpointObserver);

  isDarkMode = signal(initDarkMode());

  constructor() {
    this.breakpointObserver.observe(['(max-width: 768px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.sidenavOpened.set(!result.matches);
        this.sidenavMode.set(result.matches ? 'over' : 'side');
      });
  }

  navItems: NavItem[] = [
    { label: 'Search', route: '/search', icon: 'search' },
    { label: 'Browse', route: '/browse', icon: 'menu_book' },
    { label: 'Recipe Builder', route: '/builder', icon: 'restaurant' },
    { label: 'Inventory', route: '/inventory', icon: 'kitchen' },
    { label: 'Rules', route: '/rules', icon: 'book' },
  ];

  toggleCollapsed(): void {
    if (this.sidenavMode() === 'over') {
      this.sidenavOpened.set(false);
      return;
    }
    const next = !this.sidenavCollapsed();
    this.sidenavCollapsed.set(next);
    localStorage.setItem(COLLAPSED_KEY, String(next));
  }

  toggleTheme(): void {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    document.documentElement.classList.toggle('dark-theme', next);
    document.documentElement.classList.toggle('light-theme', !next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
  }

  onSidenavClosed(): void {
    if (this.sidenavMode() === 'over') {
      this.sidenavOpened.set(false);
    }
  }

  onNavClick(): void {
    if (this.sidenavMode() === 'over') {
      this.sidenavOpened.set(false);
    }
  }
}
