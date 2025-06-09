import { Injectable } from '@angular/core';
import {
  LoginRequestDTO,
  LoginResponse,
  Role,
} from '../../models/utilisateur.model';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = new BehaviorSubject<LoginResponse | null>(
    null
  );
  currentUser$ = this.currentUser.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(data: LoginRequestDTO): Observable<boolean> {
    return this.http
      .post<LoginResponse>('http://localhost:8080/api/auth/login', data, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => this.currentUser.next(res)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  logout(): void {
    this.http
      .post('http://localhost:8080/api/auth/logout', {
        withCredentials: true,
      })
      .subscribe(() => {
        this.currentUser.next(null);
        this.router.navigate(['/login']);
      });
  }

  autoLogin(): Observable<boolean> {
    return this.http
      .get<LoginResponse>('http://localhost:8080/api/auth/me', {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.currentUser.next(response);
        }),
        map(() => true),
        catchError((error) => {
          console.error('Auto-login failed:', error);
          this.currentUser.next(null);
          return of(false);
        })
      );
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUser.value;
  }

  hasRole(role: Role): boolean {
    return this.currentUser.value?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole(Role.ADMIN);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
