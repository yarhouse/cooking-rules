import { Component, Input } from '@angular/core';

/**
 * Presentational component that renders a rarity indicator in one of three
 * visual styles controlled by the `variant` input. CSS classes are applied
 * via host bindings so no wrapper element is needed.
 *
 * Used throughout the app wherever a rarity value needs to be displayed
 * (monster cards, recipe cards, crafting table, harvesting page).
 */
@Component({
  selector: 'app-rarity-label',
  standalone: true,
  templateUrl: './rarity-label.component.html',
  styleUrl: './rarity-label.component.scss',
  host: {
    'class': 'rarity-label',
    '[class.rarity-label--dot]':    'variant === "dot"',
    '[class.rarity-label--tag]':    'variant === "tag"',
    '[class.rarity-label--badge]':  'variant !== "dot" && variant !== "tag"',
    '[class.rarity-common]':        'rarity === "common"',
    '[class.rarity-uncommon]':      'rarity === "uncommon"',
    '[class.rarity-rare]':          'rarity === "rare"',
    '[class.rarity-very-rare]':     'rarity === "very-rare"',
    '[class.rarity-legendary]':     'rarity === "legendary"',
    '[class.rarity-artifact]':      'rarity === "artifact"',
  },
})
export class RarityLabelComponent {
  /** The rarity string to display (e.g. `'common'`, `'very-rare'`, `'legendary'`). */
  @Input({ required: true }) rarity!: string;
  /**
   * Visual style:
   * - `'badge'` (default) — filled pill
   * - `'dot'` — small coloured dot only
   * - `'tag'` — outlined pill
   */
  @Input() variant: 'badge' | 'dot' | 'tag' = 'badge';

  /** Title-cases the rarity string for display (e.g. `'very-rare'` → `'Very Rare'`). */
  get label(): string {
    return this.rarity.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }
}
