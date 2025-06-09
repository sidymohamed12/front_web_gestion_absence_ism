import { Injectable } from '@angular/core';
import {
  LoginRequestDTO,
  LoginResponse,
  Role,
  UtilisateurMobileDto,
} from '../../models/utilisateur.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser?: LoginResponse;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(data: LoginRequestDTO): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:8080/api/auth/login', data)
      .pipe(
        tap((response) => {
          this.storeAuthData(response);
          this.currentUser = response;
        })
      );
  }

  logout(): void {
    this.clearAuthData();
    this.currentUser = undefined;
    this.router.navigate(['/login']);
  }

  // Méthode manquante : récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Méthode manquante : vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Vérifier si le token n'est pas expiré
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  // Méthode manquante : tentative de connexion automatique
  autoLogin(): boolean {
    const token = this.getToken();
    const userData = localStorage.getItem('user');

    if (token && userData && this.isLoggedIn()) {
      try {
        const user: UtilisateurMobileDto = JSON.parse(userData);
        this.currentUser = {
          token,
          utilisateur: user,
          userId: user.id,
          role: user.role,
          redirectEndpoint: '',
          type: 'Bearer',
          realId: user.id,
        };
        return true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuthData();
        return false;
      }
    }

    this.clearAuthData();
    return false;
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(): LoginResponse | undefined {
    return this.currentUser;
  }

  // Récupérer les données utilisateur depuis localStorage
  getUserData(): UtilisateurMobileDto | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: Role): boolean {
    const user = this.getUserData();
    return user?.role === role;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.hasRole(Role.ADMIN);
  }

  private storeAuthData(authData: LoginResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.utilisateur));
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
