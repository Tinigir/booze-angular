import { Routes } from '@angular/router';
import { AutocompletesPage } from './pages/autocompletes-page/autocompletes-page';
import { CategoriesPage } from './pages/categories-page/categories-page';
import { CocktailDetailsPage } from './pages/cocktail-details-page/cocktail-details-page';
import { CocktailsPage } from './pages/cocktails-page/cocktails-page';
import { GlassTypePage } from './pages/glass-type-page/glass-type-page';
import { IngredientDetailsPage } from './pages/ingredient-details-page/ingredient-details-page';
import { IngredientsPage } from './pages/ingredients-page/ingredients-page';

export const routes: Routes = [
  { path: '', component: GlassTypePage },
  { path: 'categories', component: CategoriesPage },
  { path: 'cocktails', component: CocktailsPage },
  { path: 'cocktails/:id', component: CocktailDetailsPage },
  { path: 'ingredients', component: IngredientsPage },
  { path: 'ingredients/:id', component: IngredientDetailsPage },
  { path: 'autocompelete', component: AutocompletesPage },
];
