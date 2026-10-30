import { Component, computed, effect, signal } from '@angular/core';
import { Product } from '../../models/Product';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-product-signal-demo',
  styleUrl: './product-signal-demo.css',
  templateUrl: './product-signal-demo.html',
})
export class ProductSignalDemo {

      // Independent application state
    products = signal<Product[]>([
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
    ]);

    searchTerm = signal('');
    selectedCategory = signal('ALL');
    showLowStockOnly = signal(false);

    // Derived state
    filteredProducts = computed(() => {
        const query = this.searchTerm().trim().toLowerCase();
        const category = this.selectedCategory();
        const lowStockOnly = this.showLowStockOnly();

        return this.products().filter(product => {
            const matchesName =
                product.name.toLowerCase().includes(query);

            const matchesCategory =
                category === 'ALL' || product.category === category;

            const matchesStock =
                !lowStockOnly || product.stockQuantity <= 5;

            return matchesName && matchesCategory && matchesStock;
        });
    });

    totalProducts = computed(() => this.products().length);

    lowStockCount = computed(() =>
        this.products().filter(
            product => product.stockQuantity <= 5
        ).length
    );

    totalInventoryValue = computed(() =>
        this.products().reduce(
            (total, product) =>
                total + product.price * product.stockQuantity,
            0
        )
    );

    constructor() {
        // Demonstration effect: log changes to the visible catalogue.
        effect(() => {
            console.log(
                'Visible product count:',
                this.filteredProducts().length
            );
        });
    }

    setSearchTerm(value: string): void {
        this.searchTerm.set(value);
    }

    setCategory(value: string): void {
        this.selectedCategory.set(value);
    }

    setLowStockOnly(value: boolean): void {
        this.showLowStockOnly.set(value);
    }

    updateStock(productId: number, change: number): void {
        this.products.update(products =>
            products.map(product =>
                product.id === productId
                    ? {
                        ...product,
                        stockQuantity: Math.max(
                            0,
                            product.stockQuantity + change
                        )
                    }
                    : product
            )
        );
    }

    deleteProduct(productId: number): void {
        this.products.update(products =>
            products.filter(product => product.id !== productId)
        );
    }

    clearFilters(): void {
        this.searchTerm.set('');
        this.selectedCategory.set('ALL');
        this.showLowStockOnly.set(false);
    }
}



