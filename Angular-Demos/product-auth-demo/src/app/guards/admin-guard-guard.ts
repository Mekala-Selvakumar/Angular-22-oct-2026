import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  if (authService.hasRole('ADMIN')) {

    return true;

  }

  return router.createUrlTree(['/access-denied']);

};
