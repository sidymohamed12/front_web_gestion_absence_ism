import { Injectable } from '@angular/core';
import { LoginResponse } from '../../models/utilisateur.model';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  static setCookie(
    name: string,
    value: object | string | number,
    days: number = 1
  ): void {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    const stringValue = encodeURIComponent(JSON.stringify(value));
    document.cookie = `${name}=${stringValue}; expires=${expires}; path=/`;
  }

  static getCookie(name: string): string | null {
    const regex = new RegExp('(^| )' + name + '=([^;]+)');
    const match = regex.exec(document.cookie);
    return match ? decodeURIComponent(match[2]) : null;
  }

  static deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  static getUserFromCookie(): LoginResponse | null {
    const userJson = CookieService.getCookie('currentUser');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  cookieExists(name: string): boolean {
    return CookieService.getCookie(name) !== null;
  }
}
