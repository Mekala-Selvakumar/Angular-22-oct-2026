import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminMatchGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  if (!authService.isAuthenticated()) {

    return router.createUrlTree(['/login']);

  }

  return authService.hasRole('ADMIN');

};
