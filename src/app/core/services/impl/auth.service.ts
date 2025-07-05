import { Injectable } from '@angular/core';
import {
  LoginRequestDTO,
  LoginResponse,
  Role,
} from '../../models/utilisateur.model';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = new BehaviorSubject<LoginResponse | null>(
    CookieService.getUserFromCookie()
  );
  currentUser$ = this.currentUser.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(data: LoginRequestDTO): Observable<boolean> {
    return this.http
      .post<LoginResponse>(
        'https://backend-gestion-absence-ism-personnal.onrender.com/api/auth/login',
        data,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((res) => {
          this.currentUser.next(res);
          CookieService.setCookie('currentUser', res.utilisateur);
          CookieService.setCookie('roleUser', res.role);
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }

  logout(): void {
    this.http
      .post(
        'https://backend-gestion-absence-ism-personnal.onrender.com/api/auth/logout',
        {
          withCredentials: true,
        }
      )
      .subscribe(() => {
        this.currentUser.next(null);
        CookieService.deleteCookie('currentUser');
        CookieService.deleteCookie('roleUser');
        this.router.navigate(['/login']);
      });
  }

  autoLogin(): Observable<boolean> {
    return this.http
      .get<LoginResponse>(
        'https://backend-gestion-absence-ism-personnal.onrender.com/api/auth/me',
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((response) => {
          this.currentUser.next(response);
          CookieService.setCookie('currentUser', response.utilisateur);
          CookieService.setCookie('roleUser', response.role);
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
