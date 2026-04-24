import { Component, Input } from '@angular/core';

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
  @Input({ required: true }) rarity!: string;
  @Input() variant: 'badge' | 'dot' | 'tag' = 'badge';

  get label(): string {
    return this.rarity.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }
}
