import { Injectable } from '@angular/core';
import { IEtudiantService } from '../IEtudiantService';
import { catchError, Observable, throwError } from 'rxjs';
import { UtilisateurMobileDto } from '../../models/utilisateur.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService implements IEtudiantService {
  private readonly apiUrl =
    'https://ism-absences-api.onrender.com/api/web/etudiants';

  constructor(private readonly http: HttpClient) {}
  getAllEtudians(): Observable<UtilisateurMobileDto[]> {
    return this.http.get<UtilisateurMobileDto[]>(this.apiUrl);
  }

  getDetailEtudiant(id: string): Observable<UtilisateurMobileDto> {
    return this.http.get<UtilisateurMobileDto>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching absence detail:', error);
        return throwError(() => error);
      })
    );
  }
}
