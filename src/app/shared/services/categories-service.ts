import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICategory } from '../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  http = inject(HttpClient);

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${environment.boozeApiPath}/categories`);
  }
}
