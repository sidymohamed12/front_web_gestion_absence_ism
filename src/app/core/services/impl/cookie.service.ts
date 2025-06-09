import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  setCookie(
    name: string,
    value: string,
    days: number = 1,
    secure: boolean = true
  ): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    let cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;

    if (secure) {
      cookieString += '; Secure';
    }

    // SameSite pour la sécurité CSRF
    cookieString += '; SameSite=Lax';

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
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
  }

  cookieExists(name: string): boolean {
    return this.getCookie(name) !== null;
  }
}
