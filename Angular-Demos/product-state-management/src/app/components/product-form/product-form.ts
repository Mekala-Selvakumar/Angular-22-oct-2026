import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Product, ProductDraft } from '../../model/product';

@Component({
  imports: [FormsModule],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})
export class ProductForm {
    @Input() product: Product | null = null;

  @Output() save = new EventEmitter<ProductDraft>();

  @Output() cancel = new EventEmitter<void>();

  model: ProductDraft = this.emptyProduct();

  emptyProduct(): ProductDraft {
    return {
      name: '',
      sku: '',
      category: '',
      price: 0,
      stockQuantity: 0
    };
  }

  ngOnChanges(): void {
    this.model = this.product
      ? {
          name: this.product.name,
          sku: this.product.sku,
          category: this.product.category,
          price: this.product.price,
          stockQuantity: this.product.stockQuantity
        }
      : this.emptyProduct();
  }

  submitForm(form: NgForm): void {
    if (form.valid) {
      this.save.emit({ ...this.model });
      form.resetForm();
    }
  }

}
