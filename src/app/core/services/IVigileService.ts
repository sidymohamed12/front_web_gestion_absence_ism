import { Observable } from 'rxjs';
import { UtilisateurMobileDto } from '../models/utilisateur.model';

export interface IVigileService {
  getAllVigiles(): Observable<UtilisateurMobileDto[]>;
}
