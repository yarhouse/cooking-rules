import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { BrowseComponent } from './components/browse/browse.component';
import { RecipeBuilderComponent } from './components/recipe-builder/recipe-builder.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { RulesComponent } from './components/rules/rules.component';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'builder', component: RecipeBuilderComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'rules', component: RulesComponent },
];
