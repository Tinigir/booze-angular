import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IGlassType } from '../models/glass-type.interface';

@Injectable({
  providedIn: null,
})
export class GlassTypeService {
  http = inject(HttpClient);

  getGlassTypes(): Observable<IGlassType[]> {
    return this.http.get<IGlassType[]>(`${environment.boozeApiPath}/glasses`);
  }
}
