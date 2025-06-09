import { Observable } from 'rxjs';
import { Absence, AbsenceDetail } from '../models/absence.model';

export interface IAbsenceService {
  getAbsence(): Observable<Absence[]>;
  getAbsenceDetail(id: string): Observable<AbsenceDetail>;
}
