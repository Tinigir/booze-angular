import { Component, OnInit, inject, signal } from '@angular/core';
import { MatListItem, MatListModule } from "@angular/material/list";
import { catchError, finalize, of } from 'rxjs';
import { IGlassType } from '../../shared/models/glass-type.interface';
import { GlassTypeService } from '../../shared/services/glass-type-service';

@Component({
  selector: 'app-glass-type-page',
  standalone: true,
  imports: [MatListModule, MatListItem],
  templateUrl: './glass-type-page.html',
  styleUrl: './glass-type-page.scss',
  providers: [GlassTypeService],
})
export class GlassTypePage implements OnInit {
  glassTypeService = inject(GlassTypeService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  glassTypesSignal = signal<IGlassType[]>([]);

  ngOnInit(): void {
    this.loadGlassTypes();
  }

  loadGlassTypes(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.glassTypeService
      .getGlassTypes()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        catchError((err) => {
          console.log('Error:', err);
          this.errorMessage.set('Oopsss... We fucked up!');
          return of([]);
        })
      )
      .subscribe((glassTypes) => {
        this.glassTypesSignal.set(glassTypes);
      });
  }
}
