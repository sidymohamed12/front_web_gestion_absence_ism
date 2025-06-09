import { Observable } from 'rxjs';
import { Classe } from '../models/Classe.model';

export interface IClasseService {
  getAllClasses(): Observable<Classe[]>;
}
