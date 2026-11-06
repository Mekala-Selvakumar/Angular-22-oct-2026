import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guard/auth-guard';
import { Home } from './components/home/home';

export const routes: Routes = [
    {path:'login', component:Login},
    {path:'dashboard', component:Dashboard, canActivate:[authGuard]},
    {path:'home' ,component:Home},
    {path:'',redirectTo:'home',pathMatch:'full'}
];
