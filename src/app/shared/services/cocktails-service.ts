import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICocktailsFilter } from '../../pages/cocktails-page/cocktails-page';
import { ICocktailMinimalDTO } from '../models/cocktail-minimal-dto.intarface';
import { IPaginatedResponse } from '../models/generic/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class CocktailsService {
  http = inject(HttpClient);

  getCocktailsDetails(id: string | number): Observable<ICocktailMinimalDTO> {
    return this.http.get<ICocktailMinimalDTO>(`${environment.boozeApiPath}/cocktails/${id}`);
  }

  getCocktails(
    page: number,
    limit: number,
    filters: ICocktailsFilter,
    sort: string | null,
    type: 'common' | 'popular' | 'latest' = 'common',
  ): Observable<IPaginatedResponse<ICocktailMinimalDTO>> {
    const params: any = {
      page,
      limit,
    };

    const endpoint = type === 'common' ? '/cocktails' : `/cocktails/${type}`;

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== 'null') {
        params[key] = value.toString();
      }
    });

    if (sort) {
      params.sort = sort;
    }

    return this.http.get<IPaginatedResponse<ICocktailMinimalDTO>>(
      `${environment.boozeApiPath}${endpoint}`,
      { params },
    );
  }

  getAutocompleteOptions(q: string): Observable<IPaginatedResponse<ICocktailMinimalDTO>> {
    const params = {
      q,
      page: 1,
      limit: 10,
    };

    return this.http.get<IPaginatedResponse<ICocktailMinimalDTO>>(
      `${environment.boozeApiPath}/cocktails/autocomplete`,
      { params },
    );
  }
}
