# Module 5: Templates & Directives

This module covers : Interpolation, Property Binding, Event Binding, Two-Way Binding, Structural Directives, and Attribute Directives.&#x20;


We will extend the Product Management application from the previous modules into a working product catalogue with search, category filtering, stock indicators, and product removal.

 
Version note: Modern Angular provides built-in template control flow such as `@if` and `@for`. The older `*ngIf` and `*ngFor` directives are deprecated as of Angular 20, so we will understand the traditional syntax for existing applications but use the modern syntax in our main demo.&#x20;

## 1. Understanding Angular templates

A template defines the UI that Angular renders. It is usually written in HTML with additional Angular syntax for displaying data, responding to events, and controlling which elements appear.

Consider a product:

```
export class ProductSummaryComponent {
    productName = 'Laptop';
    price = 65000;
    stockQuantity = 4;
}
```

Its template might contain:

```
<h2>{{ productName }}</h2>
<p>Price: ₹{{ price }}</p>
<p>Available stock: {{ stockQuantity }}</p>
```

Angular evaluates the expressions and displays the product information.

A crucial distinction is that the template describes what should be displayed, while the component class provides the data and behaviour. Angular manages the relationship between the two; developers generally do not need to locate and update DOM elements manually.

Angular's template syntax supports dynamic text, property bindings, event handlers, class and style bindings, and other features.&#x20;


## 2. Interpolation

### 2.1 What is interpolation?

Interpolation uses double curly braces `{{ }}` to display a component property or expression as text in the template.

Syntax

```
{{ expression }}
```

### Product Management example

Suppose our product has a name, price, and category.

File: `product-summary.ts`

```
import { Component } from '@angular/core';

@Component({
    selector: 'app-product-summary',
    standalone: true,
    template: `
        <h2>{{ productName }}</h2>
        <p>Category: {{ category }}</p>
        <p>Price: ₹{{ price }}</p>
        <p>Stock: {{ stockQuantity }}</p>
    `
})
export class ProductSummaryComponent {
    productName = 'Laptop';
    category = 'Electronics';
    price = 65000;
    stockQuantity = 12;
}
```

Angular evaluates the expressions and renders the values in the HTML.

### 2.2 Interpolation with expressions

Templates can evaluate expressions, not just simple property names.

```
<p>Price including 18% tax: ₹{{ price * 1.18 }}</p>

<p>{{ stockQuantity > 0 ? 'Available' : 'Out of stock' }}</p>

<p>Product name in uppercase: {{ productName.toUpperCase() }}</p>
```

For example, if `price` is `65000`, the first expression produces `76700`.

However, avoid putting complicated business calculations into templates. Put reusable business logic in TypeScript methods or properties, and use Pipes when the requirement is presentation formatting.

### 2.3 Important points

Interpolation:

- Displays dynamic values as text.
- Can evaluate suitable expressions.
- Escapes interpolated string values in HTML contexts, helping prevent them from being interpreted as HTML markup.
- Does not provide general-purpose DOM property assignment.

For example, if a product name contains text such as `<script>`, interpolation treats it as text rather than intentionally executing it as markup.

## 3. Property binding

### 3.1 What is property binding?

Property binding allows a component to set a property of an HTML element, directive, or child component.

Syntax

```
[propertyName]="expression"
```

Square brackets tell Angular to evaluate the expression and assign its value instead of treating the value as an ordinary text string.

### 3.2 Example: Disable a purchase button when a product is unavailable

```
export class ProductSummaryComponent {
    stockQuantity = 0;
}
```

```
<h2>Product: Laptop</h2>

<button [disabled]="stockQuantity === 0">
    Add to Cart
</button>
```

Because `stockQuantity` is zero, the button is disabled. When the quantity becomes positive, Angular updates the button's disabled state.

Compare these two expressions:

```
<button disabled="false">Add to Cart</button>
<button [disabled]="false">Add to Cart</button>
```

For a native boolean HTML attribute, the first form still includes `disabled`; the literal text `"false"` does not make it false. The second form sets the DOM property to the boolean value `false`, so the button is enabled.

### 3.3 Binding an image source

A product card may also display an image.

```
export class ProductSummaryComponent {
    productImage = '/images/laptop.png';
}
```

```
<img
    [src]="productImage"
    alt="Laptop"
    width="200"
/>
```

When `productImage` changes, Angular updates the image source accordingly.

### 3.4 Property binding for child components

Property binding is also used for component inputs.

```
<app-product-card [product]="selectedProduct" />
```

Here, `product` is an input of `ProductCardComponent`, and `selectedProduct` is a property in the parent component.

The same syntax applies to native element properties and Angular component inputs, but the target property is different.

### 3.5 Property binding versus attribute binding

These concepts are related but not identical.

```
<button [disabled]="isUnavailable">Purchase</button>
```

This sets the DOM property.

```
<button [attr.aria-label]="purchaseLabel">Purchase</button>
```

This sets an HTML attribute, in this case an accessibility attribute.

Use property binding for element behaviour and state. Use attribute binding when you need to control a particular HTML attribute, such as an ARIA attribute or an attribute that has no corresponding DOM property.

## 4. Event binding

### 4.1 What is event binding?

Event binding allows a template to call a component method when an event occurs.

Syntax

```
(eventName)="methodName()"
```

Angular supports native events such as `click`, `input`, `change`, `submit`, `mouseenter`, and `mouseleave`.

### 4.2 Example: Remove a product

Suppose a product-list component holds a product collection.

```
interface Product {
    id: number;
    name: string;
    price: number;
}

export class ProductListComponent {
    products: Product[] = [
        { id: 101, name: 'Laptop', price: 65000 },
        { id: 102, name: 'Keyboard', price: 1500 }
    ];

    deleteProduct(productId: number): void {
        this.products = this.products.filter(
            product => product.id !== productId
        );
    }
}
```

The template can invoke the method through event binding:

```
@for (product of products; track product.id) {
    <div>
        <h3>{{ product.name }}</h3>

        <button (click)="deleteProduct(product.id)">
            Remove
        </button>
    </div>
}
```

When the user clicks Remove, Angular calls `deleteProduct()` with the selected product's ID. The method creates a new array containing the remaining products.

This example uses the modern `@for` block. We will examine why that matters in the structural-directives section.

### 4.3 Using `$event`

Angular exposes the event value through `$event`.

For a native input element:

```
<input
    type="text"
    (input)="onSearchInput($event)"
/>
```

```
onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    console.log(inputElement.value);
}
```

`event.target` is typed broadly as an `EventTarget`, so the code narrows it to `HTMLInputElement` before accessing `.value`.

For many forms, `[(ngModel)]` or reactive forms offer a more convenient approach than manually reading input events. Event binding is particularly useful for buttons, custom component outputs, and actions that need explicit handlers.

## 5. Two-way binding

### 5.1 What is two-way binding?

Two-way binding synchronizes a value between a UI control and component state.

Angular's commonly used syntax for template-driven form controls is:

```
[(ngModel)]="propertyName"
```

This combines property binding (`[]`) and event binding (`()`), which is why it is informally called banana-in-a-box syntax. To use `ngModel`, import `FormsModule`.&#x20;


### 5.2 Example: Product search box

```
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-product-search',
    standalone: true,
    imports: [FormsModule],
    template: `
        <label for="search">Search products</label>

        <input
            id="search"
            type="search"
            [(ngModel)]="searchTerm"
        />

        <p>Current search: {{ searchTerm }}</p>
    `
})
export class ProductSearchComponent {
    searchTerm = '';
}
```

When a user enters `Laptop` into the input, the `searchTerm` property becomes `Laptop`, and the template displays the same value below the input.

When the component changes `searchTerm` programmatically, the input also reflects that change.

### 5.3 How two-way binding works conceptually

The expression:

```
<input [(ngModel)]="searchTerm">
```

is shorthand for the combination of a value binding and a change handler:

```
<input
    [ngModel]="searchTerm"
    (ngModelChange)="searchTerm = $event"
/>
```

The two parts perform different jobs:

- `[ngModel]` passes the current value to the form control.
- `(ngModelChange)` updates the component property when the control value changes.

For the full Product Management demo, two-way binding will power the product search field, category selection, and low-stock filter.

# 6. Structural directives and template control flow

## 6.1 What is a structural directive?

A structural directive changes the structure of the rendered UI by adding, removing, or repeating template content. Traditional examples include `*ngIf` and `*ngFor`.&#x20;


In a Product Management application, structural behaviour is needed to:

- Display a product only when it meets a condition.
- Render a list of products.
- Show a message when no products match the filters.
- Display different content depending on product stock status.

Modern Angular offers built-in control-flow blocks—`@if`, `@for`, and `@switch`—for these common use cases.

## 6.2 Conditional rendering with `@if`

Suppose we should show an alert only when a product is out of stock.

```
export class ProductSummaryComponent {
    stockQuantity = 0;
}
```

```
@if (stockQuantity === 0) {
    <p>Out of stock. Please check back later.</p>
} @else {
    <p>Product is available.</p>
}
```

Angular renders the appropriate block based on the condition.

Notice that this is more than merely hiding text with CSS: the inactive branch is not rendered as part of the view.

## 6.3 Repeating elements with `@for`

A product catalogue normally contains many products.

```
products = [
    { id: 101, name: 'Laptop', price: 65000 },
    { id: 102, name: 'Keyboard', price: 1500 },
    { id: 103, name: 'Monitor', price: 12000 }
];
```

```
<ul>
    @for (product of products; track product.id) {
        <li>
            {{ product.name }} — ₹{{ product.price }}
        </li>
    } @empty {
        <li>No products available.</li>
    }
</ul>
```

The `@for` block renders one `<li>` for each product. The `@empty` block provides fallback content when the collection contains no items.

### Why do we use `track product.id`?

Angular uses the tracking expression to associate each product with its rendered DOM elements. A stable, unique identifier allows Angular to reuse the appropriate elements when the collection changes.&#x20;



For business records, a unique product ID is usually a better tracking key than an array index.

## 6.4 Multiple conditions with `@switch`

Use `@switch` when you need to select among several distinct cases.

```
@switch (product.stockStatus) {
    @case ('AVAILABLE') {
        <p>Product available</p>
    }
    @case ('LOW_STOCK') {
        <p>Only a few items remain</p>
    }
    @case ('OUT_OF_STOCK') {
        <p>Currently unavailable</p>
    }
    @default {
        <p>Stock status unknown</p>
    }
}
```

This is especially useful when the UI depends on a domain status such as an order state, payment status, or inventory state.

## 6.5 What about `*ngIf`, `*ngFor`, and `*ngSwitch`?

Experienced Angular developers will encounter these constructs in older applications.

Traditional conditional directive:

```
<p *ngIf="stockQuantity === 0">
    Out of stock
</p>
```

Traditional iteration directive:

```
<div *ngFor="let product of products; trackBy: trackById">
    {{ product.name }}
</div>
```

Traditional switch directives:

```
<div [ngSwitch]="product.stockStatus">
    <p *ngSwitchCase="'AVAILABLE'">Available</p>
    <p *ngSwitchCase="'OUT_OF_STOCK'">Out of stock</p>
    <p *ngSwitchDefault>Status unknown</p>
</div>
```

The older `*ngIf` and `*ngFor` directives are deprecated in modern Angular. Prefer built-in control flow for new code, but be able to read and maintain the traditional syntax in existing applications.&#x20;


### How does the asterisk syntax work?

Consider:

```
<div *ngIf="isAvailable">
    Product available
</div>
```

Conceptually, Angular expands the shorthand into an `ng-template` construct:

```
<ng-template [ngIf]="isAvailable">
    <div>
        Product available
    </div>
</ng-template>
```

`ng-template` represents a template fragment that Angular can instantiate when required. This explains how a structural directive can add or remove a block of content from the view.

A traditional shorthand element can have only one structural directive using the `*` syntax. When multiple structural operations are required, nested containers or templates are often used.

### Structural directives versus control-flow blocks

| Traditional structural directives                                     | Modern control flow                              |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| `*ngIf`                                                               | `@if`                                            |
| `*ngFor`                                                              | `@for`                                           |
| `ngSwitch`, `*ngSwitchCase`, `*ngSwitchDefault`                       | `@switch`, `@case`, `@default`                   |
| Usually require the directive to be imported in standalone components | Built-in syntax does not need a directive import |
| Common in older Angular applications                                  | Recommended for new applications                 |

The important conceptual lesson is that both approaches influence which parts of the template are rendered, but the modern built-in blocks are not themselves traditional structural directives.

# 7. Attribute directives

## 7.1 What is an attribute directive?

An attribute directive changes the appearance or behaviour of an existing element, Angular component, or another directive. Unlike a structural directive, it does not primarily create or remove template structure.&#x20;


Examples include:

- Applying a visual highlight.
- Changing a CSS class based on state.
- Setting styles dynamically.
- Disabling or enabling certain UI behaviours.
- Reusing a common interaction pattern on many elements.

Angular has built-in attribute directives such as `NgClass` and `NgStyle`, and developers can create custom attribute directives for application-specific behaviour.

## 7.2 Class and style bindings

For simple one-off styling, Angular's built-in template bindings are often sufficient.

Class binding:

```
<p [class.low-stock]="product.stockQuantity <= 5">
    Stock: {{ product.stockQuantity }}
</p>
```

Angular adds the CSS class `low-stock` when the condition is true.

Style binding:

```
<p [style.color]="product.stockQuantity === 0 ? 'red' : 'green'">
    Stock: {{ product.stockQuantity }}
</p>
```

The text colour changes according to the stock quantity.

These bindings are ideal when the behaviour is small and specific to one template.

## 7.3 Using `ngClass`

`NgClass` applies CSS classes based on a string, array, set, or object of conditions. It is useful when multiple classes are controlled dynamically.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



For example:

```
import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-stock-status',
    standalone: true,
    imports: [NgClass],
    template: `
        <p [ngClass]="{
            'out-of-stock': stockQuantity === 0,
            'low-stock': stockQuantity > 0 && stockQuantity <= 5,
            'in-stock': stockQuantity > 5
        }">
            Stock: {{ stockQuantity }}
        </p>
    `
})
export class StockStatusComponent {
    stockQuantity = 4;
}
```

The example applies the `low-stock` class because the current quantity is greater than zero and no more than five.

## 7.4 Using `ngStyle`

`NgStyle` allows an object of CSS property/value pairs to be applied dynamically. For example:

```
<p [ngStyle]="{
    'color': stockQuantity === 0 ? 'red' : 'green',
    'font-weight': stockQuantity <= 5 ? 'bold' : 'normal'
}">
    Stock: {{ stockQuantity }}
</p>
```

If using `NgStyle` in a standalone component, import it from `@angular/common`. For a single class or style property, prefer the direct `[class.some-class]` or `[style.property]` syntax when it keeps the template simpler.

## 7.5 Create a custom attribute directive

Now let us create a reusable directive for the Product Management application.

Requirement: Any product card with five or fewer units in stock should receive a low-stock highlight.

We could place the same style condition in every card template. A custom directive lets us package this behaviour into one reusable unit.

### Step 1: Generate the directive

Run the following command from the project root:

```
ng generate directive features/products/directives/low-stock
```

### Step 2: Implement `low-stock.directive.ts`

```
import { Directive, input } from '@angular/core';

@Directive({
    selector: '[appLowStock]',
    standalone: true,
    host: {
        '[class.low-stock]': 'stockQuantity() <= threshold()'
    }
})
export class LowStockDirective {

    stockQuantity = input.required<number>({
        alias: 'appLowStock'
    });

    threshold = input(5);
}
```

Let's examine the implementation.

- `@Directive()` defines an Angular directive.
- `selector: '[appLowStock]'` applies the directive to elements carrying that attribute.
- `input.required<number>()` declares an input that the consumer must provide.
- The alias `appLowStock` allows `[appLowStock]="..."` to both apply the directive and pass its input value.
- `threshold` defines the quantity at which an item is considered low-stock.
- The `host` class binding adds the CSS class when the condition is true.

The directive uses Angular's host binding rather than directly manipulating DOM styles with `ElementRef`. This keeps the behaviour declarative and easy to reuse.

### Step 3: Define the CSS class

Add the class to the stylesheet used by the product-list template:

```
.low-stock {
    border: 2px solid #d97706;
    background-color: #fff7ed;
}
```

The visual styling is kept separate from the directive's logic.

### Step 4: Apply the directive

In a template, the directive can be applied as follows:

```
<article [appLowStock]="product.stockQuantity">
    <h3>{{ product.name }}</h3>
    <p>Stock: {{ product.stockQuantity }}</p>
</article>
```

A product with quantity four receives the `low-stock` class. A product with quantity twenty does not.

The same directive can be applied to any suitable element or component, as long as the numeric input represents the quantity to evaluate.

# 8. Complete demo: Product Management catalogue

We will now bring these concepts together in a single working example.

The catalogue will support:

1. Displaying product data using interpolation.
2. Disabling a button through property binding.
3. Removing a product with event binding.
4. Searching and filtering through two-way binding.
5. Rendering products using `@for`.
6. Showing conditional stock messages through `@if`.
7. Styling low-stock products using the custom attribute directive.

## Step 1: Define the product model

File: `src/app/features/products/models/product.ts`

```
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stockQuantity: number;
}
```

This is the contract for the data used throughout our catalogue.

## Step 2: Implement the low-stock directive

File: `src/app/features/products/directives/low-stock.directive.ts`

Use the implementation from Section 7.5. It accepts a stock quantity and adds a class when that quantity is no greater than five.

## Step 3: Implement the product-list component

Assuming the CLI generated a component folder at `features/products/pages/product-list/`, use the following implementation. The default generated filenames vary by Angular CLI version; adapt the `.ts`, `.html`, and `.css` filenames accordingly.

File: `product-list.ts`

```
import { CurrencyPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product';
import { LowStockDirective } from '../../directives/low-stock.directive';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [
        FormsModule,
        CurrencyPipe,
        NgClass,
        LowStockDirective
    ],
    templateUrl: './product-list.html',
    styleUrl: './product-list.css'
})
export class ProductListComponent {

    searchTerm = '';
    selectedCategory = 'ALL';
    showLowStockOnly = false;

    products: Product[] = [
        {
            id: 101,
            name: 'Laptop',
            category: 'Electronics',
            price: 65000,
            stockQuantity: 12
        },
        {
            id: 102,
            name: 'Keyboard',
            category: 'Accessories',
            price: 1500,
            stockQuantity: 4
        },
        {
            id: 103,
            name: 'Monitor',
            category: 'Electronics',
            price: 12000,
            stockQuantity: 0
        },
        {
            id: 104,
            name: 'Mouse',
            category: 'Accessories',
            price: 800,
            stockQuantity: 25
        },
        {
            id: 105,
            name: 'Office Chair',
            category: 'Office',
            price: 8500,
            stockQuantity: 3
        }
    ];

    get filteredProducts(): Product[] {
        const query = this.searchTerm.trim().toLowerCase();

        return this.products.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(query);

            const matchesCategory =
                this.selectedCategory === 'ALL' ||
                product.category === this.selectedCategory;

            const matchesStock =
                !this.showLowStockOnly ||
                product.stockQuantity <= 5;

            return matchesSearch &&
                matchesCategory &&
                matchesStock;
        });
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.selectedCategory = 'ALL';
        this.showLowStockOnly = false;
    }

    deleteProduct(productId: number): void {
        this.products = this.products.filter(
            product => product.id !== productId
        );
    }
}
```

### Why does this component import these dependencies?

| Import              | Reason                                                             |
| ------------------- | ------------------------------------------------------------------ |
| `FormsModule`       | Provides `ngModel` for the search, category, and checkbox controls |
| `CurrencyPipe`      | Formats prices as currency                                         |
| `NgClass`           | Supports dynamic CSS classes                                       |
| `LowStockDirective` | Makes the custom low-stock directive available in the template     |

The `filteredProducts` getter applies three filters: product name, selected category, and low-stock status. This is suitable for a small local demo; for larger catalogues, consider server-side filtering, pagination, and a more suitable reactive state strategy.

## Step 4: Create the template

File: `product-list.html`

```
<section class="product-page">

    <header class="page-header">
        <div>
            <h2>Product Management</h2>
            <p>Search products and monitor stock availability.</p>
        </div>

        <p class="result-count">
            {{ filteredProducts.length }} product(s) found
        </p>
    </header>

    <section class="filters">

        <label for="searchTerm">
            Search by product name
            <input
                id="searchTerm"
                type="search"
                [(ngModel)]="searchTerm"
                placeholder="Example: Laptop"
            />
        </label>

        <label for="category">
            Category
            <select
                id="category"
                [(ngModel)]="selectedCategory">

                <option value="ALL">All categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Office">Office</option>
            </select>
        </label>

        <label class="checkbox-filter">
            <input
                type="checkbox"
                [(ngModel)]="showLowStockOnly"
            />
            Show low-stock products
        </label>

        <button
            type="button"
            class="secondary-button"
            (click)="clearFilters()">

            Clear filters
        </button>

    </section>

    @if (filteredProducts.length > 0) {

        <section class="product-grid">

            @for (
                product of filteredProducts;
                track product.id
            ) {

                <article
                    class="product-card"
                    [appLowStock]="product.stockQuantity">

                    <div class="product-heading">
                        <h3>{{ product.name }}</h3>
                        <span class="category">
                            {{ product.category }}
                        </span>
                    </div>

                    <p class="product-id">
                        Product ID: {{ product.id }}
                    </p>

                    <p class="price">
                        {{ product.price | currency:'INR':'symbol':'1.0-0' }}
                    </p>

                    <p [ngClass]="{
                        'out-of-stock': product.stockQuantity === 0,
                        'low-stock-text':
                            product.stockQuantity > 0 &&
                            product.stockQuantity <= 5,
                        'in-stock-text': product.stockQuantity > 5
                    }">
                        Available stock: {{ product.stockQuantity }}
                    </p>

                    @if (product.stockQuantity === 0) {
                        <p class="warning">
                            Out of stock
                        </p>
                    } @else if (product.stockQuantity <= 5) {
                        <p class="warning">
                            Low stock — consider reordering
                        </p>
                    } @else {
                        <p class="available">
                            In stock
                        </p>
                    }

                    <button
                        type="button"
                        class="remove-button"
                        [disabled]="product.stockQuantity < 0"
                        (click)="deleteProduct(product.id)">

                        Remove product
                    </button>

                </article>

            }

        </section>

    } @else {

        <section class="empty-state">
            <h3>No products found</h3>
            <p>
                Try a different search term or change your filters.
            </p>

            <button
                type="button"
                (click)="clearFilters()">

                Clear filters
            </button>
        </section>

    }

</section>
```

This template demonstrates all the major binding and template concepts in one place.

### Step 5: Add the styles

File: `product-list.css`

```
.product-page {
    max-width: 1100px;
    margin: 30px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.page-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.page-header h2 {
    margin-bottom: 6px;
}

.result-count,
.product-id {
    color: #666;
    font-size: 14px;
}

.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: end;
    padding: 16px;
    margin-bottom: 24px;
    background: #f5f7fa;
    border-radius: 8px;
}

.filters label {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.filters input,
.filters select {
    min-width: 180px;
    padding: 9px;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
}

.filters .checkbox-filter {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;
}

.filters .checkbox-filter input {
    min-width: auto;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 18px;
}

.product-card {
    padding: 18px;
    border: 1px solid #d1d5db;
    border-radius: 9px;
    background: white;
}

.product-heading {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 10px;
}

.product-heading h3 {
    margin-top: 0;
}

.category {
    font-size: 12px;
    color: #475569;
}

.price {
    font-size: 21px;
    font-weight: bold;
}

.low-stock {
    border: 2px solid #d97706;
    background: #fff7ed;
}

.low-stock-text,
.warning {
    color: #b45309;
    font-weight: bold;
}

.out-of-stock {
    color: #b91c1c;
    font-weight: bold;
}

.in-stock-text,
.available {
    color: #15803d;
}

.remove-button,
.secondary-button,
.empty-state button {
    padding: 9px 12px;
    border: 0;
    border-radius: 5px;
    cursor: pointer;
}

.remove-button {
    color: white;
    background: #b91c1c;
}

.secondary-button,
.empty-state button {
    background: #e2e8f0;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.empty-state {
    padding: 32px;
    text-align: center;
    border: 1px dashed #94a3b8;
    border-radius: 8px;
}
```

### Step 6: Display the component

Ensure the root component displays the product-list component. For example, its TypeScript class can import the component:

```
import { Component } from '@angular/core';
import { ProductListComponent } from './features/products/pages/product-list/product-list';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ProductListComponent],
    template: `
        <main>
            <app-product-list />
        </main>
    `
})
export class AppComponent {}
```

Use the actual import path generated by your CLI. If the application already uses Angular Router, you can display this component through a route instead.

Run the application:

```
ng serve
```

## 9. Test the demonstration

Once the app is running, try these actions.

| Test                             | Expected result                               | Angular concept                        |
| -------------------------------- | --------------------------------------------- | -------------------------------------- |
| Search for `Laptop`              | Only the Laptop appears                       | Two-way binding and template filtering |
| Select `Accessories`             | Keyboard and Mouse appear                     | Two-way binding                        |
| Enable Show low-stock products   | Only products with five or fewer units appear | Two-way binding and filtering          |
| Inspect the Keyboard card        | It has a low-stock highlight                  | Custom attribute directive             |
| Inspect the Monitor card         | It shows the out-of-stock warning             | Conditional rendering                  |
| Remove the Laptop                | The Laptop disappears from the list           | Event binding and `@for`               |
| Search for a nonexistent product | The empty-state message appears               | `@if` / `@else`                        |
| Click Clear filters              | The default list and filters return           | Event binding and component state      |

Important implementation note: the Remove action in this demo removes a product from in-memory frontend state. It does not delete a record from a backend database. We will introduce real API communication in the HTTP Client module.

## 10. Common mistakes and best practices

| Mistake                                                                             | Better approach                                                   |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Putting complex calculations directly in the template                               | Use TypeScript methods, derived state, or Pipes where appropriate |
| Using string values for boolean DOM properties                                      | Use property binding such as `[disabled]="isUnavailable"`         |
| Forgetting `FormsModule` when using `[(ngModel)]`                                   | Import `FormsModule` into the standalone component                |
| Using the same unstable tracking key for every product                              | Track by a stable, unique product ID                              |
| Using `*ngIf` and `*ngFor` in new Angular code without considering current guidance | Prefer built-in `@if` and `@for` blocks                           |
| Repeating the same visual behaviour across many templates                           | Encapsulate reusable behaviour in an attribute directive          |
| Using `NgClass` for a single straightforward class condition                        | Prefer a direct binding such as `[class.low-stock]="condition"`   |
| Making a child component responsible for mutating the entire product collection     | Emit an event and let the parent or service handle the operation  |
| Assuming a frontend stock check guarantees correct inventory                        | Validate stock and enforce business rules in the backend          |

## Knowledge check

1\. Which syntax displays a component property as text?

[property]

(event)

{{ expression }}

[(ngModel)]

2\. Which binding should disable a purchase button when stock reaches zero?

[disabled]="stockQuantity === 0"

disabled="false"

{{ disabled }}

(disabled)="stockQuantity === 0"

3\. Which modern Angular block renders one template instance per product?

@if

@for

@switch

@defer

4\. What is the main purpose of an attribute directive?

Create a new route

Remove the root component

Change the appearance or behaviour of an element

Define an npm dependency

5\. What does [(ngModel)] commonly accomplish?

Only display values

Synchronize a form control and component property

Create a structural directive

Bootstrap Angular

Check answers

### Official Angular references

- [Template binding](https://angular.dev/guide/templates/binding?utm_source=chatgpt.com)
- [Two-way binding](https://angular.dev/guide/templates/two-way-binding?utm_source=chatgpt.com)
- [Built-in control flow](https://angular.dev/guide/templates/control-flow?utm_source=chatgpt.com)
- [Structural directives](https://angular.dev/guide/directives/structural-directives?utm_source=chatgpt.com)
- [Attribute directives](https://angular.dev/guide/directives/attribute-directives?utm_source=chatgpt.com)


