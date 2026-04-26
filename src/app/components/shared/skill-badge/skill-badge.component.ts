import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
  @Input({ required: true }) skill!: string;

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
