import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../models/category.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  http = inject(HttpClient);

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${environment.boozeApiPath}/categories`);
  }
}
