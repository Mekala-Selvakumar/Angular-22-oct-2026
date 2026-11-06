import { Routes } from '@angular/router';
import { authGuardGuard } from './guards/auth-guard-guard';
import { adminMatchGuard } from './guards/admin-match-guard';
import { unsavedChangesGuard } from './guards/unsaved-changes-guard';
import { MsalGuard } from '@azure/msal-angular';
import { entraAdminGuard } from './guards/entra-admin-guard';

export const routes: Routes = [
      {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page')
        .then(m => m.LoginPage)
  },

  {
    path: 'products',

    loadComponent: () =>
      import('./pages/product-list-page/product-list-page')
        .then(m => m.ProductListPage),

    // canActivate: [authGuardGuard]
      canActivate: [MsalGuard],

  },

  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./pages/product-edit-page/product-edit-page')
        .then(m => m.ProductEditComponent),
    // canActivate: [authGuardGuard],
        canActivate: [MsalGuard],

    canDeactivate: [unsavedChangesGuard]
  },

  // Admin route - evaluated first
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/admin-reports-page/admin-reports-page')
        .then(m => m.AdminReportsPage),
    // canMatch: [adminMatchGuard]
    canMatch:[entraAdminGuard]
  },

  // Fallback route for normal users
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/access-denied-page/access-denied-page')
        .then(m => m.AccessDeniedPage),

    // canActivate: [authGuardGuard]
    canActivate: [MsalGuard]
  },

  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page')
        .then(m => m.HomePage),
    pathMatch: 'full'
  }

];
