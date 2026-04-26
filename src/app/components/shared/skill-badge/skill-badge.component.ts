import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Presentational component that renders a D&D ability/tool check skill as a
 * labelled badge with a contextual icon. Applies a skill-specific CSS class
 * via host bindings for colour coding.
 *
 * Used by `MonsterCardComponent` and the Harvesting page to show which check
 * is used to harvest from a creature type.
 */
@Component({
  selector: 'app-skill-badge',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './skill-badge.component.html',
  styleUrl: './skill-badge.component.scss',
  host: {
    'class': 'skill-badge',
    '[class.skill-badge--arcana]':        'skill.toLowerCase() === "arcana"',
    '[class.skill-badge--survival]':      'skill.toLowerCase() === "survival"',
    '[class.skill-badge--religion]':      'skill.toLowerCase() === "religion"',
    '[class.skill-badge--investigation]': 'skill.toLowerCase() === "investigation"',
    '[class.skill-badge--medicine]':      'skill.toLowerCase() === "medicine"',
    '[class.skill-badge--nature]':        'skill.toLowerCase() === "nature"',
  },
})
export class SkillBadgeComponent {
  /** The skill name to display (e.g. `'Medicine'`, `'Survival'`). Case-insensitive. */
  @Input({ required: true }) skill!: string;

  /** Maps the skill name to a Material icon identifier.
   *  Falls back to `'psychology'` for unrecognised skills. */
  get icon(): string {
    const icons: Record<string, string> = {
      arcana:        'auto_fix_high',
      survival:      'hiking',
      religion:      'volunteer_activism',
      investigation: 'manage_search',
      medicine:      'medical_services',
      nature:        'eco',
    };
    return icons[this.skill.toLowerCase()] ?? 'psychology';
  }
}
