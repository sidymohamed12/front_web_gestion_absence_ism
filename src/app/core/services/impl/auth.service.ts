import { Injectable } from '@angular/core';
import {
  LoginRequestDTO,
  LoginResponse,
  Role,
} from '../../models/utilisateur.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser?: LoginResponse;

  constructor(private readonly http: HttpClient) {}

  login(data: LoginRequestDTO): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        'https://ism-absences-api.onrender.com/api/web/auth/login',
        data
      )
      .pipe(
        tap((response) => {
          this.storeAuthData(response);
          this.currentUser = response;
        })
      );
  }

  private storeAuthData(authData: LoginResponse) {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.utilisateur));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  logout(): Observable<any> {
    this.clearAuthData();
    this.currentUser = undefined;
    return this.http.post(
      'https://ism-absences-api.onrender.com/api/web/auth/logout',
      {}
    );
  }

  autoLogin() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUser = {
        token: token,
        type: 'Bearer',
        utilisateur: JSON.parse(user),
        userId: JSON.parse(user).id,
        role: JSON.parse(user).role as Role,
        redirectEndpoint: '',
        realId: '',
      };
      return true;
    }
    return false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setCurrentUser(user: LoginResponse) {
    this.currentUser = user;
  }

  getCurrentUser(): LoginResponse | undefined {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getRole(): string | undefined {
    return this.currentUser?.role;
  }
}
