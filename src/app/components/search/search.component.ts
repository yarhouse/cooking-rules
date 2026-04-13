import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CookingDataService, SearchResults } from '../../services/cooking-data.service';
import { MonsterCardComponent } from '../shared/monster-card/monster-card.component';
import { RecipeCardComponent } from '../shared/recipe-card/recipe-card.component';
import { IngredientCardComponent } from '../shared/ingredient-card/ingredient-card.component';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MonsterCardComponent,
    RecipeCardComponent,
    IngredientCardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private dataService = inject(CookingDataService);

  query = signal('');
  results = signal<SearchResults>({ monsters: [], recipes: [], ingredients: [] });
  hasSearched = signal(false);

  onSearch(value: string): void {
    this.query.set(value);
    if (value.trim().length >= 2) {
      this.results.set(this.dataService.search(value));
      this.hasSearched.set(true);
    } else {
      this.results.set({ monsters: [], recipes: [], ingredients: [] });
      this.hasSearched.set(false);
    }
  }

  get hasResults(): boolean {
    const r = this.results();
    return r.monsters.length > 0 || r.recipes.length > 0 || r.ingredients.length > 0;
  }
}
