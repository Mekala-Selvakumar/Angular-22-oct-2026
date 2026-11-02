import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  // protected readonly productService=inject(ProductService);

  // products:Product[]=[];
  
  // // constructor(){
  // //   this.loadProducts();
  // // }
  // ngOnInit(){
  //   this.loadProducts();
  // }
  // loadProducts(){
  //   this.products=this.productService.getAllProducts();
  // }


    protected readonly productService = inject(ProductService);

    addSampleProduct(): void {
        const currentCount = this.productService.totalProducts();

        this.productService.addProduct({
            name: `Demo Product ${currentCount + 1}`,
            sku: `DEM-${String(1000 + currentCount + 1)}`,
            category: 'Office',
            price: 2500,
            stockQuantity: 8
        });
    }
 
    deleteProduct(id:number) {
      const confirmDelete=confirm("Do you like to delete");
      if (confirmDelete){
         this.productService.deleteProduct(id);
          alert("Product Deleted Successfully")
      }
    }


}
