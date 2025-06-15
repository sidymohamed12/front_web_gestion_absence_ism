import { Observable } from 'rxjs';
import {
  AbsenceDetail,
  PaginatedAbsences,
  TypeAbsence,
} from '../models/absence.model';

export interface IAbsenceService {
  getAbsence(
    page: number,
    typeAbsence?: TypeAbsence | string,
    date?: Date
  ): Observable<PaginatedAbsences>;
  getAbsenceDetail(id: string): Observable<AbsenceDetail>;
}
