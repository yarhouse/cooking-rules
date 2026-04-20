import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { BrowseComponent } from './components/browse/browse.component';
import { CookingComponent } from './components/cooking/cooking.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { HarvestingComponent } from './components/harvesting/harvesting.component';
import { CraftingComponent } from './components/crafting/crafting.component';
import { RulesComponent } from './components/rules/rules.component';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'cooking', component: CookingComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'harvesting', component: HarvestingComponent },
  { path: 'crafting', component: CraftingComponent },
  { path: 'rules', component: RulesComponent },
];
