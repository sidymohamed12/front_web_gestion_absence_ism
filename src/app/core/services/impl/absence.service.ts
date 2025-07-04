import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  AbsenceDetail,
  PaginatedAbsences,
  StatAbsence,
  TypeAbsence,
} from '../../models/absence.model';
import { IAbsenceService } from '../IAbsenceService';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService implements IAbsenceService {
  private readonly apiUrl =
    'https://ism-absences-api.onrender.com/api/web/absences';
  constructor(private readonly http: HttpClient) {}

  // récupérer tous les absences
  getAbsence(
    page: number = 0,
    typeAbsence?: TypeAbsence | string,
    date?: Date
  ): Observable<PaginatedAbsences> {
    let params = new HttpParams().set('page', page.toString());

    if (typeAbsence) {
      params = params.set('typeAbsence', typeAbsence);
    }
    if (date) {
      params = params.set('date', date.toISOString().split('T')[0]); // Format YYYY-MM-DD
    }
    return this.http.get<PaginatedAbsences>(`${this.apiUrl}/annee-active`, {
      params,
    });
  }

  getAbsenceDetail(id: string): Observable<AbsenceDetail> {
    return this.http.get<AbsenceDetail>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching absence detail:', error);
        return throwError(() => error);
      })
    );
  }

  getStatAbsence(): Observable<StatAbsence> {
    return this.http.get<StatAbsence>(`${this.apiUrl}/stat`).pipe(
      catchError((error) => {
        console.error('Error fetching Satat absence:', error);
        return throwError(() => error);
      })
    );
  }
}
