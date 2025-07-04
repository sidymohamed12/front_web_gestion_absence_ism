import { Injectable } from '@angular/core';
import { IJustificationService } from '../IJustificationService';
import { catchError, Observable, throwError } from 'rxjs';
import {
  JustificationTraitementRequest,
  Justification,
} from '../../models/justification.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class JustificationService implements IJustificationService {
  private readonly apiUrl =
    'https://ism-absences-api.onrender.com/api/web/justification';
  constructor(private readonly http: HttpClient) {}

  traiterJustification(
    request: JustificationTraitementRequest
  ): Observable<Justification> {
    return this.http
      .patch<Justification>(
        `${this.apiUrl}/${request.justificationId}`,
        request
      )
      .pipe(
        catchError((error) => {
          console.error('Error processing justification:', error);
          return throwError(() => error);
        })
      );
  }
}
