import { CurrencyPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LowStock } from '../../low-stock';
 
// interface Product {
//     id: number;
//     name: string;
//     price: number;
// }

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stockQuantity: number;
}


@Component({
  imports: [        FormsModule,
        CurrencyPipe,
        NgClass,
        LowStock
],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
    // searchTerm = '';
    //   products: Product[] = [
    //     { id: 101, name: 'Laptop', price: 65000 },
    //     { id: 102, name: 'Keyboard', price: 1500 }
    // ];
    // deleteProduct(productId: number): void {
    //     this.products = this.products.filter(
    //         product => product.id !== productId
    //     );
    // }
    searchTerm = '';
    selectedCategory = 'ALL';
    showLowStockOnly = false;

    products: Product[] = [
        {
            id: 101,
            name: 'Laptop',
            category: 'Electronics',
            price: 65000,
            stockQuantity: 12
        },
        {
            id: 102,
            name: 'Keyboard',
            category: 'Accessories',
            price: 1500,
            stockQuantity: 4
        },
        {
            id: 103,
            name: 'Monitor',
            category: 'Electronics',
            price: 12000,
            stockQuantity: 0
        },
        {
            id: 104,
            name: 'Mouse',
            category: 'Accessories',
            price: 800,
            stockQuantity: 25
        },
        {
            id: 105,
            name: 'Office Chair',
            category: 'Office',
            price: 8500,
            stockQuantity: 3
        }
    ];

    get filteredProducts(): Product[] {
        const query = this.searchTerm.trim().toLowerCase();

        return this.products.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(query);

            const matchesCategory =
                this.selectedCategory === 'ALL' ||
                product.category === this.selectedCategory;

            const matchesStock =
                !this.showLowStockOnly ||
                product.stockQuantity <= 5;

            return matchesSearch &&
                matchesCategory &&
                matchesStock;
        });
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.selectedCategory = 'ALL';
        this.showLowStockOnly = false;
    }

    deleteProduct(productId: number): void {
        this.products = this.products.filter(
            product => product.id !== productId
        );
    }


}
