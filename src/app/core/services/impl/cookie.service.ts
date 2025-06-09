import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  /**
   * Définir un cookie
   * @param name - Nom du cookie
   * @param value - Valeur du cookie
   * @param days - Nombre de jours d'expiration (optionnel)
   * @param path - Chemin du cookie (par défaut '/')
   * @param secure - Cookie sécurisé (HTTPS uniquement)
   * @param sameSite - Politique SameSite
   */
  setCookie(
    name: string,
    value: string,
    days?: number,
    path: string = '/',
    secure: boolean = false,
    sameSite: 'Strict' | 'Lax' | 'None' = 'Lax'
  ): void {
    let expires = '';

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }

    const secureFlag = secure ? '; Secure' : '';
    const sameSiteFlag = `; SameSite=${sameSite}`;

    document.cookie = `${name}=${encodeURIComponent(
      value
    )}${expires}; path=${path}${secureFlag}${sameSiteFlag}`;
  }

  /**
   * Récupérer un cookie
   * @param name - Nom du cookie
   * @returns La valeur du cookie ou null si non trouvé
   */
  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      if (cookie.trim().startsWith(nameEQ)) {
        return decodeURIComponent(cookie.trim().substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Supprimer un cookie
   * @param name - Nom du cookie
   * @param path - Chemin du cookie (par défaut '/')
   */
  deleteCookie(name: string, path: string = '/'): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  }

  /**
   * Vérifier si un cookie existe
   * @param name - Nom du cookie
   * @returns true si le cookie existe
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Récupérer tous les cookies
   * @returns Un objet avec tous les cookies
   */
  getAllCookies(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const cookieArray = document.cookie.split(';');

    for (let cookie of cookieArray) {
      const trimmedCookie = cookie.trim();
      const [name, value] = trimmedCookie.split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    }
    return cookies;
  }
}
