import { Observable } from 'rxjs';
import { UtilisateurMobileDto } from '../models/utilisateur.model';

export interface IEtudiantService {
  getAllEtudians(): Observable<UtilisateurMobileDto[]>;
}
