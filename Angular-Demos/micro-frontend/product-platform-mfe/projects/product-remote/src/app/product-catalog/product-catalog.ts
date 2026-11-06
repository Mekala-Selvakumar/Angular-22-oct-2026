import { Component } from '@angular/core';


interface Product {
  id: number;
  name: string;
  price: number;
}


@Component({
  imports: [],
  selector: 'app-product-catalog',
  styleUrl: './product-catalog.css',
  templateUrl: './product-catalog.html',
})
export class ProductCatalog {

    products: Product[] = [

    {
      id: 101,
      name: 'Laptop',
      price: 55000
    },

    {
      id: 102,
      name: 'Mouse',
      price: 500
    },

    {
      id: 103,
      name: 'Keyboard',
      price: 1200
    }

  ];

  selectProduct(product: Product): void {

    window.dispatchEvent(

      new CustomEvent('product-selected', {

        detail: product

      })

    );

  }

}
