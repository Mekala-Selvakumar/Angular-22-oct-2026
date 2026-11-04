import { Component, inject, signal } from '@angular/core';
import { ProductApiService } from '../../services/product-api-service';
import { Product } from '../../model/product';
 
 @Component({
  imports: [],
  selector: 'app-product-list-page',
  styleUrl: './product-list-page.css',
  templateUrl: './product-list-page.html',
})
export class ProductListPage {
  private readonly productService = inject(ProductApiService);
  readonly productList = signal<Product[]>([]);
  readonly loadError = signal('');

  ngOnInit(){
   this.loadProducts();
  }

  loadProducts(){
    this.productService.getProducts().subscribe((products) => {
      console.log('Products loaded:', products);
      this.productList.set(products);
      this.loadError.set('');
    }, (error: unknown) => {
      console.error('Failed to load products:', error);
      this.loadError.set('Could not load products. Check the API response and browser console.');
    });
  }
}
