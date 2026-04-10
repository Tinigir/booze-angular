import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ICocktailMinimalDTO } from '../../shared/models/cocktail-minimal-dto.interface';
import { IIngredientFullDTO } from '../../shared/models/ingredient-full-dto.interface';
import { CocktailsService } from '../../shared/services/cocktails-service';
import { IngredientsService } from '../../shared/services/ingredients-service';

@Component({
  selector: 'app-ingredient-details-page',
  imports: [],
  templateUrl: './ingredient-details-page.html',
  styleUrl: './ingredient-details-page.scss',
})
export class IngredientDetailsPage implements OnInit {
  ingredientsService = inject(IngredientsService);
  cocktailsService = inject(CocktailsService);
  destroyRef = inject(DestroyRef);
  activatedRoute = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  ingredientDetailsSignal = signal<IIngredientFullDTO | null>(null);
  cocktailsSignal = signal<ICocktailMinimalDTO[]>([]);

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.loadIngredientDetails(params['id']);
    });
  }

  loadIngredientDetails(id: string | number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.ingredientsService.getIngredientDetails(id).subscribe((data) => {
      this.ingredientDetailsSignal.set(data);
    });
  }
}
