import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',pathMatch:'full',redirectTo:'home'
    },
    // Lazy loaded single component
    {
        path:'home',
        title:'Home',
        loadComponent:()=>import('./home/home')
        .then(c=>c.Home)
    },
    // Lazy loaded feature  with child routes
    {
        path:'products',
        loadChildren:()=>import('./products/products.routes')
        .then(c=>c.PRODUCT_ROUTES)
    },
    {
        path:'admin',
        loadChildren:()=>import('./admin/admin.routes')
        .then(c=>c.ADMIN_ROUTES)
    },
    // wildcard always at the end
    {
        path:'**',
        title:'Page Not Found',
        loadComponent:()=>import('./not-found/not-found')
        .then(c=>c.NotFound)
    }
    
];
