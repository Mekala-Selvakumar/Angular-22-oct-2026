import { loadRemoteModule } from '@angular-architects/native-federation';
import { Type } from '@angular/core';
import { Routes } from '@angular/router';

export const routes: Routes = [
   {
    path: '',loadComponent: () =>
      import('./home/home')
        .then(m => m.Home)
  },

  {
    path: 'products',loadComponent: () =>
      loadRemoteModule<{
        ProductCatalog: Type<unknown>
      }>({
        remoteName: 'product-remote',
       exposedModule: './ProductCatalog'
      })  .then(m => m.ProductCatalog)

  },

  {
    path: '**',   redirectTo: ''

  }

];
