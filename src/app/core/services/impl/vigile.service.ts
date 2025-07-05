import { Injectable } from '@angular/core';
import { IVigileService } from '../IVigileService';
import { Observable } from 'rxjs';
import { UtilisateurMobileDto } from '../../models/utilisateur.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VigileService implements IVigileService {
  private readonly apiUrl =
    'https://backend-gestion-absence-ism-personnal.onrender.com/api/web/vigile';

  constructor(private readonly http: HttpClient) {}
  getAllVigiles(): Observable<UtilisateurMobileDto[]> {
    return this.http.get<UtilisateurMobileDto[]>(this.apiUrl);
  }
}
