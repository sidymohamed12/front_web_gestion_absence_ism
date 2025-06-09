import {
  JustificationForDetailAbsence,
  StatutJustification,
} from './justification.model';

export interface Absence {
  id: string;
  createdAt: Date;
  type: TypeAbsence;
  heurePointage?: Date;
  minutesRetard?: number;
  justification: StatutJustification;
  etudiantNom: string;
  etudiantPrenom: string;
  etudiantMatricule: string;
  coursNom: string;
  salleNom: string;
  coursJour: string;
}

export interface AbsenceDetail {
  absence: Absence;
  justification: JustificationForDetailAbsence;
}

export enum TypeAbsence {
  ABSENCE_COMPLETE = 'ABSENCE_COMPLETE',
  RETARD = 'RETARD',
}

export interface ApiResponse<T> {
  results: T[];
  status: string;
  type: string;
}
