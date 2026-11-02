import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductDraft } from '../../models/product';
import { HttpProductService } from '../../services/http-product-service';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe, JsonPipe],
  selector: 'app-add-reactive-product',
  styleUrl: './add-reactive-product.css',
  templateUrl: './add-reactive-product.html',
})
export class AddReactiveProduct {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(HttpProductService);

  readonly productForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    sku: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{3}-[0-9]{4}$/)]],
    category: ['', Validators.required],
    // email:['',Validators.email]
    price: [0, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(1)]]
  });

  
  savedProducts: Product[] = [];
  successMessage = '';
  errorMessage = '';
  submitted = false;

  saveProduct(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.getRawValue();
    const product: ProductDraft = {
      ...formValue,
      name: formValue.name.trim(),
      sku: formValue.sku.trim().toUpperCase()
    };

    this.productService.create(product).subscribe({
      next: (createdProduct) => {
        this.savedProducts = [...this.savedProducts, createdProduct];
        this.successMessage = `Product "${createdProduct.name}" created successfully.`;
        this.productForm.reset({
          name: '',
          sku: '',
          category: '',
          price: 0,
          stockQuantity: 0
        });
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error saving product:', error);
        this.errorMessage = 'Unable to create the product. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.productForm.reset({
      name: '',
      sku: '',
      category: '',
      price: 0,
      stockQuantity: 0
    });
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
