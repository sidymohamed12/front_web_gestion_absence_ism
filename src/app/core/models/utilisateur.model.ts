import { Absence } from './absence.model';

export enum Role {
  ADMIN = 'ADMIN',
  ETUDIANT = 'ETUDIANT',
  VIGILE = 'VIGILE',
}

export interface Admin {
  departement: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role.ADMIN;
}

export interface Etudiant {
  matricule: string;
  nom: string;
  prenom: string;
  classe: string;
}

export interface Vigile {
  badge: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role.VIGILE;
}

export interface UtilisateurMobileDto {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  matricule?: string;
  classe?: string;
  absences?: Absence[];
  departement?: string;
  badge?: string;
}

export interface LoginRequestDTO {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  utilisateur: UtilisateurMobileDto;
  userId: string;
  role: Role;
  redirectEndpoint: string;
  token: string;
  type: string;
  realId: string;
}

export interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}
