import {
  JustificationForDetailAbsence,
  StatutJustification,
} from './justification.model';

export interface PaginatedAbsences {
  totalItems: number;
  pages: number[];
  last: boolean;
  totalPages: number;
  type: string;
  currentPage: number;
  results: Absence[];
  first: boolean;
  status: string;
}

export interface Absence {
  id: string;
  createdAt: Date;
  type: TypeAbsence;
  heurePointage?: Date;
  heureDebut: Date;
  minutesRetard?: number;
  statutJustification: StatutJustification;
  etudiantNom: string;
  etudiantPrenom: string;
  etudiantMatricule: string;
  nomCours: string;
  salle: string;
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

export interface StatAbsence {
  totalAbsence: number;
  totalRetard: number;
  totalAbsenceRetard: number;
  totalJustifie: number;
  totalNonJustifie: number;
  totalTraite: number;
}
