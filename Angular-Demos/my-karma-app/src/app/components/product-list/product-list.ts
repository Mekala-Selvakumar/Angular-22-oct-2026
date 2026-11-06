import { Component, inject, signal } from '@angular/core';
import { Product, ProductService } from '../../services/product-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule,CommonModule],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
    private productService = inject(ProductService);
  products = signal<Product[]>([]);

  newName = '';
  newPrice: number | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => this.products.set(data));
  }

  onAddProduct(): void {
    if (!this.newName || !this.newPrice) return;
    
    const payload: Product = { name: this.newName, price: this.newPrice };
    this.productService.addProduct(payload).subscribe(() => {
      this.newName = '';
      this.newPrice = null;
      this.loadProducts(); // Refresh list layout
    });
  }

  onDeleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts(); // Refresh list layout
    });
  }

}
