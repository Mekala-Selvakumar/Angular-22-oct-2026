# Module 10: Services & Dependency Injection

This module  covers three topics: Services, Dependency Injection, and Shared Services.&#x20;

We will continue building the same Product Management application. In the earlier modules, our components maintained product arrays, filtered products, updated stock, and handled product forms. Now we will move product-related operations into a dedicated service so that components focus on presentation and user interactions.

Our target design is:

Product List Component

Displays products and handles user actions

Product Service

Product data, add, update, delete, search and inventory operations

In-memory store initially; REST API in Module 11

The service provides a stable interface to the data source

The service will initially keep products in memory so we can understand Angular services and dependency injection without introducing HTTP yet. In Module 11, we will replace the in-memory implementation with communication to a backend REST API.

 # 1. Why do we need services?

## 1.1 The problem with putting everything inside components

Consider our Product List component from previous modules. It stores the product collection and implements methods to add, update, delete, and filter products.

```
export class ProductListComponent {
    products = [
        { id: 101, name: 'Laptop', price: 65000 },
        { id: 102, name: 'Keyboard', price: 1500 }
    ];

    deleteProduct(id: number): void {
        this.products = this.products.filter(
            product => product.id !== id
        );
    }
}
```

This works for a small demo. However, suppose the application contains several components:

- Product List
- Product Details
- Product Form
- Inventory Summary
- Low Stock Alerts

Each component may need access to the same product information.

If each component maintains its own copy of the product list, we can end up with inconsistent state. For example, deleting a product from the list may not update the inventory summary.

A service solves this problem by providing a central place for reusable operations and shared data.

## 1.2 What is an Angular service?

An Angular service is generally a TypeScript class responsible for functionality that can be reused by one or more components or other services.

A service can encapsulate:

- Data access and API calls.
- Business logic.
- Shared application state.
- Logging and telemetry.
- Authentication-related operations.
- Data transformation and validation.
- Integration with external systems.

A service is not required to perform every one of these tasks. Its responsibilities should be focused and cohesive.

For our Product Management application, a `ProductService` will own the product collection and provide methods for retrieving, adding, updating, and deleting products.

The component will request those operations rather than implement the product-management logic itself.

## 1.3 What is dependency injection?

Dependency injection (DI) is a design technique in which a class receives the objects or services it depends on instead of constructing those dependencies itself.

Consider these two approaches.

Approach A: Create the dependency directly

```
export class ProductListComponent {
    private productService = new ProductService();
}
```

The component constructs its own service. This tightly couples it to that concrete implementation and makes shared state, replacement, and testing more difficult to manage.

Approach B: Request the dependency from Angular

```
import { Component, inject } from '@angular/core';
import { ProductService } from './product.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    template: `<h2>Products</h2>`
})
export class ProductListComponent {
    private productService = inject(ProductService);
}
```

Here, Angular's injector supplies a registered `ProductService` instance.

The component declares its dependency, while Angular manages provider resolution and instance creation according to the configured dependency-injection scope.

The key difference: a service is an object that provides functionality; dependency injection is the mechanism through which that object is supplied to its consumers.

# 2. Creating an Angular service

## 2.1 Generate the service

From the root directory of our Product Management project, execute:

```
ng generate service core/services/product
```

The shorter command is:

```
ng g s core/services/product
```

Angular CLI generates a service file, usually named:

```
src/app/core/services/product.service.ts
```

The exact location and filename conventions depend on the CLI command and project configuration.

## 2.2 Understanding the `@Injectable()` decorator

A generated service typically looks like this:

```
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

}
```

Let us understand the code.

`@Injectable()`

Marks the class as available for Angular's dependency-injection system and allows Angular to generate the required injection metadata.

`providedIn: 'root'`

Registers the service with the root injector. This is the standard pattern for an application-wide service.

`export class ProductService`

Defines the TypeScript class that contains the service's implementation.

A service registered at the root level is normally shared across the application through a single service instance. It is also tree-shakable, so unused services can be excluded from the production bundle.&#x20;

# 3. Implement the ProductService

Now we will move the product collection and its operations from the component into the service.

## 3.1 Define the product model

If you have already created the model in Module 9, reuse it.

File: `src/app/features/products/models/product.model.ts`

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

`ProductDraft` represents a product without its generated identifier.

## 3.2 Build the service

File: `src/app/core/services/product.service.ts`

```
import { Injectable, computed, signal } from '@angular/core';

import { Product, ProductDraft } from '../../features/products/models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private readonly productState = signal<Product[]>([
        {
            id: 101,
            name: 'Laptop',
            sku: 'LAP-1001',
            category: 'Electronics',
            price: 65000,
            stockQuantity: 12
        },
        {
            id: 102,
            name: 'Keyboard',
            sku: 'KEY-1002',
            category: 'Accessories',
            price: 1500,
            stockQuantity: 4
        },
        {
            id: 103,
            name: 'Monitor',
            sku: 'MON-1003',
            category: 'Electronics',
            price: 12000,
            stockQuantity: 0
        }
    ]);

    private nextId = 104;

    // Public read-only view of product data
    readonly products = this.productState.asReadonly();

    // Derived information
    readonly totalProducts = computed(
        () => this.productState().length
    );

    readonly lowStockProducts = computed(() =>
        this.productState().filter(
            product => product.stockQuantity <= 5
        )
    );

    readonly totalInventoryValue = computed(() =>
        this.productState().reduce(
            (total, product) =>
                total + product.price * product.stockQuantity,
            0
        )
    );

    // Retrieve all products
    getProducts(): Product[] {
        return this.productState();
    }

    // Retrieve one product
    getProductById(id: number): Product | undefined {
        return this.productState().find(
            product => product.id === id
        );
    }

    // Add a new product
    addProduct(draft: ProductDraft): Product {
        const product: Product = {
            ...draft,
            id: this.nextId++,
            name: draft.name.trim(),
            sku: draft.sku.trim().toUpperCase()
        };

        this.productState.update(products => [
            ...products,
            product
        ]);

        return product;
    }

    // Update an existing product
    updateProduct(
        id: number,
        changes: Partial<ProductDraft>
    ): void {
        this.productState.update(products =>
            products.map(product =>
                product.id === id
                    ? { ...product, ...changes, id: product.id }
                    : product
            )
        );
    }

    // Delete a product
    deleteProduct(id: number): void {
        this.productState.update(products =>
            products.filter(product => product.id !== id)
        );
    }

    // Increase or decrease inventory
    updateStock(id: number, change: number): void {
        this.productState.update(products =>
            products.map(product =>
                product.id === id
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
}
```

This service demonstrates several important design decisions:

- The product collection is owned by the service, not by individual components.
- `productState` is private, so consumers cannot directly replace the internal Signal.
- `products` provides a read-only Signal view.
- Computed properties provide product counts, low-stock products, and inventory value.
- All product updates use methods that create new arrays or objects.
- Components call service methods instead of implementing the same business operations independently.

Important: `asReadonly()` does not deeply freeze the objects inside the array. Treat the returned product data as read-only and use service methods for modifications. This demo is also an in-memory implementation: the data disappears on reload, and inventory changes are not persisted to a backend.

# 4. Injecting a service into a component

There are two common ways to inject services: the modern `inject()` function and constructor injection.

## 4.1 Method 1: Using `inject()`

This approach is frequently used in modern Angular applications.

```
import { Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    template: `<h2>Product List</h2>`
})
export class ProductListComponent {

    protected readonly productService = inject(ProductService);
}
```

The important line is:

```
protected readonly productService = inject(ProductService);
```

Angular resolves `ProductService` through its injector and supplies the appropriate instance.

The service's public methods and Signals are now available to the component.

`inject()` can be used during class-field initialization in an Angular-managed component or service, as well as in other supported injection contexts. It cannot be called arbitrarily from every method.&#x20;

## 4.2 Method 2: Constructor injection

Angular also supports constructor injection.

```
import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    template: `<h2>Product List</h2>`
})
export class ProductListComponent {

    constructor(
        protected readonly productService: ProductService
    ) {}
}
```

Angular recognizes the constructor parameter and provides the dependency.

This syntax is familiar to developers with a Java and Spring background.

| `inject()`                                              | Constructor injection                                      |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| Uses a function call in an injection context            | Declares dependencies through constructor parameters       |
| Convenient for field initialization and functional APIs | Convenient when constructor-based initialization is needed |
| Reduces constructor parameter lists                     | Makes dependencies explicit in the constructor             |
| Supported by Angular's DI system                        | Supported by Angular's DI system                           |

Both are valid. For the remaining Product Management examples, we will primarily use `inject()`.

# 5. Product List component using the service

Now that the service manages the product collection, the product-list component becomes simpler.

File: `product-list.ts`

```
import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ProductService } from '../../../core/services/product.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CurrencyPipe],
    template: `
        <h2>Product Management</h2>

        <p>Total products: {{ productService.totalProducts() }}</p>

        <button type="button" (click)="addSampleProduct()">
            Add Sample Product
        </button>

        <section class="product-list">
            @for (
                product of productService.products();
                track product.id
            ) {
                <article class="product-card">
                    <h3>{{ product.name }}</h3>

                    <p>SKU: {{ product.sku }}</p>
                    <p>Category: {{ product.category }}</p>

                    <p>
                        Price:
                        {{ product.price | currency:'INR' }}
                    </p>

                    <p>Stock: {{ product.stockQuantity }}</p>

                    <button
                        type="button"
                        (click)="productService.deleteProduct(product.id)">

                        Delete
                    </button>
                </article>
            } @empty {
                <p>No products available.</p>
            }
        </section>
    `,
    styles: `
        .product-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
        }

        .product-card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 16px;
        }
    `
})
export class ProductListComponent {

    protected readonly productService = inject(ProductService);

    addSampleProduct(): void {
        const currentCount = this.productService.totalProducts();

        this.productService.addProduct({
            name: `Demo Product ${currentCount + 1}`,
            sku: `DEM-${String(1000 + currentCount + 1)}`,
            category: 'Office',
            price: 2500,
            stockQuantity: 8
        });
    }
}
```

### What changed compared with earlier modules?

Previously, the component maintained the product array and implemented the deletion logic itself.

Now it delegates those tasks to `ProductService`.

For example:

```
this.productService.deleteProduct(product.id);
```

The component does not need to know how products are stored or how the collection is updated.

The service manages the state transition, and the Signal notifies Angular when the product list changes.

This is a basic example of separation of concerns: the component manages the UI, while the service manages product operations and shared state.

# 6. Understanding service scope and lifetime

This is one of the most important concepts in dependency injection.

## 6.1 Application-wide service with `providedIn: 'root'`

Our service uses:

```
@Injectable({
    providedIn: 'root'
})
export class ProductService {
}
```

When injected throughout the application without overriding its provider, Angular uses the root-scoped service instance.

Suppose these components all inject `ProductService`:

- `ProductListComponent`
- `ProductDetailsComponent`
- `InventorySummaryComponent`
- `ProductFormComponent`

They receive the same root-scoped instance and can therefore access the same in-memory product state.

Root ProductService

One shared product collection

Product List

Display and delete

Inventory Summary

Counts and totals

Product Form

Add and update

Product Details

View product data

This is a useful approach for application-wide state that should be shared across multiple components.

## 6.2 Component-level providers

Sometimes a service should be scoped to a particular component tree rather than shared throughout the application.

For example, two independent product editors might need separate temporary editing state.

A component can declare a provider:

```
@Component({
    selector: 'app-product-editor',
    standalone: true,
    providers: [ProductEditorStateService],
    template: `...`
})
export class ProductEditorComponent {
    private editorState = inject(ProductEditorStateService);
}
```

Angular creates a service instance in that component's injector. Descendants can resolve that instance through the injector hierarchy, while separate component instances with their own providers can receive separate instances.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



For our application, keep the main `ProductService` at the root because all product-list, form, and summary components should share the same product collection.

Component-level service providers are more appropriate for isolated, temporary state—for example, a draft-editing session that must not affect other editors until the user saves it.

## 6.3 Common provider configurations

| Configuration                             | Typical scope and purpose                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| `@Injectable({ providedIn: 'root' })`     | Application-wide service instance                                              |
| `providers: [SomeService]` in a component | Service instance scoped to that component's injector and descendants           |
| `providers` in application configuration  | Application-level provider registration and overrides                          |
| `providedIn: 'platform'`                  | Service shared at the platform injector level, generally for specialized cases |

The precise instance returned depends on the provider hierarchy. A provider declared on a component can override an application-level provider for that component subtree.

Best practice: Do not register `ProductService` both at the root and again inside the product-list component unless you deliberately want a separate instance. Otherwise, the product-list may use a different collection from the inventory summary.

# 7. Shared services: One change, multiple components

Now let us demonstrate the third topic in the course outline: shared services.

We will create an inventory summary component. It will consume the same `ProductService` used by the Product List component.

## 7.1 Create the inventory summary component

Run:

```
ng g component features/products/components/inventory-summary
```

File: `inventory-summary.ts`

```
import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ProductService } from '../../../core/services/product.service';

@Component({
    selector: 'app-inventory-summary',
    standalone: true,
    imports: [CurrencyPipe],
    template: `
        <section class="inventory-summary">
            <h2>Inventory Summary</h2>

            <p>
                Total products:
                {{ productService.totalProducts() }}
            </p>

            <p>
                Low-stock products:
                {{ productService.lowStockProducts().length }}
            </p>

            <p>
                Total inventory value:
                {{
                    productService.totalInventoryValue()
                        | currency:'INR'
                }}
            </p>
        </section>
    `,
    styles: `
        .inventory-summary {
            margin-bottom: 24px;
            padding: 16px;
            border-radius: 8px;
            background: #f1f5f9;
        }
    `
})
export class InventorySummaryComponent {

    protected readonly productService = inject(ProductService);
}
```

Notice that this component does not maintain another product list. It reads the values exposed by the shared service.

## 7.2 Create a dashboard that uses both components

File: `product-dashboard.ts`

```
import { Component } from '@angular/core';

import { ProductListComponent } from '../pages/product-list/product-list';
import { InventorySummaryComponent } from './inventory-summary';

@Component({
    selector: 'app-product-dashboard',
    standalone: true,
    imports: [
        ProductListComponent,
        InventorySummaryComponent
    ],
    template: `
        <main>
            <app-inventory-summary />
            <app-product-list />
        </main>
    `
})
export class ProductDashboardComponent {}
```

Update your root component to display `ProductDashboardComponent`, or configure it through the router.

Now open the application.

Initially, the inventory summary displays the count and value calculated by `ProductService`. When a product is added or deleted in the product list, the same service updates its Signal state. The inventory summary reacts to that change and recalculates its displayed values.

The two components share state because both inject the same root-scoped service instance—not because Angular components automatically share all their properties.

# 8. Integrating services with the product form

In Module 9, we created a reactive form that added products to an in-memory array inside the component.

We can now replace that local array with the shared `ProductService`.

Inside `ProductReactiveFormComponent`, inject the service:

```
private productService = inject(ProductService);
```

Then, after validating the form, create the product through the service:

```
saveProduct(): void {
    if (this.productForm.invalid) {
        this.productForm.markAllAsTouched();
        return;
    }

    const value = this.productForm.getRawValue();

    this.productService.addProduct({
        name: value.name.trim(),
        sku: value.sku.trim().toUpperCase(),
        category: value.category,
        price: value.price,
        stockQuantity: value.stockQuantity
    });

    this.productForm.reset({
        name: '',
        sku: '',
        category: '',
        price: 0,
        stockQuantity: 0
    });
}
```

This uses the same product form model as before, but the form no longer stores a separate collection of saved products.

After the form calls `addProduct()`, the shared service updates its product Signal. The product list and inventory summary then display the updated data.

This is a practical example of how services connect independently developed components through a shared data source.

# 9. Services versus components

| Component                                                | Service                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| Primarily manages UI and user interactions               | Primarily manages reusable operations and application data |
| Contains template and view-related metadata              | Generally does not have a UI template                      |
| Responds to user actions and renders results             | Exposes methods and data to consumers                      |
| Often depends on services                                | May depend on other services                               |
| Usually scoped to a place in the rendered component tree | Can be application-wide or scoped to a component tree      |

This is a design guideline, not an absolute rule. Components may contain small presentation calculations, and services may support different responsibilities. The objective is to keep each class cohesive and avoid tightly coupling UI components to data-access details.

## 10. Common mistakes and best practices

| Mistake                                                                               | Recommended approach                                                        |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Creating a service using `new ProductService()` inside a component                    | Let Angular inject the service                                              |
| Putting product-management logic in every component                                   | Centralize reusable product operations in `ProductService`                  |
| Registering the same stateful service in multiple component providers unintentionally | Use root scope for shared product state                                     |
| Allowing components to modify shared arrays directly                                  | Expose a read-only view and service methods                                 |
| Assuming a root service persists data across browser refreshes                        | Use a backend API or another persistent data source                         |
| Making one service responsible for every application concern                          | Keep services focused on a cohesive responsibility                          |
| Assuming the root service is a database or security boundary                          | Persist and authorize data on the backend                                   |
| Mixing API code, UI code, and complex business operations into one class              | Separate presentation, domain operations, and data access where appropriate |

## Knowledge check

1\. What is the main purpose of an Angular service?

Define HTML template markup

Encapsulate reusable logic, data access, or shared state

Replace all Angular components

Automatically create database tables

2\. What does providedIn: 'root' typically mean?

Create a new instance on every method call

Provide the service at the application root for sharing throughout the app

Make the service available only in one component

Persist data to the server

3\. Which method requests a service through Angular's injector?

new ProductService()

inject(ProductService)

document.getElementById()

computed(ProductService)

4\. Why do ProductListComponent and InventorySummaryComponent share data?

Every component automatically shares class properties

Both components inject the same root-scoped ProductService instance

Their HTML templates have the same selector

Angular stores their data in index.html

5\. When is a component-level provider appropriate?

Whenever a service must always be global

When a component subtree needs its own isolated service instance

When creating an HTML template

When running npm install

Check answers

### Official Angular references

- [Creating and using services](https://angular.dev/guide/di/creating-and-using-services?utm_source=chatgpt.com)
- [Defining dependency providers](https://angular.dev/guide/di/defining-dependency-providers?utm_source=chatgpt.com)
- [Hierarchical dependency injection](https://angular.dev/guide/di/hierarchical-dependency-injection?utm_source=chatgpt.com)
- [`inject()`](https://angular.dev/api/core/inject?utm_source=chatgpt.com)[ API](https://angular.dev/api/core/inject?utm_source=chatgpt.com)

 