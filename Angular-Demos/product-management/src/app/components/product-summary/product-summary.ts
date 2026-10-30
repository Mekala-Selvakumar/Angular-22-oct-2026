import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-product-summary',
  styleUrl: './product-summary.css',
  templateUrl: './product-summary.html',
})
export class ProductSummary {
    productName = 'Laptop';
    category = 'Electronics';
    price = 65000;
     stockQuantity = 12;
         stockInHand = 0;
    isUnavailable = false;

}
