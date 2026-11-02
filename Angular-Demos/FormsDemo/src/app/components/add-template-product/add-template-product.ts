import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Product, ProductDraft } from '../../models/product';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { HttpProductService } from '../../services/http-product-service';

@Component({
  imports: [FormsModule,CurrencyPipe,JsonPipe],
  selector: 'app-add-template-product',
  styleUrl: './add-template-product.css',
  templateUrl: './add-template-product.html',
})
export class AddTemplateProduct {
      model: ProductDraft = this.emptyDraft();
      productService =inject(HttpProductService);

    savedProducts: Product[] = [];
      successMessage = '';
      errorMessage = '';

 
    private emptyDraft(): ProductDraft {
        return {
            name: '',
            sku: '',
            category: '',
            price: 0,
            stockQuantity: 0
        };
    }

    saveProduct(form: NgForm): void {
        if (form.invalid) {
            form.control.markAllAsTouched();
            return;
        }
        this.successMessage = '';
        this.errorMessage = '';
        console.log(form.value);
        const product: ProductDraft = {
            ...this.model,
            name: this.model.name.trim(),
            sku: (this.model.sku ?? '').trim().toUpperCase()
        };

        this.productService.create(product).subscribe({
            next: (createdProduct) => {
                this.savedProducts = [
                    ...this.savedProducts,
                    createdProduct
                ];
                this.successMessage = `Product "${createdProduct.name}" created successfully.`;
                console.log('Saved product:', createdProduct);
                this.model = this.emptyDraft();
                form.resetForm(this.model);
            },
            error: (error) => {
                console.error('Error saving product:', error);
                this.errorMessage = 'Unable to create the product. Please try again.';
            }
        });
    }

}
