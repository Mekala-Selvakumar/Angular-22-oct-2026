# Module 9: Forms in Angular

This  covers three topics: Template-Driven Forms, Reactive Forms, and Validations.&#x20;

We will continue building our Product Management application. In previous modules, we displayed products, searched and filtered them, tracked inventory using Signals, and optimized product components. Now we will implement the forms required to add and edit products with appropriate validation.

Our product form will contain the following fields:

## Product Details

Product name

Laptop

SKU

LAP-1001

Category

Electronics

Price

₹65,000

Stock quantity

12

Validation requirements

- Product name is required and must contain at least three characters.
- SKU must follow the format `ABC-1234`.
- A category must be selected.
- Price must be greater than zero.
- Stock quantity must be a non-negative integer.

 
Angular's official documentation describes template-driven forms as a good fit for simpler forms and reactive forms as a more explicit, scalable option for complex forms. Both approaches support validation.&#x20;

# 1. Understanding forms in Angular

## 1.1 What is a form?

A form collects input from a user and allows the application to process that input.

In our Product Management application, a product form collects the product name, category, price, SKU, and stock quantity. Angular tracks the entered values, input interaction, and validation status.

A well-designed form typically has five responsibilities:

1. Display input controls.
2. Maintain the entered data.
3. Validate the input.
4. Provide understandable feedback to the user.
5. Submit valid data to the application or backend.

Angular offers two established approaches to managing these responsibilities.

## 1.2 Template-driven versus reactive forms

Template-driven forms

The form structure and much of its configuration are expressed in the HTML template. Angular uses directives such as `ngModel` and `ngForm` to manage controls and their state.

Best suited to straightforward data-entry forms with relatively simple validation and behaviour.

Reactive forms

The form model is explicitly defined in TypeScript through objects such as `FormControl`, `FormGroup`, and `FormArray`. The template connects to that model using directives.

Best suited to complex forms, dynamic validation, programmatic control, and testable form logic.

| Aspect                  | Template-driven                                  | Reactive                                                        |
| ----------------------- | ------------------------------------------------ | --------------------------------------------------------------- |
| Primary form definition | HTML template                                    | TypeScript form model                                           |
| Main module             | `FormsModule`                                    | `ReactiveFormsModule`                                           |
| Common APIs             | `ngModel`, `ngForm`                              | `FormControl`, `FormGroup`, `FormBuilder`                       |
| Data binding            | Commonly uses `[(ngModel)]`                      | Uses `[formControl]` or `[formGroup]` with `formControlName`    |
| Validation setup        | Frequently specified through template attributes | Typically specified through validator functions in TypeScript   |
| Access to form state    | Template reference variables and directives      | Form model's properties and methods                             |
| Dynamic forms           | Possible, but often requires more template work  | Naturally suited to programmatic control creation               |
| Typical enterprise use  | Simple forms and straightforward data entry      | Complex product forms, dynamic fields, and elaborate validation |

Both approaches can implement a product creation form. We will implement the same scenario in each so that the difference becomes clear.

# 2. Template-driven forms

## 2.1 How template-driven forms work

In a template-driven form, the HTML template plays the leading role in defining the form. Angular directives interpret the form controls and maintain their values, validation state, and overall form status.

The primary APIs are:

- `FormsModule`: provides the required directives.
- `ngModel`: connects a form control to a property and tracks the control's state.
- `ngForm`: represents the overall form and its controls.
- Template reference variables: provide access to the form and control states in the template.

These mechanisms allow an HTML form to communicate with its component model without manually constructing every form control in TypeScript.&#x20;


## 2.2 Create the product model

Use this model in the Product Management application.

File: `product.model.ts`

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

`Product` represents a saved product. `ProductDraft` represents the information the user enters before the application assigns an ID.

Using a separate draft type is useful because a new product does not yet have a persistent identifier.

## 2.3 Create a template-driven product form

Generate a component:

```
ng g component features/products/pages/product-template-form
```

Adjust the generated filenames to match your Angular CLI version.

File: `product-template-form.ts`

```
import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Product, ProductDraft } from '../../models/product.model';

@Component({
    selector: 'app-product-template-form',
    standalone: true,
    imports: [FormsModule, CurrencyPipe],
    templateUrl: './product-template-form.html',
    styleUrl: './product-template-form.css'
})
export class ProductTemplateFormComponent {

    model: ProductDraft = this.emptyDraft();

    savedProducts: Product[] = [];

    private nextId = 1001;

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

        const product: Product = {
            ...this.model,
            id: this.nextId++,
            name: this.model.name.trim(),
            sku: this.model.sku.trim().toUpperCase()
        };

        this.savedProducts = [
            ...this.savedProducts,
            product
        ];

        console.log('Saved product:', product);

        this.model = this.emptyDraft();
        form.resetForm(this.model);
    }
}
```

### Important details

`FormsModule` provides the template-driven form directives, while `NgForm` gives us access to the overall form model and its validation state.

The `saveProduct()` method follows this sequence:

1. Check whether the form is valid.
2. Mark the controls as touched if the form is invalid.
3. Create a product with an ID after validation succeeds.
4. Add it to the demonstration collection.
5. Reset the form.

This example stores data in memory only. It does not yet persist products to a backend API.

## 2.4 Build the template

File: `product-template-form.html`

```
<section class="product-form-page">

    <h2>Add Product</h2>

    <form
        #productForm="ngForm"
        (ngSubmit)="saveProduct(productForm)"
        novalidate>

        <div class="form-field">
            <label for="name">Product name</label>

            <input
                id="name"
                name="name"
                type="text"
                [(ngModel)]="model.name"
                #name="ngModel"
                required
                minlength="3"
                maxlength="80"
                placeholder="Enter product name"
            />

            @if (
                name.invalid &&
                (name.touched || productForm.submitted)
            ) {
                <div class="error">
                    @if (name.hasError('required')) {
                        <p>Product name is required.</p>
                    }

                    @if (name.hasError('minlength')) {
                        <p>Name must contain at least 3 characters.</p>
                    }
                </div>
            }
        </div>

        <div class="form-field">
            <label for="sku">SKU</label>

            <input
                id="sku"
                name="sku"
                type="text"
                [(ngModel)]="model.sku"
                #sku="ngModel"
                required
                pattern="[A-Za-z]{3}-[0-9]{4}"
                placeholder="Example: LAP-1001"
            />

            @if (
                sku.invalid &&
                (sku.touched || productForm.submitted)
            ) {
                <div class="error">
                    @if (sku.hasError('required')) {
                        <p>SKU is required.</p>
                    }

                    @if (sku.hasError('pattern')) {
                        <p>Enter an SKU such as LAP-1001.</p>
                    }
                </div>
            }
        </div>

        <div class="form-field">
            <label for="category">Category</label>

            <select
                id="category"
                name="category"
                [(ngModel)]="model.category"
                #category="ngModel"
                required>

                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Office">Office</option>
            </select>

            @if (
                category.invalid &&
                (category.touched || productForm.submitted)
            ) {
                <p class="error">Please select a category.</p>
            }
        </div>

        <div class="form-field">
            <label for="price">Price</label>

            <input
                id="price"
                name="price"
                type="number"
                [(ngModel)]="model.price"
                #price="ngModel"
                required
                min="0.01"
                step="0.01"
            />

            @if (
                price.invalid &&
                (price.touched || productForm.submitted)
            ) {
                @if (price.hasError('required')) {
                    <p class="error">Price is required.</p>
                }

                @if (price.hasError('min')) {
                    <p class="error">Price must be greater than zero.</p>
                }
            }
        </div>

        <div class="form-field">
            <label for="stockQuantity">Stock quantity</label>

            <input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                [(ngModel)]="model.stockQuantity"
                #stockQuantity="ngModel"
                required
                min="0"
                step="1"
            />

            @if (
                stockQuantity.invalid &&
                (stockQuantity.touched || productForm.submitted)
            ) {
                @if (stockQuantity.hasError('required')) {
                    <p class="error">Stock quantity is required.</p>
                }

                @if (stockQuantity.hasError('min')) {
                    <p class="error">Stock cannot be negative.</p>
                }
            }
        </div>

        <button type="submit">
            Save Product
        </button>

        <button
            type="button"
            (click)="model = emptyDraft(); productForm.resetForm(model)">

            Reset
        </button>

    </form>

    @if (savedProducts.length > 0) {
        <h3>Products added in this session</h3>

        @for (product of savedProducts; track product.id) {
            <article class="saved-product">
                <strong>{{ product.name }}</strong>
                <span>{{ product.sku }}</span>
                <span>{{ product.price | currency:'INR' }}</span>
            </article>
        }
    }

</section>
```

### What do `#productForm="ngForm"` and `#name="ngModel"` mean?

These are template reference variables.

`#productForm="ngForm"` exposes the Angular form directive, so the template and component can inspect the overall form state.

`#name="ngModel"` exposes the Angular control associated with the product-name input. The template can check whether the control is valid, touched, or has a particular validation error.

Each `ngModel` control inside a form must have a unique `name` so Angular can register it with the containing form.&#x20;

### Why use `novalidate`?

Angular's forms framework typically handles validation itself rather than relying on the browser's native form-validation pop-ups. The `novalidate` attribute disables native constraint-validation UI for the form, while Angular's validators continue to check the controls.

The `required`, `min`, and `pattern` constraints in the template are recognized by Angular's forms directives and participate in its validation state.

Note: The example uses the newer `@if` and `@for` template syntax. The form APIs themselves remain the familiar template-driven APIs.

## 2.5 Form and control states

Angular tracks several useful states:

| State       | Meaning                                      |
| ----------- | -------------------------------------------- |
| `valid`     | All applicable validators pass               |
| `invalid`   | At least one validator fails                 |
| `touched`   | The user has focused the control and left it |
| `untouched` | The control has not been marked touched      |
| `dirty`     | The user has changed the control value       |
| `pristine`  | The control has not been marked dirty        |
| `submitted` | The containing form has been submitted       |

These states help determine when to show validation messages. For instance, showing an error after a control has been touched gives the user feedback without displaying an entire screen of errors before interaction begins.

The example checks `name.invalid && (name.touched || productForm.submitted)`. This is a common pattern for showing feedback after the user has interacted with a field or attempted submission.

## 2.6 Styling the template-driven form

File: `product-template-form.css`

```
.product-form-page {
    max-width: 650px;
    margin: 30px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
}

.form-field input,
.form-field select {
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
}

.error {
    color: #b91c1c;
    font-size: 14px;
}

button {
    padding: 10px 14px;
    margin-right: 8px;
    cursor: pointer;
}

.saved-product {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
    margin-top: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
}
```

At this point, the template-driven form can collect and validate product details, display errors, and add valid products to an in-memory list.

Small refinement to the template-driven example: expose Reset through a public component method rather than calling a private helper from the HTML template. Add the following method to `ProductTemplateFormComponent`:

```
resetForm(form: NgForm): void {
    this.model = this.emptyDraft();
    form.resetForm(this.model);
}
```

Then change the Reset button to:

```
<button
    type="button"
    (click)="resetForm(productForm)">
    Reset
</button>
```

This keeps the form-reset operation in the component class and the template focused on presentation.

# 3. Reactive forms

## 3.1 What are reactive forms?

Reactive forms use an explicitly defined form model in TypeScript.

Rather than relying primarily on directives in the HTML to construct the form structure, the developer creates controls and groups in the component class, configures their validators, and connects the controls to the template.

The main APIs are:

| API                   | Responsibility                                                                   |
| --------------------- | -------------------------------------------------------------------------------- |
| `FormControl`         | Represents an individual field and its value, validation, and interaction state  |
| `FormGroup`           | Groups related controls into one form model                                      |
| `FormArray`           | Manages a variable-length collection of controls                                 |
| `FormBuilder`         | Simplifies the construction of controls and groups                               |
| `Validators`          | Provides built-in validation functions                                           |
| `ReactiveFormsModule` | Provides the template directives for connecting reactive form models to elements |

Reactive forms expose the form model directly to TypeScript, making it easier to programmatically change values, inspect validation errors, add controls, and test form logic.&#x20;


## 3.2 Understanding `FormControl`

A `FormControl` represents one field in a reactive form.

```
import { FormControl, Validators } from '@angular/forms';

const productName = new FormControl('', {
    validators: [
        Validators.required,
        Validators.minLength(3)
    ]
});
```

This creates a control with an initial empty-string value and two validators.

You can inspect its value and validation state:

```
console.log(productName.value);
console.log(productName.valid);
console.log(productName.errors);
```

You can also change its value programmatically:

```
productName.setValue('Laptop');

console.log(productName.value); // Laptop
```

The control itself maintains the value and status. This explicit model is one of the defining characteristics of reactive forms.

## 3.3 Understanding `FormGroup`

A `FormGroup` combines multiple controls into a single logical form.

```
import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

const productForm = new FormGroup({
    name: new FormControl('', {
        nonNullable: true,
        validators: [
            Validators.required,
            Validators.minLength(3)
        ]
    }),
    sku: new FormControl('', {
        nonNullable: true,
        validators: [
            Validators.required
        ]
    }),
    price: new FormControl(0, {
        nonNullable: true,
        validators: [
            Validators.required,
            Validators.min(0.01)
        ]
    })
});
```

Now the application can work with the form as one unit:

```
console.log(productForm.value);
console.log(productForm.valid);
console.log(productForm.invalid);
```

The group tracks whether the overall form is valid based on the state of its controls and any validators attached to the group itself.

## 3.4 Using `FormBuilder`

For larger forms, creating each control manually can become verbose. `FormBuilder` provides a convenient way to construct form groups and controls.

```
import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
        <form [formGroup]="productForm">
            <label for="name">Product name</label>

            <input id="name" formControlName="name" />
        </form>
    `
})
export class ProductFormComponent {

    private fb = inject(FormBuilder);

    productForm = this.fb.nonNullable.group({
        name: [
            '',
            [
                Validators.required,
                Validators.minLength(3)
            ]
        ]
    });
}
```

Notice that the control is defined in TypeScript, but the HTML uses `formControlName="name"` to connect to it.

The `nonNullable` builder creates non-nullable controls, so their reset behaviour returns them to their configured initial values rather than resetting them to `null`. This is useful when designing strongly typed application forms.

# 4. Complete reactive Product Management form

We will now implement the same product creation scenario using reactive forms.

Unlike the template-driven example, the validation rules will be defined explicitly in TypeScript.

## Step 1: Generate the component

```
ng g component features/products/pages/product-reactive-form
```

## Step 2: Implement the form model and validation

File: `product-reactive-form.ts`

```
import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';

import { Product } from '../../models/product.model';

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
    selector: 'app-product-reactive-form',
    standalone: true,
    imports: [ReactiveFormsModule, CurrencyPipe],
    templateUrl: './product-reactive-form.html',
    styleUrl: './product-reactive-form.css'
})
export class ProductReactiveFormComponent {

    private fb = inject(FormBuilder);

    submitted = false;
    private nextId = 2001;

    savedProducts = signal<Product[]>([]);

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

        category: [
            '',
            Validators.required
        ],

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

    saveProduct(): void {
        this.submitted = true;

        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        const value = this.productForm.getRawValue();

        const product: Product = {
            id: this.nextId++,
            name: value.name.trim(),
            sku: value.sku.trim().toUpperCase(),
            category: value.category,
            price: value.price,
            stockQuantity: value.stockQuantity
        };

        this.savedProducts.update(products => [
            ...products,
            product
        ]);

        console.log('Saved product:', product);

        this.productForm.reset({
            name: '',
            sku: '',
            category: '',
            price: 0,
            stockQuantity: 0
        });

        this.submitted = false;
    }
}
```

### Understanding the validation configuration

Consider the name control:

```
name: [
    '',
    [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80)
    ]
]
```

The first value, `''`, is the initial value. The second argument contains the synchronous validators.

The SKU control uses `Validators.pattern()` to check the required format. The price control uses `Validators.min(0.01)` to reject a price below one paisa.

The stock quantity uses a custom `integerValidator` because a minimum-value validator alone would not reject fractional quantities.

Angular's built-in validators include `required`, `min`, `max`, `minLength`, `maxLength`, `email`, and `pattern`. Custom validators can be supplied alongside the built-in validators.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



## Step 3: Create the reactive form template

File: `product-reactive-form.html`

```
<section class="product-form-page">

    <h2>Add Product — Reactive Form</h2>

    <form
        [formGroup]="productForm"
        (ngSubmit)="saveProduct()"
        novalidate>

        <div class="form-field">
            <label for="name">Product name</label>

            <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="Enter product name"
            />

            @if (
                productForm.controls.name.invalid &&
                (productForm.controls.name.touched || submitted)
            ) {
                @if (productForm.controls.name.hasError('required')) {
                    <p class="error">Product name is required.</p>
                }

                @if (productForm.controls.name.hasError('minlength')) {
                    <p class="error">
                        Name must contain at least 3 characters.
                    </p>
                }

                @if (productForm.controls.name.hasError('maxlength')) {
                    <p class="error">
                        Name cannot exceed 80 characters.
                    </p>
                }
            }
        </div>

        <div class="form-field">
            <label for="sku">SKU</label>

            <input
                id="sku"
                type="text"
                formControlName="sku"
                placeholder="Example: LAP-1001"
            />

            @if (
                productForm.controls.sku.invalid &&
                (productForm.controls.sku.touched || submitted)
            ) {
                @if (productForm.controls.sku.hasError('required')) {
                    <p class="error">SKU is required.</p>
                }

                @if (productForm.controls.sku.hasError('pattern')) {
                    <p class="error">
                        Use the format ABC-1234.
                    </p>
                }
            }
        </div>

        <div class="form-field">
            <label for="category">Category</label>

            <select
                id="category"
                formControlName="category">

                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Office">Office</option>
            </select>

            @if (
                productForm.controls.category.invalid &&
                (productForm.controls.category.touched || submitted)
            ) {
                <p class="error">Please select a category.</p>
            }
        </div>

        <div class="form-field">
            <label for="price">Price</label>

            <input
                id="price"
                type="number"
                step="0.01"
                formControlName="price"
            />

            @if (
                productForm.controls.price.invalid &&
                (productForm.controls.price.touched || submitted)
            ) {
                @if (productForm.controls.price.hasError('min')) {
                    <p class="error">
                        Price must be greater than zero.
                    </p>
                }
            }
        </div>

        <div class="form-field">
            <label for="stockQuantity">Stock quantity</label>

            <input
                id="stockQuantity"
                type="number"
                step="1"
                formControlName="stockQuantity"
            />

            @if (
                productForm.controls.stockQuantity.invalid &&
                (productForm.controls.stockQuantity.touched || submitted)
            ) {
                @if (
                    productForm.controls.stockQuantity.hasError('min')
                ) {
                    <p class="error">
                        Stock quantity cannot be negative.
                    </p>
                }

                @if (
                    productForm.controls.stockQuantity.hasError('integer')
                ) {
                    <p class="error">
                        Stock quantity must be a whole number.
                    </p>
                }
            }
        </div>

        <button type="submit">
            Save Product
        </button>

        <button
            type="button"
            (click)="productForm.reset({
                name: '',
                sku: '',
                category: '',
                price: 0,
                stockQuantity: 0
            }); submitted = false">

            Reset
        </button>

    </form>

    @if (savedProducts().length > 0) {
        <h3>Saved Products</h3>

        @for (product of savedProducts(); track product.id) {
            <article class="saved-product">
                <strong>{{ product.name }}</strong>
                <span>{{ product.sku }}</span>
                <span>{{ product.price | currency:'INR' }}</span>
                <span>Stock: {{ product.stockQuantity }}</span>
            </article>
        }
    }

</section>
```

## Step 4: Add the component styles

File: `product-reactive-form.css`

You can reuse the styles from the template-driven form:

```
.product-form-page {
    max-width: 650px;
    margin: 30px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
}

.form-field input,
.form-field select {
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
}

.error {
    color: #b91c1c;
    font-size: 14px;
}

button {
    padding: 10px 14px;
    margin-right: 8px;
    cursor: pointer;
}

.saved-product {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
    margin-top: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
}
```

## Step 5: Display the component

For direct display during this lab, import the reactive-form component into the root component:

```
import { Component } from '@angular/core';
import { ProductReactiveFormComponent } from './features/products/pages/product-reactive-form/product-reactive-form';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ProductReactiveFormComponent],
    template: `<app-product-reactive-form />`
})
export class AppComponent {}
```

Adjust the path to match your generated files. If the application already uses routing, you can display the form through a route instead.

Run:

```
ng serve
```

Try saving an invalid product, then correct the validation errors and submit again. Valid submissions will appear in the saved-products section.

This reactive implementation also uses a Signal to maintain the list of products saved during the current session. The form itself is still a reactive form, driven by `FormGroup` and its controls.

# 5. Validation in Angular

## 5.1 What is form validation?

Form validation checks whether the entered data satisfies expected rules.

In our example, a product should not be saved without a name, with a malformed SKU, with a negative price, or with a fractional stock quantity.

Validation has two main purposes:

- Data quality: reject values that do not satisfy the application's requirements.
- User experience: explain what needs to be corrected before the form can be submitted.

Angular supports synchronous validators, asynchronous validators, and custom validation functions.&#x20;


## 5.2 Built-in validators

| Validator        | Purpose                             | Product example                             |
| ---------------- | ----------------------------------- | ------------------------------------------- |
| `required`       | Rejects empty values                | Product name cannot be empty                |
| `minLength(n)`   | Enforces minimum string length      | Name must contain at least three characters |
| `maxLength(n)`   | Enforces maximum string length      | Name cannot exceed 80 characters            |
| `pattern(regex)` | Requires a value to match a pattern | SKU must follow `ABC-1234`                  |
| `min(n)`         | Enforces a numeric lower bound      | Price must be positive                      |
| `max(n)`         | Enforces a numeric upper bound      | Price cannot exceed a configured maximum    |
| `email`          | Checks email format                 | Contact email must have the expected format |

For template-driven forms, these rules can be specified using attributes that Angular's form directives recognize. For reactive forms, they are commonly supplied as validator functions in the component class.

## 5.3 Showing validation errors at the right time

It is generally a poor user experience to display every validation error immediately when a form opens.

A common pattern is:

```
@if (control.invalid && (control.touched || submitted)) {
    <p class="error">Please correct this value.</p>
}
```

The message is displayed when:

- The control is invalid, and
- The user has touched the control or attempted submission.

When the user submits an invalid reactive form, call:

```
this.productForm.markAllAsTouched();
```

This marks all controls as touched so the user can see the validation problems that need to be corrected.

The template-driven equivalent in our example is:

```
form.control.markAllAsTouched();
```

## 5.4 Custom validators

Built-in validators cannot express every business rule. A custom validator lets us define a rule that matches our application's needs.

Our `integerValidator` is one example: it rejects fractional stock quantities.

A custom synchronous validator generally receives an `AbstractControl` and returns either:

- `null` when the value is valid, or
- A validation-error object when it is invalid.

For instance:

```
import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn
} from '@angular/forms';

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
```

The returned key, `integer`, becomes available through:

```
control.hasError('integer');
```

This separation is useful because validation logic can be tested independently of the template.

## 5.5 Cross-field validation

Sometimes the rule depends on more than one field.

For example, consider a discount form where the discount percentage must not exceed the maximum allowed by the selected product category.

In reactive forms, this kind of rule can be implemented with a validator on the containing `FormGroup`, because the validator needs access to more than one control.

The general pattern is:

```
const form = this.fb.nonNullable.group(
    {
        discountPercentage: [0],
        maximumDiscount: [20]
    },
    {
        validators: [
            // Custom validator that compares both controls
        ]
    }
);
```

The group-level validator can read both values and return a validation error if the discount is too high.

Group-level validation is preferable to independently duplicating a related business rule on multiple controls.

## 5.6 Asynchronous validation

Some validation requires an external data source. For example, the application may need to check whether a product SKU already exists in the backend.

A typical asynchronous-validation flow is:

1. The user enters an SKU.
2. Synchronous rules validate its format.
3. If those rules pass, an asynchronous validator calls an appropriate service.
4. The control remains in a `PENDING` state while validation is in progress.
5. The validation result determines whether the control is valid.

Angular provides async-validator functions that return a Promise or Observable. They should be finite, and Angular runs asynchronous validators after synchronous validators pass.&#x20;

For performance, avoid sending a validation request on every keystroke. Reactive controls and template-driven controls can use `updateOn: 'blur'` to defer validation until the user leaves the field.

Important: Client-side validation improves the user experience, but the backend must independently validate data before saving it. A user can bypass or modify the frontend, so form validity alone is not a security boundary.

# 6. Editing an existing product

In a real Product Management application, the same form should support both adding and editing products.

Reactive forms make programmatic updates straightforward. Suppose the user selects a product to edit.

```
loadProductForEdit(product: Product): void {
    this.productForm.patchValue({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stockQuantity: product.stockQuantity
    });
}
```

`patchValue()` updates the supplied controls without requiring every control to be included.

For comparison:

```
this.productForm.setValue({
    name: 'Laptop',
    sku: 'LAP-1001',
    category: 'Electronics',
    price: 65000,
    stockQuantity: 12
});
```

`setValue()` requires a complete value matching the form's control structure, whereas `patchValue()` is useful when updating only selected fields.

For a proper add/edit workflow, the component should also keep track of whether the user is creating a new product or editing an existing product. On submission, update the corresponding product instead of always inserting a new one.

The form model and validators can be reused for both operations, reducing duplication.

# 7. Choosing the right form approach

The Product Management form demonstrates why both approaches are valuable.

| Requirement                                      | Recommended approach               | Reason                                                                                  |
| ------------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------- |
| Basic contact form                               | Template-driven                    | Simple binding and validation can be defined directly in the template                   |
| Basic product entry                              | Either approach                    | Both approaches support the required fields and validation                              |
| Complex product form with dynamic fields         | Reactive                           | The form model is explicit and can be modified programmatically                         |
| Conditional validation rules                     | Often reactive                     | Validators can be added, removed, or changed through the form model                     |
| Complex cross-field validation                   | Often reactive                     | Group-level validators provide direct access to the related controls                    |
| Highly dynamic enterprise form                   | Reactive                           | Easier to create and manage controls from metadata                                      |
| Existing application using `ngModel` extensively | Template-driven may be appropriate | Maintaining the existing design can be simpler than rewriting it                        |
| Form logic requiring focused unit tests          | Reactive is often convenient       | Controls and validators can be tested without relying entirely on template interactions |

Neither approach is inherently unsuitable for enterprise applications. The appropriate choice depends on the complexity of the form, how validation is managed, and the conventions already used in the application.

## 8. Angular 22: What about Signal Forms?

Since this course targets modern Angular, it is useful to know that Angular 22's Signal Forms API is stable. It provides a further approach in which the form model is based on a writable Signal and fields are defined through Angular's Signal Forms APIs.&#x20;


For example, the core form model starts with:

```
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';

const product = signal({
    name: '',
    sku: '',
    category: '',
    price: 0,
    stockQuantity: 0
});

const productForm = form(product);
```

This creates a Signal Forms model associated with the product data.

Signal Forms introduce different APIs for fields, validation, and form state. They should not be confused with the `FormGroup` and `FormControl` APIs demonstrated in the reactive-forms section.

For your current training module, I recommend teaching template-driven forms and reactive forms first, as specified in the course outline. Signal Forms can be introduced as an additional Angular 22 topic after participants understand the two established approaches.

# 9. Common mistakes and best practices

| Common mistake                                                                  | Recommended approach                                                    |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Using `[(ngModel)]` without importing `FormsModule`                             | Import `FormsModule` in the standalone component                        |
| Omitting a unique `name` from a template-driven control                         | Add a descriptive `name` so Angular registers the control               |
| Defining reactive controls in the template instead of the TypeScript form model | Create controls using `FormControl`, `FormGroup`, or `FormBuilder`      |
| Displaying errors before the user interacts with a field                        | Check `touched`, `dirty`, or form submission state                      |
| Allowing invalid values to be submitted                                         | Check form validity in the submission handler                           |
| Writing all validation logic into template expressions                          | Put reusable validation in validators or component logic                |
| Forgetting to mark controls as touched after an invalid submission              | Use `markAllAsTouched()` to reveal validation errors                    |
| Treating form reset as the same as updating a saved product                     | Implement explicit create/edit logic and reset the appropriate controls |
| Treating client-side validation as security                                     | Validate inputs again in the backend                                    |

# 10. Knowledge check

1\. Which Angular module is required for template-driven forms?

ReactiveFormsModule

FormsModule

HttpClientModule only

RouterModule

2\. Which reactive form API groups related controls into one form model?

FormGroup

NgClass

FormDirective only

CurrencyPipe

3\. What does Validators.pattern() check?

Whether a form is submitted

Whether a value matches a specified pattern

Whether an HTTP request succeeded

Whether a control was visited

4\. What should a reactive form submission handler do when the form is invalid?

Save it and correct it later

Ignore validation errors

Prevent submission and display the validation errors

Reload the entire application

5\. Which method is useful when updating only some controls in a reactive form?

resetAll()

patchValue()

ngSubmit()

markForCheck()

Check answers

## Official Angular references

- [Angular forms overview](https://angular.dev/guide/forms?utm_source=chatgpt.com)
- [Template-driven forms](https://angular.dev/guide/forms/template-driven-forms?utm_source=chatgpt.com)
- [Reactive forms](https://angular.dev/guide/forms/reactive-forms?utm_source=chatgpt.com)
- [Form validation](https://angular.dev/guide/forms/form-validation?utm_source=chatgpt.com)
- [Built-in Validators API](https://angular.dev/api/forms/Validators?utm_source=chatgpt.com)
- [Signal Forms](https://angular.dev/guide/forms/signals/overview?utm_source=chatgpt.com)

