import { Component, effect, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-demo',
  styleUrl: './demo.css',
  templateUrl: './demo.html',
})
export class Demo {
      searchTerm = signal('');

    constructor() {
        effect(() => {
            console.log('Search term changed:', this.searchTerm());
        });
    }

    setSearchTerm(value: string): void {
        this.searchTerm.set(value);
    }

}
