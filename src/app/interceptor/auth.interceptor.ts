import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../core/services/impl/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('AuthInterceptor instantiated'); // Debug log
  console.log('Intercepting request to:', req.url); // Debug log

  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Token found:', token ? 'YES' : 'NO'); // Debug log
  console.log('Token value:', token); // Debug log (remove in production)

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    console.log(
      'Authorization header added:',
      authReq.headers.get('Authorization')
    ); // Debug log
    return next(authReq);
  }

  console.log('No token, proceeding without Authorization header'); // Debug log
  return next(req);
};
