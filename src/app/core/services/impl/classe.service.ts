import { Observable } from 'rxjs';
import { Classe } from '../../models/Classe.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IClasseService } from '../IClasseService';

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
}
