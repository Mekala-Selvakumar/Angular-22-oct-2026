import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../services/authservice';

export const authGuard: CanActivateFn = (route, state) => {
  const authSerive =inject(Authservice)
  const router =inject(Router)
  if (authSerive.checkLogin()){
    return true;
  }
  // return  router.navigate(['/login'])
  // return false;
  return  router.createUrlTree(['/login']);
};
