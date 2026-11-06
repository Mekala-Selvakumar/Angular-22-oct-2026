import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
   protected readonly title = signal('shell');
    selectedProduct = signal<{
    id: number;
    name: string;
    price: number;
  } | null>(null);

  private eventHandler = (event: Event) => {

    const customEvent = event as CustomEvent<{
      id: number;
      name: string;
      price: number;
    }>;

    this.selectedProduct.set(customEvent.detail);

  };

  ngOnInit(): void {

    window.addEventListener(
      'product-selected',
      this.eventHandler
    );

  }

  ngOnDestroy(): void {

    window.removeEventListener(
      'product-selected',
      this.eventHandler
    );

  }

}
