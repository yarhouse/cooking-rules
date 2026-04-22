import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { BrowseComponent } from './components/browse/browse.component';
import { CookingComponent } from './components/cooking/cooking.component';
import { CookSessionComponent } from './components/cook-session/cook-session.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { HarvestSessionComponent } from './components/harvest-session/harvest-session.component';
import { CraftingComponent } from './components/crafting/crafting.component';
import { RulesComponent } from './components/rules/rules.component';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'cooking', component: CookingComponent },
  { path: 'cook-session', component: CookSessionComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'harvest', component: HarvestSessionComponent },
  { path: 'harvesting', redirectTo: 'harvest', pathMatch: 'full' },
  { path: 'harvest-session', redirectTo: 'harvest', pathMatch: 'full' },
  { path: 'crafting', component: CraftingComponent },
  { path: 'rules', component: RulesComponent },
];
