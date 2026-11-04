import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
 
@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-second-view',
  styleUrl: './second-view.css',
  templateUrl: './second-view.html',
})
export class SecondView {}
