import { Component, OnInit, inject, signal } from '@angular/core';
import { CategoriesService } from '../../shared/services/categories-service';
import { ICategory } from '../../shared/models/category.interface';
import { catchError, finalize, of } from 'rxjs';
import { MatList, MatListItem } from "@angular/material/list";

@Component({
  selector: 'app-categories-page',
  imports: [MatList, MatListItem],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage implements OnInit {
  categoriesService = inject(CategoriesService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  categoriesSignal = signal<ICategory[]>([]);

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.categoriesService
      .getCategories()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        catchError((err) => {
          console.log('Error:', err);
          this.errorMessage.set('Oopsss... We fucked up!');
          return of([]);
        })
      )
      .subscribe((categories) => {
        this.categoriesSignal.set(categories);
      });
  }
}
