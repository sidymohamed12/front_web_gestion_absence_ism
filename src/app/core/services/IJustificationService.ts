import { Observable } from 'rxjs';
import {
  Justification,
  JustificationTraitementRequest,
} from '../models/justification.model';

export interface IJustificationService {
  traiterJustification(
    request: JustificationTraitementRequest
  ): Observable<Justification>;
}
