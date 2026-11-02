import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-inventory-summary',
  styleUrl: './inventory-summary.css',
  templateUrl: './inventory-summary.html',
})
export class InventorySummary {
      protected readonly productService = inject(ProductService);

}
