import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaginatedResponse } from '../models/generic/pagination.interface';
import { IIngredientFullDTO } from '../models/ingredient-full-dto.intarface';
import { environment } from '../../../environments/environment';
import { IIndredientsFilters } from '../../pages/ingredients-page/ingredients-page';
import { ICocktailMinimalDTO } from '../models/cocktail-minimal-dto.intarface';

@Injectable({
  providedIn: 'root',
})
export class IngredientsService {
  http = inject(HttpClient);

  getIngredientDetails(id: string | number): Observable<IIngredientFullDTO> {
    return this.http.get<IIngredientFullDTO>(`${environment.boozeApiPath}/ingredients/${id}`);
  }

  getIngredient(
    page: number,
    limit: number,
    filters: IIndredientsFilters,
    sort: string | null,
  ): Observable<IPaginatedResponse<IIngredientFullDTO>> {
    const params: any = {
      page,
      limit,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== 'null') {
        params[key] = value.toString();
      }
    });

    if (sort) {
      params.sort = sort;
    }

    return this.http.get<IPaginatedResponse<IIngredientFullDTO>>(
      `${environment.boozeApiPath}/ingredients`,
      { params },
    );
  }

  getAutocompleteIngredientsOptions(q: string): Observable<IPaginatedResponse<IIngredientFullDTO>> {
    const params = {
      q,
      page: 1,
      limit: 10,
    };

    return this.http.get<IPaginatedResponse<IIngredientFullDTO>>(
      `${environment.boozeApiPath}/ingredients/autocomplete`,
      { params },
    );
  }
}
