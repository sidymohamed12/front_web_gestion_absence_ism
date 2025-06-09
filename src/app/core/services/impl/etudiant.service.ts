import { Injectable } from '@angular/core';
import { IEtudiantService } from '../IEtudiantService';
import { Observable } from 'rxjs';
import { UtilisateurMobileDto } from '../../models/utilisateur.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService implements IEtudiantService {
  private readonly apiUrl = 'http://localhost:8080/api/web/etudiants';

  constructor(private readonly http: HttpClient) {}
  getAllEtudians(): Observable<UtilisateurMobileDto[]> {
    return this.http.get<UtilisateurMobileDto[]>(this.apiUrl);
  }
}
