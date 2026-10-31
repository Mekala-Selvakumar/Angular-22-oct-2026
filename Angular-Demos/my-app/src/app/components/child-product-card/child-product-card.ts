import { Component, input, output } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  imports: [],
  selector: 'app-child-product-card',
  styleUrl: './child-product-card.css',
  templateUrl: './child-product-card.html',
})
export class ChildProductCard {

  product = input.required<Product>();

    edit = output<number>();
    remove = output<number>();
}
