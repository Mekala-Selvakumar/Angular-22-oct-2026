import { Component, inject } from '@angular/core';
import { CanDeactivateComponent } from '../../guards/can-deactivate.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule,RouterLink],
  selector: 'app-product-edit-page',
  styleUrl: './product-edit-page.css',
  templateUrl: './product-edit-page.html',
})
export class ProductEditComponent
  implements CanDeactivateComponent {

  private fb = inject(FormBuilder);

  productForm = this.fb.nonNullable.group({
    name: ['Laptop', Validators.required],
    price: [55000, [Validators.required, Validators.min(0)]]
  });

  hasUnsavedChanges(): boolean {
    return this.productForm.dirty;
  }

  save(): void {
    if (this.productForm.invalid) {
      return;
    }

    console.log('Product saved:', this.productForm.getRawValue());

    // Simulate a successful save.
    this.productForm.markAsPristine();

    alert('Product saved successfully');
  }
}
