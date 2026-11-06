import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const entraAdminGuard: CanMatchFn = (route, segments) => {
  const msalService=inject(MsalService)
  const router =inject(Router)
  const account=msalService.instance.getActiveAccount()?? msalService.instance.getAllAccounts()[0];
  if (!account){
    return true;
  }
  const claims = account.idTokenClaims as Record<string,unknown> | undefined;
  const roles=claims?.['roles'];
  const isAdmin=Array.isArray(roles) && roles.includes('ProductAdmin');
  if (isAdmin){
    return true;
  }
  return false;
};
