import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  setCookie(
    name: string,
    value: string,
    days: number = 7,
    secure: boolean = true
  ): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    let cookieString = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires.toUTCString()}; path=/`;

    if (secure) {
      cookieString += '; secure';
    }

    // SameSite pour la sécurité CSRF
    cookieString += '; SameSite=Strict';

    document.cookie = cookieString;
  }

  getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=Strict`;
  }

  deleteAllCookies(): void {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      this.deleteCookie(name);
    }
  }
}
