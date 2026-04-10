import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, switchMap } from 'rxjs';
import { CocktailsService } from '../../shared/services/cocktails-service';
import { IngredientsService } from '../../shared/services/ingredients-service';

@Component({
  selector: 'app-autocompletes-page',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocomplete,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './autocompletes-page.html',
  styleUrl: './autocompletes-page.scss',
})
export class AutocompletesPage implements OnInit {
  destroyRef = inject(DestroyRef);
  cocktailsService = inject(CocktailsService);
  ingredientsServise = inject(IngredientsService);

  ingredientsFilteredOptions = signal<string[]>([]);
  cocktailFilteredOptions = signal<string[]>([]);

  ingredientsSearchControl = new FormControl<string | null>(null);
  cocktailsSearchControl = new FormControl<string | null>(null);

  ngOnInit(): void {
    this.listenCocktailsSearchControlChanges();
    this.listenIngredientsSearchControlChanges();
  }

  listenIngredientsSearchControlChanges(): void {
    this.ingredientsSearchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(200),
        switchMap((searchIngredient) => {
          return this.ingredientsServise.getAutocompleteIngredientsOptions(searchIngredient ?? '');
        }),
      )
      .subscribe((ingredientsResponce) => {
        this.ingredientsFilteredOptions.set(
          ingredientsResponce.data.map((ingredient) => {
            return ingredient.name;
          }),
        );
      });
  }

  listenCocktailsSearchControlChanges(): void {
    this.cocktailsSearchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(200),
        switchMap((search) => {
          return this.cocktailsService.getAutocompleteOptions(search ?? '');
        }),
      )
      .subscribe((cocktailsResponse) => {
        this.cocktailFilteredOptions.set(
          cocktailsResponse.data.map((cocktail) => {
            return cocktail.name;
          }),
        );
      });
  }
}
