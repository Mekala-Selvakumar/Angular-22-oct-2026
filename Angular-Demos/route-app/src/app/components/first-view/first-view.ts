import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
  
@Component({
  imports: [RouterOutlet,RouterLink],
  selector: 'app-first-view',
  styleUrl: './first-view.css',
  templateUrl: './first-view.html',
})
export class FirstView {}
