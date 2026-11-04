import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product, ProductDraft } from '../../model/product';
import { FormsModule } from '@angular/forms';
import { ProductForm } from '../product-form/product-form';

@Component({
  imports: [FormsModule, ProductForm],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
   private productService = inject(ProductService);

  // Read product state from the service
  products = this.productService.products;

  totalProducts = this.productService.totalProducts;

  // Local component state
  searchText = signal('');

  showForm = signal(false);

  selectedProduct = signal<Product | null>(null);

  // Derived state: filtered products
  filteredProducts = computed(() => {
    const search = this.searchText().toLowerCase();

    return this.products().filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  // READ
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({

      error: error => console.error('Error loading products', error)
    });
  }

  // Open empty form for CREATE
  addNewProduct(): void {
    this.selectedProduct.set(null);
    this.showForm.set(true);
  }

  // Open form with existing data for UPDATE
  editProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.showForm.set(true);
  }

  // CREATE or UPDATE
  saveProduct(product: ProductDraft): void {

    const selected = this.selectedProduct();

    if (selected) {
      this.productService
        .updateProduct(selected.id, product)
        .subscribe({
          next: () => this.closeForm(),
          error: error => console.error('Error updating product', error)
        });

    } else {
      this.productService
        .addProduct(product)
        .subscribe({
          next: () => this.closeForm(),
          error: error => console.error('Error adding product', error)
        });
    }
  }

  // DELETE
  deleteProduct(id: string): void {

    if (confirm('Are you sure you want to delete this product?')) {

      this.productService.deleteProduct(id).subscribe({
        error: error => console.error('Error deleting product', error)
      });

    }
  }

  closeForm(): void {
    this.showForm.set(false);
    this.selectedProduct.set(null);
  }

}
