import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ICocktailMinimalDTO } from '../../shared/models/cocktail-minimal-dto.intarface';
import { CocktailsService } from '../../shared/services/cocktails-service';

@Component({
  selector: 'app-cocktail-details-page',
  imports: [RouterLink],
  templateUrl: './cocktail-details-page.html',
  styleUrl: './cocktail-details-page.scss',
})
export class CocktailDetailsPage implements OnInit {
  cocktailsService = inject(CocktailsService);
  destroyRef = inject(DestroyRef);
  activatedRoute = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  cocktailSignal = signal<ICocktailMinimalDTO | null>(null);

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.loadIngredientDetails(params['id']);
    });
  }

  loadIngredientDetails(id: string | number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.cocktailsService.getCocktailsDetails(id).subscribe((data) => {
      this.cocktailSignal.set(data);
    });
  }
}
