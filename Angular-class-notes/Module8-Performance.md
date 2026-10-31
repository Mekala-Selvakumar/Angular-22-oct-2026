# Module 8: Performance Basics

This module  covers three topics: OnPush Strategy, TrackBy, and Lazy Loading Overview, followed by the specified Signal-based Components lab.&#x20;

The focus is on improving the responsiveness of our Product Management application without sacrificing maintainability.

# 1. Understanding Angular performance

Performance optimization is not simply about making Angular execute fewer lines of code. It means reducing unnecessary computation, browser rendering work, network transfers, and memory usage while preserving the correct behaviour of the application.

Consider our Product Management application. It may eventually contain thousands of products, product details, inventory analytics, reports, and administrative screens.

Three common performance concerns are:

| Performance concern             | Example in Product Management                                                                 | Technique covered                         |
| ------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Excessive component checking    | Many product cards are checked when only a small portion needs an update                      | `OnPush` change detection                 |
| Excessive DOM operations        | Adding one product causes unnecessary recreation of many product rows                         | Stable tracking with `track` or `trackBy` |
| Large initial JavaScript bundle | Product reports and administration code load even though the user opens only the product list | Lazy loading                              |

These techniques solve different problems. `OnPush` affects when components are checked, tracking helps Angular associate data items with rendered DOM nodes, and lazy loading controls when code is downloaded.

Angular recommends choosing performance optimizations based on the type of bottleneck being addressed.&#x20;

# 2. OnPush change-detection strategy

## 2.1 What is change detection?

Angular change detection synchronizes the application's state with its rendered UI.

Suppose a product component displays:

```
<h3>{{ product.name }}</h3>
<p>Stock: {{ product.stockQuantity }}</p>
```

When the product changes, Angular must determine whether the rendered values need updating.

In a large application, there may be hundreds of components and thousands of rendered elements. Checking every component unnecessarily can introduce performance overhead.

The `OnPush` strategy allows Angular to skip checking component subtrees when no relevant change-detection notification requires them to be checked.

Version note: Angular 22 uses `OnPush` as the default change-detection strategy for new components. Earlier Angular versions commonly used the eager/default strategy. We will declare `OnPush` explicitly in our example so that the design intention is clear.&#x20;

## 2.2 How does OnPush work?

Consider this component:

```
import {
    ChangeDetectionStrategy,
    Component,
    input
} from '@angular/core';

interface Product {
    id: number;
    name: string;
    price: number;
}

@Component({
    selector: 'app-product-card',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h3>{{ product().name }}</h3>
        <p>Price: ₹{{ product().price }}</p>
    `
})
export class ProductCardComponent {
    product = input.required<Product>();
}
```

The `changeDetection` configuration tells Angular to use the `OnPush` strategy for this component.

Angular can check an `OnPush` component when, for example:

- It receives a changed input through a template binding.
- An event listener executes in the component or a relevant descendant.
- A Signal read by its template changes.
- The component is explicitly marked for checking, such as through `ChangeDetectorRef.markForCheck()` or a supported mechanism such as `AsyncPipe`.

The framework still performs the necessary checks. The goal is to skip subtrees that do not need checking.&#x20;

## 2.3 Why immutable updates matter

Suppose a parent component provides a product object to an `OnPush` child.

```
selectedProduct = {
    id: 101,
    name: 'Laptop',
    price: 65000
};
```

Now consider changing the product price by mutating the same object:

```
this.selectedProduct.price = 60000;
```

The object reference remains the same.

When an `OnPush` child receives this object through a template binding, Angular compares the previous and current input values using `Object.is`. Because the reference is unchanged, the mutation does not constitute a new input value.

Consequently, the child may not be marked for checking simply because a nested property has changed.

A better approach is to create a new object:

```
this.selectedProduct = {
    ...this.selectedProduct,
    price: 60000
};
```

The parent now provides a new object reference, making the input change detectable.

For an application where product records are stored in Signals, an immutable update is straightforward:

```
products.update(currentProducts =>
    currentProducts.map(product =>
        product.id === 101
            ? { ...product, price: 60000 }
            : product
    )
);
```

This creates a new array and a new object for the modified product. Angular's reactive consumers can respond to the updated Signal, and an `OnPush` component receiving the changed product object can be checked as appropriate.

Immutable updates are not a requirement for every Angular property, but they make component inputs and state transitions easier to reason about.

## 2.4 OnPush with Signals

Signals integrate naturally with `OnPush` components.

```
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal
} from '@angular/core';

@Component({
    selector: 'app-stock-summary',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h2>Inventory</h2>

        <p>Stock: {{ stockQuantity() }}</p>
        <p>Status: {{ stockStatus() }}</p>

        <button
            [disabled]="stockQuantity() === 0"
            (click)="sellOne()">

            Sell one unit
        </button>
    `
})
export class StockSummaryComponent {

    stockQuantity = signal(12);

    stockStatus = computed(() =>
        this.stockQuantity() === 0
            ? 'Out of stock'
            : this.stockQuantity() <= 5
                ? 'Low stock'
                : 'In stock'
    );

    sellOne(): void {
        this.stockQuantity.update(quantity =>
            Math.max(0, quantity - 1)
        );
    }
}
```

Here, the template reads `stockQuantity()` and `stockStatus()`. When the stock Signal changes, Angular knows the component depends on that reactive state.

The computed Signal recalculates its result when needed, and the UI is refreshed accordingly.

This is a practical combination of `OnPush`, writable Signals, and derived state.

## 2.5 When should we use OnPush?

Use it as a baseline for modern Angular components and pay particular attention to components that render large lists or complex UI trees.

However, `OnPush` does not automatically make an application fast. Expensive template computations, excessive DOM elements, large network payloads, and poorly designed state updates can still create performance problems.

For a component whose template calls an expensive method repeatedly, the solution may involve moving derived calculations into a computed Signal, reducing the rendered data, or optimizing the underlying algorithm—not simply changing the change-detection strategy.

# 3. Tracking collections: `track` and `trackBy`

## 3.1 Why does tracking matter?

Our Product Management catalogue may contain hundreds or thousands of product records.

Suppose the current list is:

```
Laptop
Keyboard
Monitor
Mouse
```

A new product named Office Chair is added at the end.

Without a useful identity strategy, Angular may need to do more work to determine which rendered elements correspond to which items. Stable tracking keys let Angular associate each data item with the corresponding DOM view, enabling more efficient updates.

This is especially important when lists are updated through searching, sorting, inserting, deleting, or reordering.

## 3.2 Modern Angular: `@for` with `track`

Modern Angular provides the built-in `@for` block, which requires a tracking expression.

```
@for (product of products(); track product.id) {
    <article class="product-card">
        <h3>{{ product.name }}</h3>
        <p>Price: ₹{{ product.price }}</p>
    </article>
} @empty {
    <p>No products available.</p>
}
```

The key expression is:

```
track product.id
```

Angular uses the unique product ID to associate each record with its rendered view. When the collection changes, it can reuse existing views and perform the necessary DOM operations.&#x20;

### Why not track by product name?

A product name might not be unique. Two different products can share a name, and product names might change.

A product ID is usually a stronger identity key because it is stable and unique within the collection.

### Why not use `$index`?

You could write:

```
@for (product of products(); track $index) {
    <p>{{ product.name }}</p>
}
```

Tracking by index can be suitable for static lists that never change. However, in a catalogue where products can be inserted, deleted, or reordered, an index identifies a position rather than a product.

For dynamic business collections, prefer a stable unique ID.

## 3.3 What happens when a product is deleted?

Assume the collection is:

```
ID 101 — Laptop
ID 102 — Keyboard
ID 103 — Monitor
```

The user deletes Keyboard.

The new array is:

```
ID 101 — Laptop
ID 103 — Monitor
```

When using `track product.id`, Angular knows that Laptop and Monitor still correspond to their existing product identities. It can remove the Keyboard view and retain the appropriate views for the other products.

Tracking is not a caching mechanism for product data; it is a strategy for identifying items and their corresponding views.

## 3.4 Traditional Angular: `trackBy` with `*ngFor`

Experienced developers will also encounter `trackBy` in older Angular code.

The traditional syntax is:

```
<div
    *ngFor="let product of products; trackBy: trackByProductId">

    {{ product.name }}
</div>
```

The component defines the tracking function:

```
trackByProductId(index: number, product: Product): number {
    return product.id;
}
```

Angular calls the function to obtain the identity key for each item.

A tracking function helps Angular determine which items were added, removed, or retained when an iterable changes.&#x20;



The difference between the two approaches is:

| Modern control flow                              | Traditional structural directive                              |
| ------------------------------------------------ | ------------------------------------------------------------- |
| `@for (product of products(); track product.id)` | `*ngFor="let product of products; trackBy: trackByProductId"` |
| Tracking is expressed directly in the template   | Tracking function is defined in the component                 |
| Built into Angular template control flow         | Uses the `NgForOf` directive                                  |
| Recommended for new template code                | Common in existing applications                               |

For new code, use `@for` with a stable tracking expression. Understanding `trackBy` remains important when maintaining older codebases.

# 4. Lazy loading overview

## 4.1 What is lazy loading?

Lazy loading means deferring the loading of application code until that code is needed.

Consider our future Product Management application. It may have these areas:

- Product catalogue.
- Product details.
- Inventory analytics.
- Reports.
- Administration.

If a user opens the product catalogue, it may not be necessary to download the code for inventory analytics and administration immediately.

Lazy loading allows Angular Router to load selected routes or components when they are activated.

This can reduce the initial JavaScript bundle and improve initial loading performance. It may introduce a delay the first time the user navigates to a lazy-loaded route, so it must be used thoughtfully.&#x20;

## 4.2 Eager versus lazy loading

### Eager-loaded route

```
import { Routes } from '@angular/router';

import { ProductListComponent } from './features/products/product-list';

export const routes: Routes = [
    {
        path: 'products',
        component: ProductListComponent
    }
];
```

The direct import makes the product-list component available as part of the route configuration's eager dependency graph, so it is normally included in code downloaded during initial loading.

### Lazy-loaded route

```
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadComponent: () =>
            import('./features/products/product-list')
                .then(module => module.ProductListComponent)
    }
];
```

The `loadComponent` property dynamically imports the component when the route is activated.

The JavaScript build process can place this feature code into a separate chunk that the browser requests when needed. The exact output is controlled by Angular's build process and dependency graph.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



## 4.3 Configure lazy loading for Product Management

Suppose we want the main dashboard to load eagerly but the product catalogue and reports to load on demand.

Create the following route configuration.

File: `app.routes.ts`

```
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/dashboard/dashboard')
                .then(module => module.DashboardComponent)
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./features/products/pages/product-list/product-list')
                .then(module => module.ProductListComponent)
    },
    {
        path: 'reports',
        loadComponent: () =>
            import('./features/reports/reports')
                .then(module => module.ReportsComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
```

This is illustrative: create the referenced components or adjust the imports to match your project before compiling.

The `loadComponent` callback returns a promise that resolves to the component class. Angular Router loads and activates that component when navigating to the route.

For larger feature areas, `loadChildren` can lazy-load a set of child routes from a separate route configuration file.

## 4.4 The root component needs a router outlet

The root component should provide a place for the selected route component to render.

```
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
    template: `
        <header>
            <h1>Product Management</h1>

            <nav>
                <a routerLink="/">Dashboard</a>
                <a routerLink="/products">Products</a>
                <a routerLink="/reports">Reports</a>
            </nav>
        </header>

        <main>
            <router-outlet />
        </main>
    `
})
export class AppComponent {}
```

Configure the Router through application providers:

```
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes)
    ]
};
```

And bootstrap the application with the configuration:

```
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
    .catch(error => console.error(error));
```

Use the actual root component name and file paths generated in your workspace.

## 4.5 When should you lazy-load?

Lazy loading is a good candidate for:

- Large feature pages that users do not always visit.
- Administrative and reporting modules.
- Complex screens that depend on large libraries.
- Feature areas that are rarely used during an ordinary session.

It may be unnecessary for tiny components or critical landing-page content. Excessive nesting of lazy-loaded routes can also create navigation delays or overly fragmented loading.

Angular provides preloading strategies to download lazy-loaded features in the background after initial navigation. For example, `PreloadAllModules` can reduce the delay associated with first navigation at the cost of additional network usage.&#x20;

# 5. Integrated lab: Performance-conscious Product Management

Let us combine `OnPush`, product tracking, and lazy loading in a practical feature.

Our product catalogue will:

- Store products in a Signal.
- Render them through an `@for` block using `track product.id`.
- Use an `OnPush` product card.
- Update stock through immutable Signal updates.
- Be loaded on demand through Angular Router.

## Step 1: Define the model

File: `product.model.ts`

```
export interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
}
```

## Step 2: Implement an OnPush product card

File: `product-card.ts`

```
import {
    ChangeDetectionStrategy,
    Component,
    input
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../models/product';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CurrencyPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <article class="product-card">
            <h3>{{ product().name }}</h3>

            <p>
                Price:
                {{ product().price | currency:'INR':'symbol':'1.0-0' }}
            </p>

            <p>Stock: {{ product().stockQuantity }}</p>
        </article>
    `,
    styles: `
        .product-card {
            padding: 16px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
        }
    `
})
export class ProductCardComponent {
    product = input.required<Product>();
}
```

Each card receives a required product input and uses `OnPush` to reduce unnecessary checks of its subtree.

## Step 3: Implement the product-list component

File: `product-list.ts`

```
import {
    ChangeDetectionStrategy,
    Component,
    signal
} from '@angular/core';

import { Product } from '../../models/product';
import { ProductCardComponent } from '../../components/product-card';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [ProductCardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h2>Product Catalogue</h2>

        <button type="button" (click)="addProduct()">
            Add sample product
        </button>

        <section class="product-grid">
            @for (product of products(); track product.id) {
                <app-product-card [product]="product" />
            } @empty {
                <p>No products available.</p>
            }
        </section>
    `,
    styles: `
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-top: 20px;
        }
    `
})
export class ProductListComponent {

    products = signal<Product[]>([
        { id: 101, name: 'Laptop', price: 65000, stockQuantity: 12 },
        { id: 102, name: 'Keyboard', price: 1500, stockQuantity: 4 },
        { id: 103, name: 'Monitor', price: 12000, stockQuantity: 0 }
    ]);

    private nextId = 104;

    addProduct(): void {
        const product: Product = {
            id: this.nextId++,
            name: `New Product ${this.nextId - 1}`,
            price: 5000,
            stockQuantity: 10
        };

        this.products.update(products => [...products, product]);
    }
}
```

This component uses an immutable array update when a new product is added. The `@for` block tracks each product by ID, so Angular can reuse existing views and create a view for the new product without recreating the entire list.

## Step 4: Configure lazy loading

In `app.routes.ts`, configure the catalogue as a lazy-loaded route:

```
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadComponent: () =>
            import('./features/products/pages/product-list/product-list')
                .then(module => module.ProductListComponent)
    }
];
```

Update the import path to match your generated folder structure.

Make sure the root component includes a router outlet and the application config provides the Router.

## Step 5: Run and test

From the project root, run:

```
ng serve
```

Navigate to `/products`.

Then select Add sample product several times and observe the product list.

To inspect the loading behaviour:

1. Open browser developer tools.
2. Select the Network tab.
3. Reload the application.
4. Observe the JavaScript resources loaded initially.
5. Navigate to `/products`.
6. Inspect whether the lazy-loaded feature causes an additional JavaScript chunk to be requested.

The actual chunk filenames and number of requests depend on the build configuration, browser cache, and other dependencies. Confirm the behaviour using the production build as well, because development builds may behave differently.

### Expected learning outcome

The demo combines three techniques:

- `OnPush` narrows when the product component tree needs checking.
- `track product.id` helps Angular retain the correct rendered view for each product.
- `loadComponent` defers the product-list feature code until its route is activated.

These optimizations are complementary, not interchangeable.

# 6. Common mistakes and best practices

| Mistake                                                        | Recommended approach                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Assuming `OnPush` prevents all change detection                | Understand the conditions under which Angular marks a component for checking                |
| Mutating an object passed into an `OnPush` component           | Prefer immutable updates and new object references for input changes                        |
| Tracking dynamic products by array index                       | Use a stable, unique product ID                                                             |
| Assuming `track` reduces the number of TypeScript calculations | It primarily helps Angular correlate data records with rendered views and minimize DOM work |
| Lazy-loading every tiny component                              | Focus on large or infrequently used feature areas                                           |
| Expecting lazy loading to reduce all runtime calculations      | It chiefly affects code loading and bundle structure; other optimizations may be needed     |
| Optimizing without measurement                                 | Profile rendering and inspect bundle sizes to identify actual bottlenecks                   |

## 7. Knowledge check

1\. What is the main goal of Angular's OnPush strategy?

Eliminate all change detection

Skip checking component subtrees when no relevant notification requires them

Replace the Angular Router

Automatically cache every API response

2\. Why is track product.id useful in a product list?

It sorts products by ID

It tells Angular how to identify each product's rendered view

It loads the product route lazily

It automatically validates stock

3\. Which is the modern Angular equivalent of loading a standalone component lazily through a route?

component: ProductListComponent

loadComponent: () => import(...)

trackBy: product.id

ChangeDetectionStrategy.Eager

4\. Which update is most suitable when a product is passed to an OnPush child?

Mutate the existing object without notifying Angular

Create a new product object and supply the new reference

Change only a CSS class

Reload index.html manually

5\. Which technique primarily helps reduce initial JavaScript loading?

Using track product.id

Adding more computed Signals

Lazy-loading a feature route

Adding a CSS class

Check answers

### Official references

- [Angular performance overview](https://angular.dev/best-practices/performance?utm_source=chatgpt.com)
- [Skipping component subtrees with OnPush](https://angular.dev/best-practices/skipping-subtrees?utm_source=chatgpt.com)
- [Angular control flow and tracking](https://angular.dev/guide/templates/control-flow?utm_source=chatgpt.com)
- [Lazy-loaded routes](https://angular.dev/best-practices/performance/lazy-loaded-routes?utm_source=chatgpt.com)
- [Customizing route behaviour and preloading](https://angular.dev/guide/routing/customizing-route-behavior?utm_source=chatgpt.com)

