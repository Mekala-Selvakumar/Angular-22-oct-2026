# 1. Set up JSON Server as the REST API

JSON Server creates a mock REST API from a JSON file, allowing us to practice HTTP operations without implementing a Spring Boot backend. Its classic stable version supports GET, POST, PUT, PATCH, and DELETE operations for array resources.&#x20;


For this exercise, we will pin JSON Server 0.17.4 to use numeric IDs and the familiar `--watch` command.

## Step 1: Install JSON Server

Open a terminal in the root directory of your Angular project, where `package.json` is located.

```
npm install --save-dev json-server@0.17.4
```

## Step 2: Create `db.json`

Create this file in the Angular project root, not inside `src/`.

Project structure:

```
product-management/
├── db.json
├── package.json
├── angular.json
└── src/
    └── app/
```

File: `db.json`

```
{
  "products": [
    {
      "id": 101,
      "name": "Laptop",
      "sku": "LAP-1001",
      "category": "Electronics",
      "price": 65000,
      "stockQuantity": 12
    },
    {
      "id": 102,
      "name": "Keyboard",
      "sku": "KEY-1002",
      "category": "Accessories",
      "price": 1500,
      "stockQuantity": 4
    },
    {
      "id": 103,
      "name": "Monitor",
      "sku": "MON-1003",
      "category": "Electronics",
      "price": 12000,
      "stockQuantity": 0
    }
  ]
}
```

The `products` array becomes our API resource. JSON Server reads the file and exposes endpoints that allow Angular to retrieve and modify product records.

## Step 3: Add an npm script

In your existing `package.json`, add an `api` script under `scripts`. Retain the other scripts already present.

```
{
  "scripts": {
    "api": "json-server --watch db.json --port 3000"
  }
}
```

Merge this entry into your actual file rather than replacing the entire `package.json`.

## Step 4: Start the REST API

In Terminal 1:

```
npm run api
```

The server will listen on port `3000`.

Open the following URL in your browser:

[http://localhost:3000/products](http://localhost:3000/products?utm_source=chatgpt.com)

You should see the three products from `db.json`.

Keep this terminal running while working with Angular.

## Step 5: Understand the CRUD endpoints

Our REST API will use the following URLs.

| Operation | HTTP method | Endpoint        | Purpose                         |
| --------- | ----------- | --------------- | ------------------------------- |
| Read all  | GET         | `/products`     | Retrieve the product collection |
| Read one  | GET         | `/products/101` | Retrieve a specific product     |
| Create    | POST        | `/products`     | Add a new product               |
| Update    | PUT         | `/products/101` | Replace an existing product     |
| Delete    | DELETE      | `/products/101` | Remove a product                |

The full URLs are prefixed with `http://localhost:3000`.

For example, the GET request becomes:

```
GET http://localhost:3000/products
```

We will call all these endpoints through Angular's `HttpClient` from a service. The UI components will not call the REST API directly.

# 2. Configure Angular HttpClient

Before writing the service, register Angular's HTTP functionality with dependency injection.

Open `src/app/app.config.ts`.

Add `provideHttpClient()` to the existing `providers` array. Angular's standalone configuration uses this function to configure `HttpClient`.&#x20;

```
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient()

        // Retain existing providers, such as provideRouter(routes),
        // if your application already uses them.
    ]
};
```

This is illustrative: if your existing `app.config.ts` already contains providers, add `provideHttpClient()` to that configuration rather than removing the others.

Now Angular can inject `HttpClient` into our `ProductService`.



# 3. Define the Product model

Create `src/app/models/product.model.ts`.

```
export interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    stockQuantity: number;
}

export type ProductDraft = Omit<Product, 'id'>;
```

`Product` represents a record returned by JSON Server. `ProductDraft` represents the form data sent when creating or updating a product; the backend owns the record ID.

# 4. Create the ProductService with all CRUD operations

Generate the service:

```
ng g s services/product
```

Create or update `src/app/services/product.service.ts`:

```
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, ProductDraft } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = 'http://localhost:3000/products';

    // READ: retrieve all products
    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    // READ: retrieve a single product
    getById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    // CREATE: add a new product
    create(product: ProductDraft): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    // UPDATE: replace an existing product
    update(
        id: number,
        product: ProductDraft
    ): Observable<Product> {
        return this.http.put<Product>(
            `${this.apiUrl}/${id}`,
            { ...product, id }
        );
    }

    // DELETE: remove a product
    delete(id: number): Observable<Product> {
        return this.http.delete<Product>(
            `${this.apiUrl}/${id}`
        );
    }
}
```

Angular's `HttpClient` methods return RxJS Observables. The HTTP request is sent when the Observable is subscribed to; each subscription normally sends a new request. The generic types express the expected response structure but do not validate server data at runtime.&#x20;


The service is now the only layer that calls the products REST endpoints. The form components will call `create()` or `update()`, while the CRUD page will call `getAll()` and `delete()`.

## 4.1 Configure HttpClient

In `src/app/app.config.ts`, add `provideHttpClient()` to the existing provider array.

```
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient()
        // Retain any existing providers, such as provideRouter(routes).
    ]
};
```

In current Angular versions, `provideHttpClient()` configures the HTTP Client through dependency injection.&#x20;


# 5. Build the shared CRUD page

Instead of creating three separate CRUD applications, we will use one product list and one service, with three interchangeable form implementations.

The template-driven, reactive, and Signal Forms components will all call the same `ProductService`.

Create `src/app/product-crud.component.ts`:

```
import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Product } from './models/product.model';
import { ProductService } from './services/product.service';

import { TemplateProductFormComponent } from './forms/template-product-form.component';
import { ReactiveProductFormComponent } from './forms/reactive-product-form.component';
import { SignalProductFormComponent } from './forms/signal-product-form.component';

type FormType = 'template' | 'reactive' | 'signal';

@Component({
    selector: 'app-product-crud',
    standalone: true,
    imports: [
        CurrencyPipe,
        TemplateProductFormComponent,
        ReactiveProductFormComponent,
        SignalProductFormComponent
    ],
    templateUrl: './product-crud.component.html',
    styleUrl: './product-crud.component.css'
})
export class ProductCrudComponent implements OnInit {

    private readonly productService = inject(ProductService);

    products = signal<Product[]>([]);
    selectedProduct = signal<Product | null>(null);

    activeForm = signal<FormType>('reactive');
    loading = signal(false);
    error = signal('');
    message = signal('');

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading.set(true);
        this.error.set('');

        this.productService.getAll().subscribe({
            next: products => {
                this.products.set(products);
                this.loading.set(false);
            },
            error: () => {
                this.error.set(
                    'Unable to load products. Check that JSON Server is running.'
                );
                this.loading.set(false);
            }
        });
    }

    selectForm(type: FormType): void {
        this.activeForm.set(type);
    }

    newProduct(): void {
        this.selectedProduct.set(null);
        this.message.set('');
        this.error.set('');
    }

    editProduct(product: Product): void {
        // Use a new object reference for the form input.
        this.selectedProduct.set({ ...product });
        this.message.set('');
        this.error.set('');
    }

    onSaved(): void {
        this.selectedProduct.set(null);
        this.message.set('Product saved successfully.');
        this.loadProducts();
    }

    cancelForm(): void {
        this.selectedProduct.set(null);
    }

    deleteProduct(product: Product): void {
        if (!confirm(`Delete ${product.name}?`)) {
            return;
        }

        this.error.set('');
        this.message.set('');

        this.productService.delete(product.id).subscribe({
            next: () => {
                if (this.selectedProduct()?.id === product.id) {
                    this.selectedProduct.set(null);
                }

                this.message.set('Product deleted successfully.');
                this.loadProducts();
            },
            error: () => {
                this.error.set('Unable to delete the product.');
            }
        });
    }
}
```

This component owns the catalogue UI, loads product data, selects the active form type, and handles deletion. The actual HTTP operations still go through `ProductService`.

## 5.1 The shared product-list template

Create `src/app/product-crud.component.html`:

```
<main class="page">
    <h1>Product Management — CRUD Demo</h1>

    <p>
        Create, read, update and delete products through JSON Server.
    </p>

    <div class="toolbar">
        <button type="button" (click)="newProduct()">
            New Product
        </button>

        <button type="button" (click)="loadProducts()">
            Refresh Products
        </button>
    </div>

    <nav class="form-selector" aria-label="Select form approach">
        <button
            type="button"
            [class.active]="activeForm() === 'template'"
            (click)="selectForm('template')">
            Template-driven
        </button>

        <button
            type="button"
            [class.active]="activeForm() === 'reactive'"
            (click)="selectForm('reactive')">
            Reactive
        </button>

        <button
            type="button"
            [class.active]="activeForm() === 'signal'"
            (click)="selectForm('signal')">
            Signal Forms
        </button>
    </nav>

    @if (message()) {
        <p class="success-message">{{ message() }}</p>
    }

    @if (error()) {
        <p class="error-message">{{ error() }}</p>
    }

    <section class="form-section">
        @if (activeForm() === 'template') {
            <app-template-product-form
                [product]="selectedProduct()"
                (saved)="onSaved()"
                (cancelled)="cancelForm()"
            />
        } @else if (activeForm() === 'reactive') {
            <app-reactive-product-form
                [product]="selectedProduct()"
                (saved)="onSaved()"
                (cancelled)="cancelForm()"
            />
        } @else {
            <app-signal-product-form
                [product]="selectedProduct()"
                (saved)="onSaved()"
                (cancelled)="cancelForm()"
            />
        }
    </section>

    <section class="list-section">
        <h2>Products</h2>

        @if (loading()) {
            <p>Loading products...</p>
        } @else if (products().length === 0) {
            <p>No products found.</p>
        } @else {
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        @for (product of products(); track product.id) {
                            <tr>
                                <td>{{ product.id }}</td>
                                <td>{{ product.name }}</td>
                                <td>{{ product.sku }}</td>
                                <td>{{ product.category }}</td>
                                <td>
                                    {{ product.price | currency:'INR' }}
                                </td>
                                <td>{{ product.stockQuantity }}</td>
                                <td class="actions">
                                    <button
                                        type="button"
                                        (click)="editProduct(product)">
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        class="delete-button"
                                        (click)="deleteProduct(product)">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        }
    </section>
</main>
```

Create `src/app/product-crud.component.css`:

```
.page {
    max-width: 1200px;
    margin: 25px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.toolbar,
.form-selector,
.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0;
}

button {
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    cursor: pointer;
}

.form-selector button.active {
    background: #1d4ed8;
    color: white;
}

.table-wrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 11px;
    border: 1px solid #dbe2ea;
    text-align: left;
}

th {
    background: #f1f5f9;
}

.delete-button {
    background: #b91c1c;
    color: white;
}

.success-message {
    color: #166534;
}

.error-message {
    color: #b91c1c;
}
```

The list displays the results returned by JSON Server. The Edit button passes a product into the active form, and the Delete button invokes the service's DELETE request.

# 6. Form approach 1: Template-driven CRUD

Create `src/app/forms/template-product-form.component.ts`.

This implementation uses `FormsModule`, `ngModel`, and `NgForm`. It supports both creating a product and updating an existing one.

```
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    inject
} from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';

import { Product, ProductDraft } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-template-product-form',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './template-product-form.component.html'
})
export class TemplateProductFormComponent implements OnChanges {

    @Input() product: Product | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    @ViewChild('productForm') formRef?: NgForm;

    private readonly api = inject(ProductService);

    model: ProductDraft = this.emptyDraft();
    editingId: number | null = null;

    saving = false;
    error = '';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['product']) {
            this.editingId = this.product?.id ?? null;
            this.model = this.toDraft(this.product);
            this.error = '';

            this.formRef?.resetForm(this.model);
        }
    }

    private emptyDraft(): ProductDraft {
        return {
            name: '',
            sku: '',
            category: '',
            price: 0,
            stockQuantity: 0
        };
    }

    private toDraft(product: Product | null): ProductDraft {
        if (!product) {
            return this.emptyDraft();
        }

        return {
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stockQuantity: product.stockQuantity
        };
    }

    save(form: NgForm): void {
        this.error = '';

        if (form.invalid) {
            form.control.markAllAsTouched();
            return;
        }

        if (
            !Number.isInteger(this.model.stockQuantity) ||
            this.model.stockQuantity < 0
        ) {
            this.error = 'Stock must be a non-negative whole number.';
            return;
        }

        const draft: ProductDraft = {
            ...this.model,
            name: this.model.name.trim(),
            sku: this.model.sku.trim().toUpperCase()
        };

        this.saving = true;

        const request = this.editingId === null
            ? this.api.create(draft)
            : this.api.update(this.editingId, draft);

        request.subscribe({
            next: () => {
                this.saving = false;
                this.model = this.emptyDraft();
                this.editingId = null;
                form.resetForm(this.model);
                this.saved.emit();
            },
            error: () => {
                this.saving = false;
                this.error = 'Could not save the product. Try again.';
            }
        });
    }

    cancel(form: NgForm): void {
        this.model = this.emptyDraft();
        this.editingId = null;
        this.error = '';
        form.resetForm(this.model);
        this.cancelled.emit();
    }
}
```

Create `src/app/forms/template-product-form.component.html`:

```
<section class="product-form">
    <h2>{{ editingId === null ? 'Add Product' : 'Edit Product' }}</h2>

    <form
        #productForm="ngForm"
        (ngSubmit)="save(productForm)"
        novalidate>

        <label for="td-name">Name</label>
        <input
            id="td-name"
            name="name"
            [(ngModel)]="model.name"
            #name="ngModel"
            required
            minlength="3"
            maxlength="80"
        />

        @if (name.invalid && (name.touched || productForm.submitted)) {
            @if (name.hasError('required')) {
                <p class="field-error">Name is required.</p>
            }
            @if (name.hasError('minlength')) {
                <p class="field-error">Name must be at least 3 characters.</p>
            }
        }

        <label for="td-sku">SKU</label>
        <input
            id="td-sku"
            name="sku"
            [(ngModel)]="model.sku"
            #sku="ngModel"
            required
            pattern="[A-Za-z]{3}-[0-9]{4}"
        />

        @if (sku.invalid && (sku.touched || productForm.submitted)) {
            <p class="field-error">Use the format ABC-1234.</p>
        }

        <label for="td-category">Category</label>
        <select
            id="td-category"
            name="category"
            [(ngModel)]="model.category"
            #category="ngModel"
            required>

            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Office">Office</option>
        </select>

        @if (category.invalid && (category.touched || productForm.submitted)) {
            <p class="field-error">Category is required.</p>
        }

        <label for="td-price">Price</label>
        <input
            id="td-price"
            name="price"
            type="number"
            [(ngModel)]="model.price"
            #price="ngModel"
            required
            min="0.01"
            step="0.01"
        />

        @if (price.invalid && (price.touched || productForm.submitted)) {
            <p class="field-error">Price must be greater than zero.</p>
        }

        <label for="td-stock">Stock quantity</label>
        <input
            id="td-stock"
            name="stockQuantity"
            type="number"
            [(ngModel)]="model.stockQuantity"
            #stock="ngModel"
            required
            min="0"
            step="1"
        />

        @if (stock.invalid && (stock.touched || productForm.submitted)) {
            <p class="field-error">Stock cannot be negative.</p>
        }

        @if (error) {
            <p class="field-error">{{ error }}</p>
        }

        <button type="submit" [disabled]="saving">
            {{ saving ? 'Saving...' : editingId === null ? 'Create' : 'Update' }}
        </button>

        <button type="button" (click)="cancel(productForm)">
            Cancel / Clear
        </button>
    </form>
</section>
```

How CRUD works in this form:

- Create: `editingId` is `null`, so `api.create(draft)` sends a POST request.
- Update: The parent passes a product to the form, so `editingId` contains the product ID and `api.update()` sends a PUT request.
- Read: The shared parent component loads products through `api.getAll()`.
- Delete: The shared parent component calls `api.delete(id)`.

All form fields are bound using `[(ngModel)]`, and Angular manages the template-driven form state.

# 7. Form approach 2: Reactive CRUD

This version uses `ReactiveFormsModule`, `FormGroup`, `FormBuilder`, and `Validators`. The same `ProductService` is injected, so there is no duplicate HTTP implementation.

Create `src/app/forms/reactive-product-form.component.ts`:

```
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    inject
} from '@angular/core';

import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';

import { Product, ProductDraft } from '../models/product.model';
import { ProductService } from '../services/product.service';

const integerValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
        return null;
    }

    return Number.isInteger(Number(value))
        ? null
        : { integer: true };
};

@Component({
    selector: 'app-reactive-product-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './reactive-product-form.component.html'
})
export class ReactiveProductFormComponent implements OnChanges {

    @Input() product: Product | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    private readonly api = inject(ProductService);
    private readonly fb = inject(FormBuilder);

    editingId: number | null = null;
    submitted = false;
    saving = false;
    error = '';

    productForm = this.fb.nonNullable.group({
        name: [
            '',
            [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(80)
            ]
        ],
        sku: [
            '',
            [
                Validators.required,
                Validators.pattern(/^[A-Za-z]{3}-[0-9]{4}$/)
            ]
        ],
        category: ['', Validators.required],
        price: [
            0,
            [
                Validators.required,
                Validators.min(0.01)
            ]
        ],
        stockQuantity: [
            0,
            [
                Validators.required,
                Validators.min(0),
                integerValidator
            ]
        ]
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['product']) {
            this.editingId = this.product?.id ?? null;
            this.productForm.reset(this.toDraft(this.product));
            this.submitted = false;
            this.error = '';
        }
    }

    private emptyDraft(): ProductDraft {
        return {
            name: '',
            sku: '',
            category: '',
            price: 0,
            stockQuantity: 0
        };
    }

    private toDraft(product: Product | null): ProductDraft {
        if (!product) {
            return this.emptyDraft();
        }

        return {
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stockQuantity: product.stockQuantity
        };
    }

    showError(fieldName: string, errorCode: string): boolean {
        const control = this.productForm.get(fieldName);

        return !!control &&
            control.hasError(errorCode) &&
            (control.touched || this.submitted);
    }

    save(): void {
        this.submitted = true;
        this.error = '';

        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        const value = this.productForm.getRawValue();

        const draft: ProductDraft = {
            ...value,
            name: value.name.trim(),
            sku: value.sku.trim().toUpperCase()
        };

        this.saving = true;

        const request = this.editingId === null
            ? this.api.create(draft)
            : this.api.update(this.editingId, draft);

        request.subscribe({
            next: () => {
                this.saving = false;
                this.editingId = null;
                this.productForm.reset(this.emptyDraft());
                this.submitted = false;
                this.saved.emit();
            },
            error: () => {
                this.saving = false;
                this.error = 'Could not save the product. Try again.';
            }
        });
    }

    cancel(): void {
        this.editingId = null;
        this.productForm.reset(this.emptyDraft());
        this.submitted = false;
        this.error = '';
        this.cancelled.emit();
    }
}
```

## 7.1 Reactive form template

Create `src/app/forms/reactive-product-form.component.html`:

```
<section class="product-form">
    <h2>{{ editingId === null ? 'Add Product' : 'Edit Product' }}</h2>

    <form [formGroup]="productForm" (ngSubmit)="save()" novalidate>

        <label for="rf-name">Name</label>
        <input id="rf-name" formControlName="name" />

        @if (showError('name', 'required')) {
            <p class="field-error">Name is required.</p>
        }
        @if (showError('name', 'minlength')) {
            <p class="field-error">Name must be at least 3 characters.</p>
        }
        @if (showError('name', 'maxlength')) {
            <p class="field-error">Name cannot exceed 80 characters.</p>
        }

        <label for="rf-sku">SKU</label>
        <input id="rf-sku" formControlName="sku" />

        @if (showError('sku', 'required')) {
            <p class="field-error">SKU is required.</p>
        }
        @if (showError('sku', 'pattern')) {
            <p class="field-error">Use the format ABC-1234.</p>
        }

        <label for="rf-category">Category</label>
        <select id="rf-category" formControlName="category">
            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Office">Office</option>
        </select>

        @if (showError('category', 'required')) {
            <p class="field-error">Category is required.</p>
        }

        <label for="rf-price">Price</label>
        <input
            id="rf-price"
            type="number"
            step="0.01"
            formControlName="price"
        />

        @if (showError('price', 'required') ||
             showError('price', 'min')) {
            <p class="field-error">Price must be greater than zero.</p>
        }

        <label for="rf-stock">Stock quantity</label>
        <input
            id="rf-stock"
            type="number"
            step="1"
            formControlName="stockQuantity"
        />

        @if (showError('stockQuantity', 'min')) {
            <p class="field-error">Stock cannot be negative.</p>
        }
        @if (showError('stockQuantity', 'integer')) {
            <p class="field-error">Stock must be a whole number.</p>
        }

        @if (error) {
            <p class="field-error">{{ error }}</p>
        }

        <button type="submit" [disabled]="saving">
            {{ saving ? 'Saving...' : editingId === null ? 'Create' : 'Update' }}
        </button>

        <button type="button" (click)="cancel()">
            Cancel / Clear
        </button>

    </form>
</section>
```

### What is different from the template-driven approach?

The validation rules and form structure are declared in TypeScript rather than being inferred from most of the form's template configuration.

The form itself exposes controls through `productForm.controls` or `productForm.get()`. The helper method `showError()` avoids repeating the condition for displaying validation messages.

The CRUD decision is still the same:

```
const request = this.editingId === null
    ? this.api.create(draft)
    : this.api.update(this.editingId, draft);
```

The form component does not need to construct URLs or inject `HttpClient`; those responsibilities remain in `ProductService`.

# 8. Form approach 3: Angular Signal Forms (Angular 22)

Signal Forms are a newer approach, stable as of Angular 22. They use a Signal as the form's data model and provide field-level binding and validation APIs.&#x20;

Use this version only if your project is running Angular 22 or a version that supports the stable Signal Forms API.

Create `src/app/forms/signal-product-form.component.ts`:

```
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    inject,
    signal
} from '@angular/core';

import {
    FormField,
    FormRoot,
    form,
    required,
    minLength,
    maxLength,
    pattern,
    min,
    validate
} from '@angular/forms/signals';

import { firstValueFrom } from 'rxjs';

import { Product, ProductDraft } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-signal-product-form',
    standalone: true,
    imports: [FormField, FormRoot],
    templateUrl: './signal-product-form.component.html'
})
export class SignalProductFormComponent implements OnChanges {

    @Input() product: Product | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    private readonly api = inject(ProductService);

    editingId: number | null = null;
    saving = signal(false);
    error = signal('');

    model = signal<ProductDraft>(this.emptyDraft());

    productForm = form(
        this.model,
        path => {
            required(path.name, {
                message: 'Name is required.'
            });
            minLength(path.name, 3, {
                message: 'Name must be at least 3 characters.'
            });
            maxLength(path.name, 80, {
                message: 'Name cannot exceed 80 characters.'
            });

            required(path.sku, {
                message: 'SKU is required.'
            });
            pattern(path.sku, /^[A-Za-z]{3}-[0-9]{4}$/, {
                message: 'Use the format ABC-1234.'
            });

            required(path.category, {
                message: 'Category is required.'
            });

            min(path.price, 0.01, {
                message: 'Price must be greater than zero.'
            });

            min(path.stockQuantity, 0, {
                message: 'Stock cannot be negative.'
            });

            validate(path.stockQuantity, ({ value }) =>
                Number.isInteger(value())
                    ? null
                    : {
                        kind: 'integer',
                        message: 'Stock must be a whole number.'
                    }
            );
        },
        {
            submission: {
                action: async () => {
                    await this.saveToApi();
                }
            }
        }
    );

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['product']) {
            this.editingId = this.product?.id ?? null;
            this.productForm().reset(this.toDraft(this.product));
            this.error.set('');
        }
    }

    private emptyDraft(): ProductDraft {
        return {
            name: '',
            sku: '',
            category: '',
            price: 0,
            stockQuantity: 0
        };
    }

    private toDraft(product: Product | null): ProductDraft {
        if (!product) {
            return this.emptyDraft();
        }

        return {
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stockQuantity: product.stockQuantity
        };
    }

    private async saveToApi(): Promise<void> {
        this.error.set('');
        this.saving.set(true);

        const value = this.model();

        const draft: ProductDraft = {
            ...value,
            name: value.name.trim(),
            sku: value.sku.trim().toUpperCase()
        };

        try {
            if (this.editingId === null) {
                await firstValueFrom(this.api.create(draft));
            } else {
                await firstValueFrom(
                    this.api.update(this.editingId, draft)
                );
            }

            this.editingId = null;
            this.productForm().reset(this.emptyDraft());
            this.saved.emit();
        } catch {
            this.error.set('Could not save the product. Try again.');
        } finally {
            this.saving.set(false);
        }
    }

    cancel(): void {
        this.editingId = null;
        this.productForm().reset(this.emptyDraft());
        this.error.set('');
        this.cancelled.emit();
    }
}
```

## 8.1 Signal Forms template

Create `src/app/forms/signal-product-form.component.html`:

```
<section class="product-form">
    <h2>{{ editingId === null ? 'Add Product' : 'Edit Product' }}</h2>

    <form [formRoot]="productForm">

        <label for="sf-name">Name</label>
        <input
            id="sf-name"
            [formField]="productForm.name"
        />

        @if (
            productForm.name().touched() &&
            productForm.name().invalid()
        ) {
            @for (error of productForm.name().errors(); track $index) {
                <p class="field-error">{{ error.message }}</p>
            }
        }

        <label for="sf-sku">SKU</label>
        <input
            id="sf-sku"
            [formField]="productForm.sku"
        />

        @if (
            productForm.sku().touched() &&
            productForm.sku().invalid()
        ) {
            @for (error of productForm.sku().errors(); track $index) {
                <p class="field-error">{{ error.message }}</p>
            }
        }

        <label for="sf-category">Category</label>
        <select
            id="sf-category"
            [formField]="productForm.category">

            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Office">Office</option>
        </select>

        @if (
            productForm.category().touched() &&
            productForm.category().invalid()
        ) {
            @for (error of productForm.category().errors(); track $index) {
                <p class="field-error">{{ error.message }}</p>
            }
        }

        <label for="sf-price">Price</label>
        <input
            id="sf-price"
            type="number"
            step="0.01"
            [formField]="productForm.price"
        />

        @if (
            productForm.price().touched() &&
            productForm.price().invalid()
        ) {
            @for (error of productForm.price().errors(); track $index) {
                <p class="field-error">{{ error.message }}</p>
            }
        }

        <label for="sf-stock">Stock quantity</label>
        <input
            id="sf-stock"
            type="number"
            step="1"
            [formField]="productForm.stockQuantity"
        />

        @if (
            productForm.stockQuantity().touched() &&
            productForm.stockQuantity().invalid()
        ) {
            @for (
                error of productForm.stockQuantity().errors();
                track $index
            ) {
                <p class="field-error">{{ error.message }}</p>
            }
        }

        @if (error()) {
            <p class="field-error">{{ error() }}</p>
        }

        <button
            type="submit"
            [disabled]="productForm().invalid() || saving()">

            {{ saving() ? 'Saving...' : editingId === null ? 'Create' : 'Update' }}
        </button>

        <button
            type="button"
            (click)="cancel()">

            Cancel / Clear
        </button>

    </form>
</section>
```

`FormRoot` handles form submission and calls the action configured in `form()`. `FormField` connects each field to the Signal Forms model, and the field state provides reactive validation information.&#x20;


For forms with a more complicated domain model, Signal Forms also supports custom validation and cross-field validation.

# 9. Connect the CRUD page to the root component

Update your existing root component (`src/app/app.ts` in the current CLI naming convention, or `app.component.ts` in older projects) to display the CRUD page.

```
import { Component } from '@angular/core';
import { ProductCrudComponent } from './product-crud.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ProductCrudComponent],
    template: `<app-product-crud />`
})
export class App {}
```

Keep your existing component class name if you are modifying a generated project. The important part is importing `ProductCrudComponent` and placing `<app-product-crud />` in its template.

## 9.1 Add shared form styling

Add the following rules to `src/styles.css` so all three form implementations have a consistent appearance.

```
.product-form {
    max-width: 620px;
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #ffffff;
    font-family: Arial, sans-serif;
}

.product-form form {
    display: grid;
    gap: 9px;
}

.product-form label {
    font-weight: 600;
    margin-top: 6px;
}

.product-form input,
.product-form select {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
}

.product-form button {
    width: fit-content;
    margin-top: 8px;
}

.field-error {
    margin: 0;
    color: #b91c1c;
    font-size: 13px;
}
```

This styling is global, so the CSS rules apply to the corresponding classes used by the three form components.

# 10. Run the complete application

Open two terminal windows in the project root.

Terminal 1 — Start JSON Server

```
npm run api
```

Provides the REST API at `http://localhost:3000` and persists CRUD changes to `db.json`.

Terminal 2 — Start Angular

```
ng serve
```

Serves the Angular application, usually at `http://localhost:4200`.

Open `http://localhost:4200` in your browser.

If you have not yet added the JSON Server script, add this entry to the existing `package.json`:

```
{
  "scripts": {
    "api": "json-server --watch db.json --port 3000"
  }
}
```

Merge it with your existing scripts rather than replacing them.

## 10.1 Test each CRUD operation

READ

Open the application and verify that Laptop, Keyboard, and Monitor appear in the product table. The list is loaded by `ProductService.getAll()`.

CREATE

Select any form type, enter a valid new product, and click Create. The form calls `ProductService.create()`, which sends a POST request. The parent refreshes the product list after success.

UPDATE

Click Edit beside an existing product. Change its price or quantity and click Update. The selected product is passed into the form, and `ProductService.update()` sends a PUT request to the record's URL.

DELETE

Click Delete and confirm. The application sends a DELETE request through `ProductService.delete()`, then reloads the catalogue.

Try the same operations after selecting Template-driven, Reactive, and Signal Forms. The form implementation changes, but the backend operations remain the same.

# 11. How the complete architecture works

Angular Product CRUD page

Product listing, Edit, Delete, form selection

Template-driven

FormsModule

Reactive

FormGroup

Signal Forms

Angular 22+

ProductService

GET · GET by ID · POST · PUT · DELETE

JSON Server — `http://localhost:3000/products`

REST API backed by `db.json`

The responsibility boundaries are important:

- The forms manage user input and validation.
- The shared CRUD page manages the list, selected product, and refresh behaviour.
- `ProductService` owns HTTP communication.
- JSON Server supplies the REST API and persists the mock data.

In this demonstration, a successful create or update triggers a fresh GET request from the parent component. This approach keeps the example simple and makes it easy to verify that the UI reflects the server's data.

# 12. Comparison of the three implementations

| Capability       | Template-driven                          | Reactive                                    | Signal Forms                                           |
| ---------------- | ---------------------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| Form state model | `NgForm` and `ngModel`                   | `FormGroup` and `FormControl`               | Signal model and `FieldTree`                           |
| Binding syntax   | `[(ngModel)]`                            | `formControlName`                           | `[formField]`                                          |
| Validation       | Template constraints and form directives | `Validators` and custom validator functions | Schema rules such as `required`, `min`, and `validate` |
| Dynamic updates  | Managed by template directives           | Explicit control APIs                       | Signal-based model updates                             |
| CRUD API         | Shared `ProductService`                  | Shared `ProductService`                     | Shared `ProductService`                                |
| Best suited to   | Simpler data-entry forms                 | Complex and enterprise forms                | Signal-oriented forms on supported Angular versions    |

Angular's official documentation recommends reactive forms when the application has substantial form logic and needs a scalable, testable form model. Template-driven forms remain useful for simpler forms. Signal Forms provide another model-driven approach on Angular 22.&#x20;

 

## 13. Troubleshooting

| Problem                                                 | What to verify                                                                                                                                             |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `No provider for HttpClient`                            | Confirm `provideHttpClient()` is present in the application providers.                                                                                     |
| `HttpErrorResponse` or connection refused               | Verify that JSON Server is running on port 3000.                                                                                                           |
| Products load, but Create or Update fails               | Inspect the request and response in browser Developer Tools → Network. Verify the URL and JSON body.                                                       |
| Edit does not populate the form                         | Verify the parent binds `[product]="selectedProduct()"` and the form responds to input changes.                                                            |
| The table does not refresh after saving                 | Confirm that the form emits `saved` only after a successful API operation and that the parent calls `loadProducts()`.                                      |
| Angular cannot find `@angular/forms/signals`            | The project may be using a version earlier than Angular 22 or an incompatible package version. Use the template-driven and reactive variants in that case. |
| SKU validation fails unexpectedly                       | Use the format `LAP-1001`, `KEY-1002`, and so on.                                                                                                          |
| The form reports success but the list remains unchanged | Check the browser console and Network tab, and confirm that the backend response succeeded before refreshing the list.                                     |

Production note: JSON Server is a mock backend for learning and prototyping. It does not implement production-grade business rules, security, transactional inventory management, or robust error handling. Those responsibilities belong in a real backend such as Spring Boot.

With this setup, you have a single Product Management CRUD application in which all three Angular form approaches use the same REST service. The next natural step is to replace JSON Server with a Spring Boot REST API while keeping the form components and most of the service interface unchanged.