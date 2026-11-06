import { Component, inject } from '@angular/core';
import { Authservice } from '../../services/authservice';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private authService=inject(Authservice)
  private router=inject(Router)
  logout(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
