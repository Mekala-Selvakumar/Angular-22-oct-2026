# Module 4: Components Fundamentals

This module covers three topics: Creating Components, Component Communication, and Data Binding, followed by a lab to build the first Angular application feature.&#x20;

 


We will continue with the same Product Management application created in Module 3. By the end of this module, you will understand how to divide a UI into reusable components, pass product data between components, handle user interactions, and keep the displayed UI synchronized with application state.

## 1. What is an Angular component?

An Angular component is a self-contained building block responsible for a portion of the user interface (UI).

For example, a Product Management application may contain a product listing page with a search box, a category filter, several product cards, and an Add Product button.

Instead of putting the entire UI and its behaviour into one large component, we divide it into smaller components with clearly defined responsibilities.

Product Management Page

Coordinates the product listing UI

Product Search

Search and filters

Product Form

Add or edit products

Product Card

Displays one product

Product List

Displays a collection

Each component can own its view and behaviour, while communicating with other components through defined interfaces.

### Why do we need components?

Components help us achieve:

- Reusability: Display the same product card in several parts of the application.
- Separation of responsibilities: Keep product listing, search, and editing logic separate.
- Maintainability: Change the product card without rewriting the entire page.
- Testability: Test a component's behaviour independently.
- Collaboration: Different developers can work on different UI components with clear contracts.

A component is not simply an HTML fragment. It connects a TypeScript class, a template, styles, and Angular metadata into a functional UI unit.

## 2. Creating components

### 2.1 Anatomy of an Angular component

An Angular component has three essential parts: a TypeScript class, a template, and a selector. Component metadata, supplied through the `@Component` decorator, connects them. Styles are optional but commonly included.&#x20;


Consider a component that displays one product.

```
import { Component } from '@angular/core';

@Component({
    selector: 'app-product-card',
    standalone: true,
    template: `
        <h3>Laptop</h3>
        <p>Price: ₹65,000</p>
    `,
    styles: `
        h3 {
            color: navy;
        }
    `
})
export class ProductCardComponent {
}
```

Let us examine each part.

| Part                                | Purpose                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `@Component`                        | Provides metadata that Angular uses to define the component                 |
| `selector`                          | Specifies the element name used to place the component in a template        |
| `standalone`                        | Declares that the component can be imported without an NgModule declaration |
| `template`                          | Defines the HTML that Angular renders                                       |
| `styles`                            | Defines component-specific styles                                           |
| `export class ProductCardComponent` | Defines the component's TypeScript class                                    |

The selector allows another component to include it as follows:

```
<app-product-card />
```

Angular recognizes this element in the parent template, creates a component instance, and renders its view within the host element.

### 2.2 Inline templates versus external templates

Angular supports both inline and external templates.

Inline template

```
@Component({
    selector: 'app-product-card',
    standalone: true,
    template: `<h3>Product Details</h3>`
})
export class ProductCardComponent {}
```

External template

```
@Component({
    selector: 'app-product-card',
    standalone: true,
    templateUrl: './product-card.html',
    styleUrl: './product-card.css'
})
export class ProductCardComponent {}
```

In the external-template example, HTML and CSS are stored in separate files.

For the Product Management application, external templates are a sensible choice for substantial components because they keep presentation separate from TypeScript logic. Inline templates remain convenient for very small components.

### 2.3 Generate components using Angular CLI

From the `product-management` project directory, execute:

```
ng generate component features/products/components/product-card
```

The shorter equivalent is:

```
ng g c features/products/components/product-card
```

The Angular CLI generates the component files and configures the component according to the workspace settings.

Depending on the Angular CLI version and naming configuration, the files may resemble:

```
src/app/features/products/components/product-card/
├── product-card.ts
├── product-card.html
├── product-card.css
└── product-card.spec.ts
```

Older projects commonly use filenames such as `product-card.component.ts`, `product-card.component.html`, and `product-card.component.css`.

Use the filenames actually generated in your project.

### 2.4 How to use a component inside another component

For a standalone component, its parent must import it in the `imports` array before using its selector in the template.&#x20;

```
import { Component } from '@angular/core';
import { ProductCardComponent } from './product-card';

@Component({
    selector: 'app-product-page',
    standalone: true,
    imports: [ProductCardComponent],
    template: `
        <h2>Products</h2>
        <app-product-card />
    `
})
export class ProductPageComponent {}
```

The example assumes that the component is exported from `./product-card`; adjust that import path to match the generated file.

The important relationship is:

- `ProductPageComponent` is the parent.
- `ProductCardComponent` is the child.
- The parent's template contains the child's selector.
- The parent imports the child component so Angular can use it in the template.

This is called component composition. Large Angular applications are built by composing smaller components into increasingly complex views.

## 3. Component communication

A component-based application needs a clear way to pass information between components.

For our Product Management application, consider this example:

The product-list component stores the collection of products. Each product-card component displays one product and raises events when a user clicks Edit or Delete.

ProductListComponent

Owns the list and handles product updates

Inputs

Product data

Outputs

Edit / delete events

ProductCardComponent

Displays product details and reports user actions

This establishes a predictable communication pattern:

- Parent to child: use inputs.
- Child to parent: use outputs.
- Sibling components: commonly communicate through their common parent or a shared service.

### 3.1 Parent-to-child communication using `input()`

Suppose the parent component has a product:

```
const product = {
    id: 101,
    name: 'Laptop',
    price: 65000,
    stockQuantity: 12
};
```

The child needs to receive and display this data.

Modern Angular supports signal-based inputs using the `input()` API. Required inputs can be declared using `input.required<T>()`.&#x20;


First, create the product model.

File: `product.ts`

```
export interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
}
```

Next, define the child component.

File: `product-card.ts`

```
import { Component, input, output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
    selector: 'app-product-card',
    standalone: true,
    template: `
        <article>
            <h3>{{ product().name }}</h3>

            <p>Product ID: {{ product().id }}</p>
            <p>Price: {{ product().price }}</p>
            <p>Available stock: {{ product().stockQuantity }}</p>

            <button (click)="edit.emit(product().id)">
                Edit
            </button>

            <button (click)="remove.emit(product().id)">
                Delete
            </button>
        </article>
    `
})
export class ProductCardComponent {
    product = input.required<Product>();

    edit = output<number>();
    remove = output<number>();
}
```

The `product` input is required because the component cannot meaningfully display a product without receiving its data.

Notice that `product()` is used to read the product, because `input()` returns an `InputSignal`.

The child receives the product from the parent; it does not create its own independent copy of that product.

### 3.2 Passing input data from the parent

Now use the child component inside the product-list component.

File: `product-list.ts`

```
import { Component, signal } from '@angular/core';

import { Product } from '../../models/product';
import { ProductCardComponent } from '../components/product-card';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [ProductCardComponent],
    template: `
        <h2>Product List</h2>

        @for (product of products(); track product.id) {
            <app-product-card
                [product]="product"
                (edit)="editProduct($event)"
                (remove)="deleteProduct($event)"
            />
        } @empty {
            <p>No products available.</p>
        }
    `
})
export class ProductListComponent {

    products = signal<Product[]>([
        {
            id: 101,
            name: 'Laptop',
            price: 65000,
            stockQuantity: 12
        },
        {
            id: 102,
            name: 'Keyboard',
            price: 1500,
            stockQuantity: 40
        },
        {
            id: 103,
            name: 'Monitor',
            price: 12000,
            stockQuantity: 8
        }
    ]);

    editProduct(productId: number): void {
        console.log('Edit product:', productId);
    }

    deleteProduct(productId: number): void {
        this.products.update(products =>
            products.filter(product => product.id !== productId)
        );
    }
}
```

Here, `[product]="product"` passes the current product object to the child. The `@for` block renders one product card per product.

`track product.id` allows Angular to identify records using their unique identifiers. This helps Angular efficiently update the rendered collection when items are added or removed.&#x20;




### 3.3 Child-to-parent communication using `output()`

In the child component, we declared:

```
edit = output<number>();
remove = output<number>();
```

These define two custom output events.

When the user clicks Edit, the child runs:

```
edit.emit(product().id);
```

The parent listens for that event:

```
<app-product-card
    [product]="product"
    (edit)="editProduct($event)"
/>
```

The `$event` variable contains the value emitted by the child—in this case, the product ID.

Angular's `output()` API supports strongly typed custom events and allows a child component to emit data to a parent.&#x20;


Similarly, when Delete is clicked, the child emits the product ID through `remove`. The parent handles the event and updates its product list.

Design principle: The child reports the user's action; the parent decides what to do with it. This keeps the product card reusable and prevents it from taking ownership of the entire product collection.

### 3.4 What about `@Input` and `@Output`?

Older Angular applications commonly use decorator-based APIs:

```
@Input() product!: Product;
@Output() remove = new EventEmitter<number>();
```

These APIs remain supported. The modern signal-based alternatives use `input()` and `output()`.

For this course, learn the modern forms first while recognizing the decorator-based APIs when maintaining existing applications.

| Modern API                  | Traditional API                                | Purpose                                  |
| --------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `input.required<Product>()` | `@Input({required: true})`                     | Receive a required value from the parent |
| `output<number>()`          | `@Output() event = new EventEmitter<number>()` | Emit a custom event to the parent        |

### 3.5 Component communication best practices

Prefer explicit inputs and outputs for simple parent-child communication. Do not make a child access or modify its parent's internal state directly.

For unrelated components that need to share application-wide data, a shared service or a suitable state-management approach is generally more maintainable. We will cover services and state management in later modules.

## 4. Data binding

### 4.1 What is data binding?

Data binding creates a connection between a component's data and its template. It allows the UI to display values, respond to events, and reflect user input without manually manipulating DOM elements.

Angular templates support interpolation, property binding, event binding, and two-way binding.&#x20;


We will use the same Product Management application to understand each type.

### 4.2 Interpolation

Interpolation uses double curly braces to display a value in the template.

```
export class ProductSummaryComponent {
    productName = 'Laptop';
    price = 65000;
}
```

```
<h2>{{ productName }}</h2>
<p>Price: ₹{{ price }}</p>
```

Angular evaluates the expressions and displays:

```
Laptop
Price: ₹65000
```

Interpolation is mainly used to render textual values. It is not intended as a general mechanism for setting DOM properties.

### 4.3 Property binding

Property binding uses square brackets to set a property on an HTML element or an Angular component or directive.

For example, a product that is out of stock should not be available for purchase.

```
export class ProductSummaryComponent {
    stockQuantity = 0;
}
```

```
<button [disabled]="stockQuantity === 0">
    Add to Cart
</button>
```

Angular evaluates the expression and updates the button's `disabled` property.

Property binding is also used to pass data to another component:

```
<app-product-card [product]="selectedProduct" />
```

In that case, the property belongs to the child Angular component rather than a native HTML element.

### 4.4 Event binding

Event binding uses parentheses to listen for events.

```
export class ProductSummaryComponent {
    stockQuantity = 10;

    purchaseProduct(): void {
        if (this.stockQuantity > 0) {
            this.stockQuantity--;
        }
    }
}
```

```
<p>Stock: {{ stockQuantity }}</p>

<button
    [disabled]="stockQuantity === 0"
    (click)="purchaseProduct()">
    Purchase
</button>
```

When the user clicks the button, Angular invokes the method.

In a real application, a purchase operation would normally call a backend API, because the browser's stock quantity is not authoritative and must not be used to enforce inventory rules.

### 4.5 Two-way binding

Two-way binding combines property binding and event handling. The standard syntax is known as the banana-in-a-box syntax:

```
[(ngModel)]="productName"
```

For example:

```
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-product-search',
    standalone: true,
    imports: [FormsModule],
    template: `
        <label for="productName">Product name</label>

        <input
            id="productName"
            [(ngModel)]="productName"
        />

        <p>Searching for: {{ productName }}</p>
    `
})
export class ProductSearchComponent {
    productName = '';
}
```

Here:

- `FormsModule` supplies `ngModel`.
- When the user enters a value, `productName` is updated.
- When the component property changes, the input reflects the new value.

The example demonstrates basic two-way binding. Actual product searching and filtering will be implemented in subsequent modules.

### 4.6 Comparison of the four binding types

| Binding       | Syntax                    | Direction                        | Product Management example   |
| ------------- | ------------------------- | -------------------------------- | ---------------------------- |
| Interpolation | `{{ expression }}`        | Component to text                | Display product name         |
| Property      | `[property]="expression"` | Component to property            | Disable purchase button      |
| Event         | `(event)="handler()"`     | Event to component handler       | Handle Edit or Delete clicks |
| Two-way       | `[(ngModel)]="property"`  | Component and input synchronized | Maintain search text         |

For component-to-component interaction, property binding is commonly used with inputs, while event binding is commonly used with outputs.

## 5. Practical lab: First Product Management application

The goal is to implement a small product listing where:

- The parent maintains the list of products.
- Each child card displays product details.
- The user can remove a product.
- The interface updates when the list changes.

### Step 1: Generate the components

From the project root, run:

```
ng g component features/products/pages/product-list
ng g component features/products/components/product-card
```

Create or reuse the `Product` interface from Module 3.

### Step 2: Implement the product-card component

Use the child component implementation from Section 3.1, which declares the product input and the Edit/Delete output events.

### Step 3: Implement the product-list component

Use the implementation from Section 3.2, which stores the list in a Signal, passes each product to the card component, and handles delete events.

### Step 4: Display the product list from the root component

Import the product-list component into the root component.

For example:

```
import { Component } from '@angular/core';
import { ProductListComponent } from './features/products/pages/product-list';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ProductListComponent],
    template: `
        <main>
            <h1>Product Management</h1>
            <app-product-list />
        </main>
    `
})
export class AppComponent {}
```

Adjust the import path based on your generated file names and folder structure. If routing is already configured in Module 3, you can instead display the product-list component through the Angular Router.

### Step 5: Run and verify

```
ng serve
```

Check that the application displays three products. Click Delete on any card and verify that the corresponding product disappears from the list.

### Expected output

## Product Management

Illustrative UI for the lab

Laptop

ID: 101 · Stock: 12

### ₹65,000

Edit

Delete

Keyboard

ID: 102 · Stock: 40

### ₹1,500

Edit

Delete

The actual layout will depend on your component HTML and CSS.

## 6. Common mistakes to discuss with experienced developers

| Mistake                                                                  | Why it matters                                                                      |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Forgetting to import a standalone child component                        | Angular cannot resolve its selector in the parent's template                        |
| Forgetting to bind the product input                                     | The child does not receive the product data it expects                              |
| Using `product` instead of `product()` for a signal-based input          | `input()` returns a signal that must be read by calling it                          |
| Emitting a product ID but handling it as a full product object           | The event payload and handler signature do not agree                                |
| Modifying the parent's collection inside each child                      | This creates unnecessary coupling and makes reuse harder                            |
| Tracking a collection using an unstable identifier                       | Angular can perform unnecessary DOM updates or associate rendered items incorrectly |
| Treating frontend state as the source of truth for inventory or payments | The backend must enforce business rules and data integrity                          |

## 7. Knowledge check

1\. What is the primary responsibility of the @Component decorator?

Create a database table

Provide Angular metadata for a component

Install npm dependencies

Define an HTTP API

2\. Which modern Angular API is used for a required parent-to-child input?

output.required\<Product>()

signal.input\<Product>()

input.required\<Product>()

computed\<Product>()

3\. How should a child component notify its parent that a product should be deleted?

Directly modify the parent's private array

Emit an output event and let the parent handle it

Reload index.html

Change the parent's template

4\. Which syntax listens for a button click?

[click]

{{click}}

(click)

[(click)]

5\. What does [(ngModel)] commonly provide?

Only CSS styling

Two-way synchronization between a supported form control and a component property

HTTP communication

Component routing

Check answers

### Official references

For additional technical detail, consult the Angular documentation:

- [Anatomy of a component](https://angular.dev/guide/components?utm_source=chatgpt.com)
- [Accepting data with inputs](https://angular.dev/guide/components/inputs?utm_source=chatgpt.com)
- [Custom events with outputs](https://angular.dev/guide/components/outputs?utm_source=chatgpt.com)
- [Template binding](https://angular.dev/guide/templates/binding?utm_source=chatgpt.com)
- [Built-in control flow](https://angular.dev/guide/templates/control-flow?utm_source=chatgpt.com)


