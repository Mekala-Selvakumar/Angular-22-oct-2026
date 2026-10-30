import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductSignalDemo } from './components/product-signal-demo/product-signal-demo';

@Component({
  imports: [RouterOutlet, ProductSignalDemo],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('productapp');
}
