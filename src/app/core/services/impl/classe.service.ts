import { Observable } from 'rxjs';
import { Classe } from '../../models/Classe.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IClasseService } from '../IClasseService';
import { EtudiantListDto } from '../../models/utilisateur.model';

@Injectable({
  providedIn: 'root',
})
export class ClasseService implements IClasseService {
  private readonly apiUrl = 'http://localhost:8080/api/web';
  constructor(private readonly http: HttpClient) {}

  // récupérer tous les absences
  getAllClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl + '/classes');
  }

  // Récupérer une classe par son ID
  getClasseById(id: string): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/classes/${id}`);
  }

  // Récupérer tous les étudiants d'une classe
  getEtudiantsByClasseId(classeId: string): Observable<EtudiantListDto[]> {
    return this.http.get<EtudiantListDto[]>(
      `${this.apiUrl}/classes/${classeId}/etudiants`
    );
  }
}
