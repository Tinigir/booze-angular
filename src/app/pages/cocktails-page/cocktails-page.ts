import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { ICocktailMinimalDTO } from '../../shared/models/cocktail-minimal-dto.interface';
import { CocktailsService } from '../../shared/services/cocktails-service';

export interface ICocktailsFilter {
  glass_type: string;
  alcoholic: boolean | null;
  category_id: string;
}
@Component({
  selector: 'app-cocktails-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatSlideToggleModule,
    MatSelect,
    MatOption,
    MatLabel,
    MatFormField,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
  ],
  templateUrl: './cocktails-page.html',
  styleUrl: './cocktails-page.scss',
})
export class CocktailsPage implements OnInit {
  cocktailsService = inject(CocktailsService);
  destroyRef = inject(DestroyRef);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  cocktails: any[] = [];
  displayedColumns: string[] = [
    'image',
    'name',
    'glass_type',
    'alcoholic',
    'category',
    'ingredients',
  ];
  dataSource = new MatTableDataSource<any>([]);
  typeControl = new FormControl<'common' | 'popular' | 'latest'>('common');
  alcoholicControl = new FormControl<boolean | null>(null);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  cocktailsSignal = signal<ICocktailMinimalDTO[]>([]);

  pagination = {
    currentPage: 1,
    limit: 10,

    totalPages: 0,
    totalElements: 0,
  };

  filters: ICocktailsFilter = {
    glass_type: '',
    alcoholic: null,
    category_id: '',
  };

  sort: string | null = null;

  ngOnInit(): void {
    this.listenActivatedRouteChanges();
    this.listenAlcoholicControlChanges();
    this.listenTypeControlChanges();
  }

  listenTypeControlChanges(): void {
    this.typeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((type) => {
      this.resetPagination();
      this.updateQuerryParams('type', type);
    });
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

        if ('glass_type' in queryParams) {
          this.filters.glass_type = queryParams['glass_type'] || '';
        }

        if ('alcoholic' in queryParams) {
          this.alcoholicControl.setValue(queryParams['alcoholic'] || null);
          this.filters.alcoholic = queryParams['alcoholic'] || null;
        }

        if ('category_id' in queryParams) {
          this.filters.category_id = queryParams['category_id'] || '';
        }

        if ('type' in queryParams) {
          const type = queryParams['type'] || 'common';
          this.typeControl.setValue(type, { emitEvent: false });
        }
        this.loadCocktails();
      });
  }

  loadCocktails(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.cocktailsService
      .getCocktails(
        this.pagination.currentPage,
        this.pagination.limit,
        this.filters,
        this.sort,
        this.typeControl.value ?? 'common',
      )
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
        this.cocktailsSignal.set(ingredientsResponce.data);
        this.dataSource.data = ingredientsResponce.data;
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

  filterByGlassType(glassTypeId: string | number): void {
    this.filters.glass_type = glassTypeId.toString();
    this.resetPagination();
    this.updateQuerryParams('glass_type', glassTypeId.toString());
  }

  filterByCategory(category: string | number): void {
    this.filters.category_id = category.toString();
    this.resetPagination();
    this.updateQuerryParams('category_id', category.toString());
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
