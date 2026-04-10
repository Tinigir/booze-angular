import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { MatFormField, MatOption, MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { IIngredientFullDTO } from '../../shared/models/ingredient-full-dto.intarface';
import { IngredientsService } from '../../shared/services/ingredients-service';

export interface IIndredientsFilters {
  type: string;
  alcoholic: boolean | null;
}

@Component({
  selector: 'app-indredients-page',
  imports: [ReactiveFormsModule, RouterLink, MatFormField, MatSelect, MatOption, MatAnchor],
  templateUrl: './ingredients-page.html',
  styleUrl: './ingredients-page.scss',
})
export class IngredientsPage implements OnInit {
  ingredientsService = inject(IngredientsService);
  destroyRef = inject(DestroyRef);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  readonly alcoholicFilterOptions = [
    { label: 'Unset', value: 'null' },
    { label: 'Alcoholic', value: 'true' },
    { label: 'Non-alcoholic', value: 'false' },
  ];

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  ingredientsSignal = signal<IIngredientFullDTO[]>([]);

  pagination = {
    currentPage: 1,
    limit: 10,

    totalPages: 0,
    totalElements: 0,
  };

  filters: IIndredientsFilters = {
    type: '',
    alcoholic: null,
  };

  sort: string | null = null;

  alcoholicControl = new FormControl<boolean | null>(null);

  ngOnInit(): void {
    this.listenActivatedRouteChanges();
    this.listenAlcoholicControlChanges();
  }

  listenActivatedRouteChanges(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParams) => {
        if ('page' in queryParams) {
          this.pagination.currentPage = +queryParams['page'] || 1;
        }

        if ('sort' in queryParams) {
          this.sort = queryParams['sort'] || null;
        }

        if ('type' in queryParams) {
          this.filters.type = queryParams['type'] || '';
        }

        if ('alcoholic' in queryParams) {
          this.alcoholicControl.setValue(queryParams['alcoholic'] || null);
          this.filters.alcoholic = queryParams['alcoholic'] || null;
        }
        this.loadIngredients();
      });
  }

  loadIngredients(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.ingredientsService
      .getIngredient(this.pagination.currentPage, this.pagination.limit, this.filters, this.sort)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        catchError((err) => {
          console.warn('Error:', err);
          this.errorMessage.set('Oopsss... We fucked up!');
          return of({
            data: [],
            pagination: {
              count: 0,
              pages: 0,
            },
          });
        }),
      )
      .subscribe((ingredientsResponce) => {
        this.ingredientsSignal.set(ingredientsResponce.data);
        this.pagination.totalElements = ingredientsResponce.pagination.count;
        this.pagination.totalPages = ingredientsResponce.pagination.pages;
      });
  }

  moveToNextPage(): void {
    this.pagination.currentPage = this.pagination.currentPage + 1;
    this.updateQuerryParams('page', this.pagination.currentPage.toString());
  }

  moveToPrewPage(): void {
    this.pagination.currentPage = this.pagination.currentPage - 1;
    this.updateQuerryParams('page', this.pagination.currentPage.toString());
  }

  filterByType(type: string): void {
    this.filters.type = type;
    this.resetPagination();
    this.updateQuerryParams('type', type);
  }

  setSort(sort: string | null): void {
    this.sort = sort;
    this.resetPagination();
    this.updateQuerryParams('sort', sort);
  }

  resetPagination(): void {
    this.pagination.currentPage = 1;
    this.updateQuerryParams('page', this.pagination.currentPage.toString());
  }

  listenAlcoholicControlChanges(): void {
    this.alcoholicControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((alcoholic) => {
        this.resetPagination();
        this.updateQuerryParams('alcoholic', alcoholic);
        this.filters.alcoholic = alcoholic;
      });
  }

  updateQuerryParams(key: string, value: string | boolean | null): void {
    const queryParams = { [key]: value };

    if (value == 'null' || !value) {
      queryParams[key] = null;
    }

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }
}
