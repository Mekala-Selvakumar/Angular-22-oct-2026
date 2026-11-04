import { Routes } from "@angular/router";

export const ADMIN_ROUTES:Routes = [
    {
        path:'',
        title:'Admin Dashboard',
        loadComponent:()=>import('./admin-dashboard/admin-dashboard')
        .then(c=>c.AdminDashboard),
    }
]