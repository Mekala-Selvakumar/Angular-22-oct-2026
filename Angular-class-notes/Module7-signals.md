# Module 7: Angular Signals
This module  covers five topics: `signal()`, `computed()`, `effect()`, practical examples, and Signals versus Observables. We will also complete a Signal-based Product Management component, as specified by the course lab.&#x20;

The central objective is to understand how Angular manages reactive state and updates the UI when data changes.

## 1. What are Angular Signals?

### 1.1 The problem Signals solve

Consider our Product Management application. It displays a product catalogue with a search box, category filter, stock information, and inventory totals.

Suppose the product list contains:

| Product  | Price   | Stock |
| -------- | ------- | ----- |
| Laptop   | ₹65,000 | 12    |
| Keyboard | ₹1,500  | 4     |
| Monitor  | ₹12,000 | 0     |
| Mouse    | ₹800    | 25    |

When the user searches for "Laptop", the application should update the displayed products. When the stock quantity changes, the stock status and inventory information should update too.

This is a reactive UI requirement: when the underlying state changes, the parts of the interface that depend on that state should reflect the new value.

Angular Signals provide a reactive state mechanism that tracks how values are used and notifies interested consumers when those values change.&#x20;

### 1.2 What is a Signal?

A Signal is a wrapper around a value. You read its current value by calling it like a function.

```
import { signal } from '@angular/core';

const stockQuantity = signal(10);

console.log(stockQuantity()); // 10
```

The expression:

```
stockQuantity()
```

reads the current value, whereas:

```
stockQuantity.set(15);
```

updates the value.

This differs from an ordinary TypeScript variable.

```
let quantity = 10;

quantity = 15;
```

Changing an ordinary variable does not, by itself, provide Angular with a reactive notification. A Signal is designed to provide that notification when its stored value changes.&#x20;

### 1.3 Why is this useful?

Imagine a product's inventory value is displayed in three places:

- The product card.
- The stock summary.
- The inventory dashboard.

If those views depend on the same Signal, Angular can track those dependencies and update the relevant UI when the Signal changes.

You do not need to manually locate each DOM element and replace its text.

Writable Signal

stockQuantity = 10 → 9

Reactive dependencies

Angular tracks components and computations that read the Signal

Product card

Inventory summary

Stock warning

The diagram illustrates the dependency relationship. Whether every view actually changes depends on which values it reads and how the application is structured.

# 2. Creating and updating Signals with `signal()`

## 2.1 Creating a writable Signal

The `signal()` function creates a writable Signal.

```
import { signal } from '@angular/core';

const productName = signal('Laptop');
const price = signal(65000);
const stockQuantity = signal(12);
const isAvailable = signal(true);
```

Signals can store primitive values, objects, arrays, or other JavaScript values.

Notice that we read values using function-call syntax:

```
console.log(productName());
console.log(price());
console.log(stockQuantity());
```

For a writable Signal, the main update methods are `set()` and `update()`.

## 2.2 Using `set()`

Use `set()` when you already know the value that should replace the current value.

```
const stockQuantity = signal(12);

stockQuantity.set(20);

console.log(stockQuantity()); // 20
```

Product Management use cases include setting a stock quantity after receiving an updated record, replacing a product collection, or clearing a search field.

## 2.3 Using `update()`

Use `update()` when the next value depends on the existing value.

```
const stockQuantity = signal(12);

stockQuantity.update(quantity => quantity - 1);

console.log(stockQuantity()); // 11
```

For example, an inventory adjustment can decrement the stock:

```
sellOneUnit(): void {
    this.stockQuantity.update(quantity =>
        Math.max(0, quantity - 1)
    );
}
```

The callback receives the current value and returns its replacement.

Important distinction: In this simple demo, stock is maintained in browser state. A real purchase operation must also be validated and persisted by the backend; a client-side Signal is not an authoritative inventory control.

## 2.4 Updating objects and arrays

Suppose the product list is stored in a Signal.

```
interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
}

const products = signal<Product[]>([
    { id: 101, name: 'Laptop', price: 65000, stockQuantity: 12 },
    { id: 102, name: 'Keyboard', price: 1500, stockQuantity: 4 }
]);
```

To update one product, use an immutable update:

```
products.update(currentProducts =>
    currentProducts.map(product =>
        product.id === 102
            ? { ...product, stockQuantity: 10 }
            : product
    )
);
```

This creates a new array and a new object for the updated product.

Why is this preferable to modifying a nested property directly?

```
// Avoid relying on this mutation to notify Signal consumers.
products()[1].stockQuantity = 10;
```

The second statement mutates an object inside the array but does not call `set()` or `update()` on the Signal. Angular's reactive system is not automatically notified of that nested mutation.

Immutable updates make the state transition explicit and predictable.

## 2.5 Read-only Signals

Sometimes a component or service should allow consumers to read state but should not expose direct permission to replace it.

A writable Signal can expose a read-only view using `.asReadonly()`:

```
import { signal } from '@angular/core';

const internalStock = signal(12);

const stockView = internalStock.asReadonly();

console.log(stockView()); // 12

// stockView.set(20); // TypeScript error
```

The owner of `internalStock` can continue updating it, while consumers of `stockView` can only read it through the public API.

The read-only view does not deeply freeze objects. For objects and arrays, continue to avoid unintended mutations.

# 3. Practical Angular component using Signals

Let us create a standalone component that displays one product and allows the user to decrement its stock.

```
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-product-stock',
    standalone: true,
    template: `
        <h2>Laptop</h2>

        <p>Available quantity: {{ stockQuantity() }}</p>

        <button
            [disabled]="stockQuantity() === 0"
            (click)="sellOneUnit()">

            Sell one unit
        </button>
    `
})
export class ProductStockComponent {

    stockQuantity = signal(12);

    sellOneUnit(): void {
        this.stockQuantity.update(quantity =>
            Math.max(0, quantity - 1)
        );
    }
}
```

### What happens when the button is clicked?

1. Angular receives the click event.
2. The `sellOneUnit()` method executes.
3. The Signal is updated.
4. Angular recognizes that the template reads `stockQuantity()`.
5. The displayed quantity and button's disabled state are updated as required.

There is no need to use `document.getElementById()` to change the quantity in the UI.

This is an example of declarative UI programming: the template describes how the current state should be displayed.

# 4. Derived state using `computed()`

## 4.1 What is a computed Signal?

A computed Signal derives a value from one or more other Signals.

Suppose the Product Management application needs to calculate:

- Total inventory value.
- Number of products.
- Number of low-stock products.
- Products that match the selected category.
- Whether the inventory is empty.

We could manually update each derived property whenever the underlying data changes. However, that creates duplicate state and increases the risk of inconsistencies.

Instead, we can use `computed()`.

A computed Signal is read-only, lazy, and memoized. Angular tracks the Signals read during its calculation and invalidates the cached value when a tracked dependency changes.&#x20;

## 4.2 Basic example

```
import { computed, signal } from '@angular/core';

const price = signal(100);
const quantity = signal(3);

const total = computed(() => price() * quantity());

console.log(total()); // 300

quantity.set(5);

console.log(total()); // 500
```

Here, `total` depends on `price` and `quantity`.

When either dependency changes, Angular knows that the computed value may need to be recalculated.

We do not assign to `total` directly.

```
// total.set(500); // Compile-time error
```

To change the result, update `price` or `quantity`.

## 4.3 Computed Signals are not independently stored state

Consider the following approach:

```
const products = signal<Product[]>([]);
const totalProducts = signal(0);
```

If `totalProducts` represents the number of entries in `products`, the application would have to keep both Signals synchronized.

It is better to use:

```
const products = signal<Product[]>([]);

const totalProducts = computed(() => products().length);
```

Now the total product count is derived automatically from the current collection.

Rule of thumb: Store the independent state; derive values that can be calculated from it.

## 4.4 Practical example: inventory calculations

```
import { computed, signal } from '@angular/core';

interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
}

const products = signal<Product[]>([
    { id: 101, name: 'Laptop', price: 65000, stockQuantity: 12 },
    { id: 102, name: 'Keyboard', price: 1500, stockQuantity: 4 },
    { id: 103, name: 'Monitor', price: 12000, stockQuantity: 0 }
]);

const totalProducts = computed(() => products().length);

const lowStockProducts = computed(() =>
    products().filter(product => product.stockQuantity <= 5)
);

const totalInventoryValue = computed(() =>
    products().reduce(
        (total, product) =>
            total + product.price * product.stockQuantity,
        0
    )
);

console.log(totalProducts());       // 3
console.log(lowStockProducts());    // Keyboard and Monitor
console.log(totalInventoryValue()); // 804600
```

The total inventory value is calculated from the current product prices and stock quantities. It changes automatically when the underlying `products` Signal is replaced through `set()` or `update()`.

The current value, ₹8,04,600, is based on these illustrative values. It is not necessarily the selling value or accounting value of inventory in a real business.

## 4.5 Dynamic dependencies

Computed Signals can track different dependencies depending on which branch of a calculation executes.

```
const showStock = signal(true);
const stockQuantity = signal(12);

const displayValue = computed(() => {
    if (showStock()) {
        return `Stock: ${stockQuantity()}`;
    }

    return 'Stock hidden';
});
```

When `showStock()` is false, this calculation does not read `stockQuantity()`. In that state, changes to `stockQuantity` alone do not invalidate this computation.

When `showStock` becomes true again, the computation reads `stockQuantity` and starts tracking it.

This dynamic dependency tracking is useful for conditional UI state and complex derived calculations.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://next.angular.dev\&sz=32)

Angular



# 5. Side effects using `effect()`

## 5.1 What is an effect?

An effect runs a callback when the Signals read inside that callback change.

It runs at least once to establish its dependencies. Subsequent executions occur when those dependencies change. Angular effects execute asynchronously during change detection.&#x20;

For Product Management, an effect might be used to:

- Log search activity for debugging.
- Synchronize Signal state with browser storage.
- Update an external charting library.
- Integrate with an imperative API that is not itself Signal-aware.

## 5.2 Basic example

```
import { Component, effect, signal } from '@angular/core';

@Component({
    selector: 'app-product-search',
    standalone: true,
    template: `
        <p>Search term: {{ searchTerm() }}</p>

        <button (click)="setSearchTerm('Laptop')">
            Search Laptop
        </button>

        <button (click)="setSearchTerm('Monitor')">
            Search Monitor
        </button>
    `
})
export class ProductSearchComponent {

    searchTerm = signal('');

    constructor() {
        effect(() => {
            console.log('Search term changed:', this.searchTerm());
        });
    }

    setSearchTerm(value: string): void {
        this.searchTerm.set(value);
    }
}
```

When the component is initialized, the effect logs the initial search term. When the user clicks a button and the Signal changes, the effect runs again.

In this example, logging is an appropriate side effect because it interacts with the console rather than trying to keep duplicate application state synchronized.

## 5.3 The most important difference between `computed()` and `effect()`

Suppose we need to derive the stock status from the current stock quantity.

Recommended: `computed()`

```
stockQuantity = signal(4);

stockStatus = computed(() => {
    if (this.stockQuantity() === 0) {
        return 'OUT_OF_STOCK';
    }

    if (this.stockQuantity() <= 5) {
        return 'LOW_STOCK';
    }

    return 'IN_STOCK';
});
```

Here, `stockStatus` is purely derived state. It is recalculated as needed when the quantity changes.

Avoid using an effect to copy one Signal into another:

```
// Avoid this pattern for derived state.
effect(() => {
    // Copy stockQuantity into another mutable Signal
    // or maintain a separate stockStatus variable.
});
```

An effect that propagates state changes can introduce unnecessary work, circular updates, and change-detection issues.

Angular recommends preferring `computed()` for derived values and reserving effects for synchronization with imperative, non-Signal systems.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



## 5.4 Effects and injection context

The simplest way to create an effect is from the constructor of an Angular component, directive, or service.

```
constructor() {
    effect(() => {
        console.log('Products:', this.products().length);
    });
}
```

If an effect is created in a method that is not an injection context, the application may need to provide an `Injector` explicitly through the effect options. In ordinary application components, constructor-based setup is straightforward.

Effects created in an Angular lifecycle context are also cleaned up with that context unless configured otherwise.

# 6. Complete demo: Signal-based Product Management

We will now combine `signal()`, `computed()`, and `effect()` in a working catalogue.

The component will support:

- Searching products by name.
- Filtering products by category.
- Showing only low-stock products.
- Displaying inventory statistics.
- Updating stock quantities.
- Removing products.
- Logging changes for demonstration.

## Step 1: Create the product model

File: `product.ts`

```
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stockQuantity: number;
}
```

## Step 2: Generate the component

From your Angular workspace root, execute:

```
ng g component features/products/pages/product-signal-demo
```

Use the generated file naming convention for your project.

## Step 3: Implement the component

File: `product-signal-demo.ts`

```
import { CurrencyPipe } from '@angular/common';
import {
    Component,
    computed,
    effect,
    signal
} from '@angular/core';

import { Product } from '../../models/product';

@Component({
    selector: 'app-product-signal-demo',
    standalone: true,
    imports: [CurrencyPipe],
    templateUrl: './product-signal-demo.html',
    styleUrl: './product-signal-demo.css'
})
export class ProductSignalDemoComponent {

    // Independent application state
    products = signal<Product[]>([
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
    ]);

    searchTerm = signal('');
    selectedCategory = signal('ALL');
    showLowStockOnly = signal(false);

    // Derived state
    filteredProducts = computed(() => {
        const query = this.searchTerm().trim().toLowerCase();
        const category = this.selectedCategory();
        const lowStockOnly = this.showLowStockOnly();

        return this.products().filter(product => {
            const matchesName =
                product.name.toLowerCase().includes(query);

            const matchesCategory =
                category === 'ALL' || product.category === category;

            const matchesStock =
                !lowStockOnly || product.stockQuantity <= 5;

            return matchesName && matchesCategory && matchesStock;
        });
    });

    totalProducts = computed(() => this.products().length);

    lowStockCount = computed(() =>
        this.products().filter(
            product => product.stockQuantity <= 5
        ).length
    );

    totalInventoryValue = computed(() =>
        this.products().reduce(
            (total, product) =>
                total + product.price * product.stockQuantity,
            0
        )
    );

    constructor() {
        // Demonstration effect: log changes to the visible catalogue.
        effect(() => {
            console.log(
                'Visible product count:',
                this.filteredProducts().length
            );
        });
    }

    setSearchTerm(value: string): void {
        this.searchTerm.set(value);
    }

    setCategory(value: string): void {
        this.selectedCategory.set(value);
    }

    setLowStockOnly(value: boolean): void {
        this.showLowStockOnly.set(value);
    }

    updateStock(productId: number, change: number): void {
        this.products.update(products =>
            products.map(product =>
                product.id === productId
                    ? {
                        ...product,
                        stockQuantity: Math.max(
                            0,
                            product.stockQuantity + change
                        )
                    }
                    : product
            )
        );
    }

    deleteProduct(productId: number): void {
        this.products.update(products =>
            products.filter(product => product.id !== productId)
        );
    }

    clearFilters(): void {
        this.searchTerm.set('');
        this.selectedCategory.set('ALL');
        this.showLowStockOnly.set(false);
    }
}
```

### What is happening in this component?

There are three kinds of state.

Independent state

`products`, `searchTerm`, `selectedCategory`, and `showLowStockOnly` are writable Signals. The user interface and event handlers can update them.

Derived state

`filteredProducts`, `totalProducts`, `lowStockCount`, and `totalInventoryValue` are computed Signals. They are calculated from the independent state and are not directly writable.

Side effects

The constructor creates an effect that logs the number of visible products when its dependencies change.

This separation is important: it keeps authoritative client-side state, derived calculations, and external side effects distinct.

## Step 4: Implement the template

File: `product-signal-demo.html`

```
<section class="page">

    <header>
        <h1>Product Management</h1>
        <p>Signal-based product catalogue</p>
    </header>

    <section class="summary">
        <article>
            <h3>Total products</h3>
            <p>{{ totalProducts() }}</p>
        </article>

        <article>
            <h3>Low-stock products</h3>
            <p>{{ lowStockCount() }}</p>
        </article>

        <article>
            <h3>Inventory value</h3>
            <p>
                {{ totalInventoryValue()
                    | currency:'INR':'symbol':'1.0-0' }}
            </p>
        </article>
    </section>

    <section class="filters">

        <label for="search">
            Search
            <input
                id="search"
                type="search"
                [value]="searchTerm()"
                (input)="setSearchTerm($any($event.target).value)"
                placeholder="Search products"
            />
        </label>

        <label for="category">
            Category
            <select
                id="category"
                [value]="selectedCategory()"
                (change)="setCategory($any($event.target).value)">

                <option value="ALL">All categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Office">Office</option>
            </select>
        </label>

        <label class="checkbox-label">
            <input
                type="checkbox"
                [checked]="showLowStockOnly()"
                (change)="setLowStockOnly($any($event.target).checked)"
            />
            Show low-stock only
        </label>

        <button type="button" (click)="clearFilters()">
            Clear filters
        </button>
    </section>

    <section class="product-grid">

        @for (product of filteredProducts(); track product.id) {

            <article class="product-card">

                <h3>{{ product.name }}</h3>
                <p>Category: {{ product.category }}</p>

                <p class="price">
                    {{ product.price
                        | currency:'INR':'symbol':'1.0-0' }}
                </p>

                <p>Stock: {{ product.stockQuantity }}</p>

                @if (product.stockQuantity === 0) {
                    <p class="out-of-stock">Out of stock</p>
                } @else if (product.stockQuantity <= 5) {
                    <p class="low-stock">Low stock</p>
                } @else {
                    <p class="available">In stock</p>
                }

                <div class="actions">
                    <button
                        type="button"
                        [disabled]="product.stockQuantity === 0"
                        (click)="updateStock(product.id, -1)">

                        Sell one
                    </button>

                    <button
                        type="button"
                        (click)="updateStock(product.id, 1)">

                        Restock one
                    </button>

                    <button
                        type="button"
                        (click)="deleteProduct(product.id)">

                        Remove
                    </button>
                </div>

            </article>

        } @empty {
            <p>No products match the selected filters.</p>
        }

    </section>

</section>
```

The template uses `$any()` to keep this introductory example concise when reading the input element's value. In strict production code, prefer explicitly typed event handlers:

```
onSearchInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.searchTerm.set(element.value);
}

onCategoryChange(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.selectedCategory.set(element.value);
}

onLowStockChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.showLowStockOnly.set(element.checked);
}
```

You would then call these methods from the template:

```
<input (input)="onSearchInput($event)" />
```

This style preserves better type checking and is preferable in enterprise applications.

## Step 5: Add styles

File: `product-signal-demo.css`

```
.page {
    max-width: 1100px;
    margin: 30px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin: 24px 0;
}

.summary article,
.product-card {
    padding: 18px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
}

.summary p,
.price {
    font-size: 20px;
    font-weight: bold;
}

.filters {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: 16px;
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
    padding: 9px;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
}

.filters .checkbox-label {
    flex-direction: row;
    align-items: center;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
}

.product-card {
    border-top: 3px solid #64748b;
}

.low-stock {
    color: #b45309;
    font-weight: bold;
}

.out-of-stock {
    color: #b91c1c;
    font-weight: bold;
}

.available {
    color: #15803d;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

button {
    padding: 8px 10px;
    cursor: pointer;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

## Step 6: Display the component

Import `ProductSignalDemoComponent` into the root component, or add it to the routing configuration if you are using the Router.

For direct display in the root component:

```
import { Component } from '@angular/core';
import { ProductSignalDemoComponent } from './features/products/pages/product-signal-demo/product-signal-demo';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ProductSignalDemoComponent],
    template: `<app-product-signal-demo />`
})
export class AppComponent {}
```

Adjust the import path for your generated filenames.

Run the application:

```
ng serve
```

### Verify the demo

| Action                  | Expected behaviour                                                    |
| ----------------------- | --------------------------------------------------------------------- |
| Search for `Laptop`     | The list displays only the Laptop                                     |
| Select `Accessories`    | The list displays matching accessories                                |
| Enable low-stock filter | The list displays products with five or fewer units                   |
| Click Sell one          | The stock quantity decreases and derived inventory values update      |
| Click Restock one       | The stock quantity increases and the status is recalculated           |
| Click Remove            | The product disappears, and total products and inventory value update |
| Clear filters           | The original filter settings return                                   |

This exercise illustrates how three Signal APIs fit together: `signal()` stores the state, `computed()` derives the values, and `effect()` performs a side effect.

# 7. Signals versus Observables

This is an important topic for experienced Angular developers because Signals and RxJS are both reactive but solve different problems.

## 7.1 What is an Observable?

An Observable is an RxJS abstraction that represents a stream of values over time. It may emit no values, one value, or many values, and it can complete or report an error.

Angular's `HttpClient` returns Observables. RxJS also provides operators that compose asynchronous workflows.

For example, a product search may use `debounceTime()`, `distinctUntilChanged()`, and `switchMap()` to handle user input, limit unnecessary requests, and cancel outdated searches.

Signals, by contrast, represent a current value that can be read synchronously. They are often a natural fit for local UI state and derived calculations.

## 7.2 Comparison table

| Feature                    | Signals                                                                  | RxJS Observables                                                                 |
| -------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Main purpose               | Represent current state and its dependencies                             | Represent values and events over time                                            |
| Read value                 | Call the Signal: `count()`                                               | Subscribe or use an Observable-consuming API                                     |
| Update mechanism           | `.set()` or `.update()` for writable Signals                             | Emit through the Observable's producer                                           |
| Derived values             | `computed()`                                                             | Operators such as `map()` and `combineLatest()`                                  |
| Typical use                | Search text, selected category, derived inventory totals                 | HTTP streams, event streams, cancellation, retries                               |
| Subscription management    | Reading a Signal does not create a subscription                          | Subscriptions may need cleanup, depending on how they are managed                |
| Timing                     | Provides synchronous access to the current value                         | Emissions may be synchronous or asynchronous                                     |
| Multiple rapid updates     | Reads the current value; framework updates depend on reactive scheduling | A stream can emit each value, although operators may buffer, filter, or coalesce |
| Error/completion semantics | A Signal holds a current value rather than a stream lifecycle            | Observables have error and completion notifications                              |

Neither approach is a universal replacement for the other. Angular supports integration between the two.&#x20;

## 7.3 When should you use Signals?

Signals are a good choice when you need to represent the current state of a product catalogue.

```
searchTerm = signal('');
selectedCategory = signal('ALL');

filteredProducts = computed(() => {
    const query = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    return this.products().filter(product =>
        product.name.toLowerCase().includes(query) &&
        (category === 'ALL' || product.category === category)
    );
});
```

The code expresses the current state and derives the filtered collection from it.

## 7.4 When should you use RxJS?

RxJS is especially useful for asynchronous workflows and streams of events.

Imagine the user searches for products by name, and the application calls a backend endpoint. The user may type several characters quickly, producing many intermediate search values.

A common RxJS workflow would:

1. Receive input values.
2. Wait until typing pauses using `debounceTime()`.
3. Ignore consecutive duplicate values using `distinctUntilChanged()`.
4. Use `switchMap()` to call the API and switch to the newest request.
5. Handle the response and any error.

These operations involve stream processing, timing, and cancellation, making RxJS a natural fit.

## 7.5 Integrating Signals and RxJS with `toSignal()`

Suppose an existing service returns products as an Observable.

```
getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
}
```

A component can convert this Observable into a Signal using `toSignal()`.

```
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductService } from './product.service';
import { Product } from './product.model';

@Component({
    selector: 'app-products',
    standalone: true,
    template: `
        @for (product of products(); track product.id) {
            <p>{{ product.name }}</p>
        } @empty {
            <p>No products available.</p>
        }
    `
})
export class ProductsComponent {

    private productService = inject(ProductService);

    products = toSignal(
        this.productService.getProducts(),
        { initialValue: [] as Product[] }
    );
}
```

`toSignal()` subscribes to the Observable and exposes the latest emitted value as a Signal. It automatically cleans up that subscription when the component or service context that created it is destroyed, unless manual cleanup is configured.&#x20;


Important: Calling `toSignal()` creates a subscription. Avoid calling it repeatedly for the same Observable; create the Signal once and reuse it.

This example is intentionally minimal. A production data-loading component should also represent loading and error states appropriately.

## 7.6 Integrating Signals and RxJS with `toObservable()`

The reverse integration is also available. `toObservable()` exposes a Signal's values as an Observable, allowing stream operators to be used.

```
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-product-search',
    standalone: true,
    template: `<p>Type to search for products</p>`
})
export class ProductSearchComponent {

    searchTerm = signal('');

    private searchTerm$ = toObservable(this.searchTerm);

    readonly debouncedSearch$ = this.searchTerm$.pipe(
        debounceTime(300),
        distinctUntilChanged()
    );
}
```

The Signal stores the current search term, while RxJS applies stream operators to the value changes.

Note that `toObservable()` propagates Signal values through an effect. Subsequent emissions are asynchronous, and multiple Signal updates before the effect runs may be coalesced into the latest value. This is important when designing workflows that depend on every intermediate value.&#x20;

### Recommended strategy for Product Management

Use Signals for current UI state such as selected category, search text, current filters, inventory summaries, and other values derived synchronously from known state.

Use RxJS where the problem involves HTTP streams, debouncing, retries, event composition, cancellation, or asynchronous workflows.

Combine the two when you need both kinds of behaviour. Angular supports this through `toSignal()`, `toObservable()`, and other interop APIs.

# 8. Common mistakes and best practices

| Mistake                                                     | Better approach                                                              |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Reading a Signal without calling it                         | Use `stockQuantity()` to read the value                                      |
| Mutating a nested array element without updating its Signal | Use `set()` or `update()` with a new array/object                            |
| Creating separate Signals for values that can be derived    | Use `computed()`                                                             |
| Using `effect()` to copy one Signal to another              | Prefer `computed()` for derived state                                        |
| Creating `toSignal()` repeatedly for the same Observable    | Create one Signal and reuse it                                               |
| Using Signals to replace all RxJS operations                | Use RxJS where stream operators and asynchronous composition are appropriate |
| Assuming client-side inventory Signals are authoritative    | Validate inventory and enforce stock rules in the backend                    |
| Logging large objects from effects during every change      | Keep effects targeted and avoid unnecessary repeated work                    |

## 9. Knowledge check

1\. Which Signal API is used to store writable application state?

computed()

effect()

signal()

toObservable()

2\. Which API is best suited to deriving the total inventory value from the current product list?

effect()

computed()

ngOnDestroy()

subscribe()

3\. Which is an appropriate use for effect()?

Copy every derived value into another Signal

Calculate a total that depends on price and quantity

Synchronize Signal state with an external system or perform logging

Replace every RxJS Observable

4\. What is the main difference between Signals and Observables?

Signals only hold strings

Signals represent current state, while Observables represent streams over time

Observables cannot handle asynchronous operations

Signals replace the Angular Router

5\. What does toSignal() do?

Converts a Signal to a class

Converts an Observable into a Signal representing its latest value

Creates a route

Automatically validates backend JSON

Check answers

### Official references

- [Angular Signals](https://angular.dev/guide/signals?utm_source=chatgpt.com)
- [Angular effects](https://angular.dev/guide/signals/effect?utm_source=chatgpt.com)
- [RxJS interop with Signals](https://angular.dev/ecosystem/rxjs-interop?utm_source=chatgpt.com)
- [toSignal API](https://angular.dev/api/core/rxjs-interop/toSignal?utm_source=chatgpt.com)
- [toObservable API](https://angular.dev/api/core/rxjs-interop/toObservable?utm_source=chatgpt.com)

 
 