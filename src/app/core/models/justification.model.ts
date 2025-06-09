export interface Justification {
  id: string;
  description: string;
  documentPath: string;
  statut: StatutJustification;
  createdAt?: Date;
  coursNom: string;
  jourCours: string;
  absenceId: string;
}

export interface JustificationForDetailAbsence {
  id: string;
  description: string;
  documentPath: string;
  statut: StatutJustification;
  createdAt?: Date;
  dateValidation?: Date;
  prenomValidateur: string;
  nomValidateur: string;
}

export interface JustificationTraitementRequest {
  justificationId: string;
  statut: StatutJustification;
  adminValidateurId: string;
}

export enum StatutJustification {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE',
}
