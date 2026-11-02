import { Component, inject, signal } from '@angular/core';
import { HttpProductService } from '../../services/http-product-service';
import { Product } from '../../models/product';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-http-product-list',
  styleUrl: './http-product-list.css',
  templateUrl: './http-product-list.html',
})
export class HttpProductList {
  readonly productService = inject(HttpProductService);
    selectedProduct = signal<Product | null>(null);
    loading = signal(false);
    error = signal('');
    message = signal('');
      ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading.set(true);
        this.error.set('');
        //  subscribe - is used to listem to the Observable and receives its data
        this.productService.getAll().subscribe({
            next: (response) => {
                this.loading.set(false);
                console.log('status ',response.status)
                console.log('Headers',response.headers);
                console.log('body', response.body)
            },
            error: (error) => {
              console.log('Http Status: ', error.status);
              console.log('Error Message : ' ,error.message)
                this.error.set(
                    'Unable to load products. Check that JSON Server is running.'
                );
                this.loading.set(false);
            },
            complete:()=>{
              console.log('Executes complete - when the Observable completes')
            }
        });
    }


        addSampleProduct(): void {
     }
 
    deleteProduct(id:number) {
      const confirmDelete=confirm("Do you like to delete");
      if (confirmDelete){
         this.productService.delete(id).subscribe({
            next: () => {
              this.message.set('Product deleted successfully.');
            },
            error: () => {
              this.error.set('Unable to delete the product. Please try again.');
            }
         });
      }
    }


}
