import { Component, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ChildProductCard } from '../child-product-card/child-product-card';

@Component({
  imports: [ChildProductCard],
  selector: 'app-parent-product-list',
  styleUrl: './parent-product-list.css',
  templateUrl: './parent-product-list.html',
})
export class ParentProductList {

      products = signal<Product[]>([
        {
            id: 101,
            name: 'Laptop',
            price: 65000,
            stockQuantity: 12
        },
        {
            id: 102,
            name: 'Keyboard',
            price: 1500,
            stockQuantity: 40
        },
        {
            id: 103,
            name: 'Monitor',
            price: 12000,
            stockQuantity: 8
        }
    ]);

    editProduct(productId: number): void {
        console.log('Edit product:', productId);
    }

    deleteProduct(productId: number): void {
        this.products.update(products =>
            products.filter(product => product.id !== productId)
        );
    }

}
