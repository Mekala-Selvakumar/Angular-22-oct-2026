# Module 2: Angular Introduction & Latest Features

 
Version context: As of October 25, 2026, Angular 22 is the latest major release. The official Angular documentation identifies Signal Forms, asynchronous Signals, and Angular Aria as stable in Angular 22. The examples below use modern Angular conventions, with version-specific notes where relevant.&#x20;
 
# 1. Angular overview

## 1.1 What is Angular?

Angular is an open-source web application framework maintained by Google. It provides a structured approach to developing client-side applications using TypeScript, HTML templates, CSS, dependency injection, routing, forms, and other development tools.

Angular is designed to support applications ranging from small interactive websites to large enterprise applications with multiple teams and feature areas.

A traditional web application may use JavaScript to manipulate DOM elements directly. Angular encourages developers to describe the UI through components and templates, then update application state and let the framework synchronize the rendered view.

For example, instead of manually locating an element and changing its text:

```
document.getElementById("message").textContent = "Welcome!";
```

Angular lets us bind the UI to a property:

```
import { Component } from '@angular/core';

@Component({
    selector: 'app-welcome',
    standalone: true,
    template: `<h2>{{ message }}</h2>`
})
export class WelcomeComponent {
    message = 'Welcome!';
}
```

The template displays the value of `message`. The component controls the application state, while Angular manages the relationship between that state and the rendered UI.

Angular components are the fundamental building blocks of Angular applications. Each component combines a TypeScript class, a template, and configuration metadata.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



## 1.2 Why do organizations use Angular?

Consider an enterprise application such as an employee management portal. It might contain employee search, leave requests, approvals, reports, role-based access, API communication, and reusable UI elements.

Without a consistent framework, teams may end up implementing their own conventions for component organization, application state, navigation, validation, and communication with the backend.

Angular provides established mechanisms for these requirements.

| Angular capability    | Purpose                                       | Example in an enterprise application       |
| --------------------- | --------------------------------------------- | ------------------------------------------ |
| Components            | Divide UI into reusable units                 | Employee list, employee details            |
| Templates and binding | Connect state to rendered UI                  | Displaying employee information            |
| Services              | Encapsulate reusable logic                    | Employee API service                       |
| Dependency injection  | Supply dependencies to classes                | Injecting HTTP and authentication services |
| Router                | Handle client-side navigation                 | `/employees/101`                           |
| Forms                 | Capture and validate user input               | Leave request form                         |
| HTTP Client           | Communicate with backend APIs                 | Retrieve employees from Spring Boot        |
| Signals and RxJS      | Manage reactive state and asynchronous data   | Search filters and API responses           |
| Angular CLI           | Scaffold, build, test, and serve applications | Development and production builds          |

Angular also provides architectural conventions that help teams maintain consistency as the application grows.

## 1.3 Angular and other frontend technologies

Angular, React, and Vue are commonly used to build modern web interfaces, but they differ in how they organize applications.

| Aspect                               | Angular                      | React                                                         | Vue                                              |
| ------------------------------------ | ---------------------------- | ------------------------------------------------------------- | ------------------------------------------------ |
| General category                     | Full frontend framework      | UI library with a broader ecosystem                           | Progressive UI framework                         |
| Primary language in typical projects | TypeScript                   | JavaScript or TypeScript                                      | JavaScript or TypeScript                         |
| UI organization                      | Components and templates     | Components, commonly JSX                                      | Components and templates                         |
| Dependency injection                 | Built-in DI system           | Usually supplied through libraries or application patterns    | Available through Vue's provide/inject mechanism |
| Routing                              | Official Angular Router      | Commonly React Router or a framework router                   | Vue Router                                       |
| Application conventions              | Strong framework conventions | More architectural choices are left to the team and ecosystem | Framework conventions with a flexible ecosystem  |

These are general architectural distinctions rather than absolute limitations. All three ecosystems can support large production applications.

For experienced Java developers, Angular's TypeScript classes, dependency injection, services, and explicit architectural patterns may feel familiar. However, Angular's lifecycle, reactivity, template semantics, and dependency-injection behaviour are framework-specific.

## 1.4 What is a Single-Page Application?

A Single-Page Application (SPA) loads the application's initial page and then updates its content through client-side navigation instead of requesting a completely new HTML page for every route.

Consider these URLs:

```
/employees
/employees/101
/leave-requests
/leave-requests/2026
```

The Angular Router can display different components based on the active URL without reloading the entire application document for each navigation.

A typical SPA workflow is:

1. The browser requests the initial application document.
2. Angular initializes the application.
3. The router matches the current URL to a route.
4. Angular renders the relevant component.
5. User actions trigger state changes, navigation, or backend API requests.

The official Angular Router supports route configuration, parameters, nested routes, navigation guards, and other navigation features.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



Important: Angular also supports server-side rendering (SSR) and prerendering. Therefore, Angular applications do not have to rely exclusively on client-side rendering.

# 2. Angular architecture

Angular architecture explains how an application is divided into components, templates, services, dependency injection, routing, and other framework features.

## 2.1 High-level architecture

### Application user

Clicks buttons, enters data, navigates

### Angular components and templates

UI, events, data binding, rendering

### Services and reactive state

Business logic, Signals, RxJS, shared data

### Angular Router, HTTP Client and DI

Navigation, API communication, dependency provision

### Backend services

Spring Boot REST APIs, databases and business systems

This diagram is conceptual. Dependency injection is used across multiple layers, and signals, observables, routing, and HTTP communication are not necessarily arranged in a single linear sequence.

## 2.2 Components

A component is a self-contained UI building block. It generally consists of:

- A TypeScript class for state and behaviour.
- A template for defining the UI.
- A selector used to place the component in another template.
- Metadata that describes how Angular should use the component.

Example:

```
import { Component } from '@angular/core';

@Component({
    selector: 'app-employee-card',
    standalone: true,
    template: `
        <article>
            <h3>{{ employeeName }}</h3>
            <p>Department: {{ department }}</p>
        </article>
    `
})
export class EmployeeCardComponent {
    employeeName = 'Arun Kumar';
    department = 'Engineering';
}
```

The component can be reused in another component by importing it and using its selector.

```
import { Component } from '@angular/core';
import { EmployeeCardComponent } from './employee-card.component';

@Component({
    selector: 'app-employee-page',
    standalone: true,
    imports: [EmployeeCardComponent],
    template: `<app-employee-card />`
})
export class EmployeePageComponent {}
```

This creates a component hierarchy:

```
EmployeePageComponent
    └── EmployeeCardComponent
```

The parent can later pass employee data to the child through component inputs instead of hardcoding the values.

## 2.3 Templates and data binding

Angular templates describe how the component should render its state.

There are four common forms of data binding.

| Binding type     | Syntax                  | Purpose                                          |
| ---------------- | ----------------------- | ------------------------------------------------ |
| Interpolation    | `{{ employeeName }}`    | Display a value as text                          |
| Property binding | `[disabled]="isSaving"` | Set a DOM property or directive/component input  |
| Event binding    | `(click)="save()"`      | Handle a user event                              |
| Two-way binding  | `[(ngModel)]="name"`    | Synchronize a supported value in both directions |

Example:

```
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-counter',
    standalone: true,
    template: `
        <p>Count: {{ count() }}</p>

        <button (click)="increment()">
            Increment
        </button>

        <button
            [disabled]="count() === 0"
            (click)="decrement()">
            Decrement
        </button>
    `
})
export class CounterComponent {
    count = signal(0);

    increment(): void {
        this.count.update(value => value + 1);
    }

    decrement(): void {
        this.count.update(value => value - 1);
    }
}
```

This example combines the component model with event binding, property binding, interpolation, and Signals.

The `count()` expression reads the signal's value. The `count.update()` call changes it. Angular tracks the signal read by the template, allowing the relevant UI to be refreshed when the value changes.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



## 2.4 Services

Services encapsulate functionality that should not be tightly coupled to one UI component.

Common examples include:

- API communication.
- Authentication and authorization.
- Logging and telemetry.
- Business calculations.
- Shared state.
- Formatting and reusable operations.

Example:

```
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Employee {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private http = inject(HttpClient);

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>('/api/employees');
    }
}
```

The service owns the responsibility of retrieving employee data. Components can use it without knowing the implementation details of the HTTP call.

The response type here expresses the expected data shape; it does not automatically validate the actual API response at runtime.

## 2.5 Dependency injection

Dependency injection (DI) means supplying an object or value to a class instead of having the class construct its dependencies directly.

For example, a component may need an `EmployeeService`. Angular provides the service through its injector.

```
import { Component, inject } from '@angular/core';
import { EmployeeService } from './employee.service';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    template: `<h2>Employees</h2>`
})
export class EmployeeListComponent {
    private employeeService = inject(EmployeeService);
}
```

The line

```
private employeeService = inject(EmployeeService);
```

asks Angular to supply an instance of the service from the applicable injection context.

DI helps separate responsibilities, makes dependencies explicit, and supports unit testing with substitute implementations. Angular uses a hierarchical injector system, so the location of a provider can determine the scope and lifetime of a service instance.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



## 2.6 Routing and HTTP communication

Angular Router determines which component appears for a URL. `HttpClient` communicates with backend APIs. Both can be configured using standalone provider functions.

Example route configuration:

```
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list.component';

export const routes: Routes = [
    {
        path: 'employees',
        component: EmployeeListComponent
    },
    {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
    }
];
```

A later routing module can add lazy loading, child routes, guards, and route parameters. These features will be discussed in depth in the Routing module of your course.

### Architecture best practice

Keep UI rendering in components, reusable operations in services, shared data contracts in model files, and backend communication behind an API-oriented service layer. This improves testability and makes it easier to replace one implementation without rewriting every component.

# 3. Standalone components

## 3.1 What is a standalone component?

A standalone component is an Angular component that can be used without being declared in an Angular `NgModule`.

In older Angular applications, components were commonly grouped into `NgModule` declarations. Standalone components let developers declare the template dependencies of each component directly in its `imports` array.

Standalone components are the default in modern Angular; before Angular 19, `standalone` defaulted to `false`.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



### Traditional NgModule-based approach

Conceptually, an older module-based application may look like this:

```
@NgModule({
    declarations: [
        EmployeeListComponent
    ],
    imports: [
        BrowserModule
    ],
    bootstrap: [
        EmployeeListComponent
    ]
})
export class AppModule {}
```

This approach groups declarations and imports at the module level. The exact setup depends on the Angular version and application structure.

### Modern standalone approach

A standalone component describes its own dependencies.

```
import { Component } from '@angular/core';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    template: `
        <h2>Employee List</h2>
        <p>Employee list component is ready.</p>
    `
})
export class EmployeeListComponent {}
```

Here, `standalone: true` explicitly marks the component as standalone. In modern Angular versions, this is generally the default and the property can be omitted.

## 3.2 Importing dependencies into a standalone component

Suppose a parent component wants to display an employee card.

```
import { Component } from '@angular/core';
import { EmployeeCardComponent } from './employee-card.component';

@Component({
    selector: 'app-employee-page',
    standalone: true,
    imports: [EmployeeCardComponent],
    template: `
        <h2>Employee Page</h2>
        <app-employee-card />
    `
})
export class EmployeePageComponent {}
```

The `imports` array specifies the components, directives, pipes, and compatible NgModules available to the template.

A frequent mistake is to import a component in the TypeScript file but forget to add it to the component's `imports` array. A normal TypeScript import alone does not make its selector available in the Angular template.

## 3.3 Using pipes and directives

A standalone component can import an individual pipe or directive.

```
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-employee-summary',
    standalone: true,
    imports: [DatePipe],
    template: `
        <p>Joining date: {{ joiningDate | date:'mediumDate' }}</p>
    `
})
export class EmployeeSummaryComponent {
    joiningDate = new Date(2024, 3, 15);
}
```

`DatePipe` is imported from `@angular/common`. The component uses it in the template through the `date` pipe.

This illustrates the standalone approach: import only the dependencies required by that component's template.

## 3.4 Benefits of standalone components

Local clarity: A component declares the dependencies its template uses, making its requirements easier to inspect.

Simpler organization: Developers can add a feature without necessarily creating or modifying an NgModule.

Reuse: Standalone components, directives, and pipes can be imported by other standalone components.

Lazy-loading support: Standalone components work naturally with route-level lazy loading.

Migration: Standalone components can coexist with existing NgModule-based applications, allowing gradual modernization rather than requiring every module to be rewritten at once.

Standalone components do not automatically guarantee better performance or architecture. Their benefits depend on sensible component boundaries, imports, dependency management, and lazy-loading design.

## 3.5 When should NgModules still be understood?

Experienced developers often work on legacy applications. An enterprise project may still contain existing NgModules, including third-party libraries packaged around them.

Standalone components can import existing NgModules when necessary. Therefore, learning standalone components does not mean that NgModules are irrelevant.

The practical recommendation is to use the modern standalone approach for new application development while understanding enough about NgModules to maintain and integrate with existing systems.

# 4. Standalone APIs

## 4.1 What are standalone APIs?

Standalone APIs are Angular functions and configuration patterns that let developers configure application features directly, without having to create an `NgModule` for every feature.

The key distinction is:

- Standalone components describe reusable UI components and their template dependencies.
- Standalone APIs configure application-level capabilities such as routing, HTTP communication, bootstrapping, and hydration.

Many standalone APIs use provider functions that return configuration for Angular's dependency-injection system.

Examples include:

| API                                | Purpose                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `bootstrapApplication()`           | Starts an Angular application using a standalone root component                                          |
| `provideRouter()`                  | Configures the Angular Router                                                                            |
| `provideHttpClient()`              | Configures the HTTP Client                                                                               |
| `provideClientHydration()`         | Configures client-side hydration for an SSR application                                                  |
| `importProvidersFrom()`            | Makes providers from existing NgModules available to standalone application configuration                |
| `provideZonelessChangeDetection()` | Enables zoneless change detection where supported; Angular 21+ uses zoneless change detection by default |

The official `bootstrapApplication()` API accepts a standalone root component and optional application configuration.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



## 4.2 Understanding `bootstrapApplication()`

In modern Angular, application startup is commonly handled in `main.ts`.

```
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent)
    .catch(error => console.error(error));
```

The key operation is:

```
bootstrapApplication(AppComponent);
```

Angular takes the standalone root component, initializes the application, and renders the component into the application host element.

The root component normally corresponds to the element declared in `index.html`, often `<app-root></app-root>`.

The `bootstrapApplication()` function returns a promise. The error handler helps surface bootstrap failures.

## 4.3 Configuring standalone APIs

A real application usually requires providers for routing, HTTP communication, and other services.

Consider the following configuration.

File: `app.routes.ts`

```
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list.component';

export const routes: Routes = [
    {
        path: 'employees',
        component: EmployeeListComponent
    },
    {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
    }
];
```

File: `app.config.ts`

```
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient()
    ]
};
```

File: `main.ts`

```
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
    .catch(error => console.error(error));
```

Here is what happens:

1. `app.routes.ts` defines the application's routes.
2. `provideRouter(routes)` registers the Router and route configuration.
3. `provideHttpClient()` registers the HTTP Client.
4. `appConfig` groups application-wide providers.
5. `bootstrapApplication()` starts the app using those providers.

This separates application startup from feature-specific code.

Important: The root component must also render a router outlet for route components to appear, for example by importing `RouterOutlet` and including `<router-outlet />` in its template.

## 4.4 Provider functions

Older NgModule-based applications frequently registered providers through `imports` or `providers` on an `NgModule`. Modern standalone applications commonly use provider functions directly in the application configuration.

For example:

```
import { provideRouter } from '@angular/router';

const appConfig = {
    providers: [
        provideRouter(routes)
    ]
};
```

This configures the Router without creating an application module solely for routing.

A provider function may configure more than one dependency. Its primary purpose is to expose a supported, composable API for application configuration.

### What about existing NgModules?

Suppose a legacy library exposes providers through an NgModule. A standalone application can bridge that configuration using `importProvidersFrom()`.

```
import { importProvidersFrom } from '@angular/core';
import { SomeLegacyModule } from './legacy.module';

export const appConfig = {
    providers: [
        importProvidersFrom(SomeLegacyModule)
    ]
};
```

This example illustrates the migration approach; the actual module must be a compatible Angular module that supplies the required providers.

## 4.5 Functional APIs and `inject()`

Modern Angular offers function-based APIs alongside class-based providers.

For example, a route guard can be implemented as a function:

```
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated()
        ? true
        : router.createUrlTree(['/login']);
};
```

In this example, the guard:

- Obtains the authentication service through `inject()`.
- Checks whether the user is authenticated.
- Allows navigation or redirects to the login route.

`inject()` must be called in a valid Angular injection context. The example uses it in a router guard, where Angular provides such a context.

This is a useful pattern for experienced developers because it avoids requiring every piece of Angular logic to be represented by an instantiated class. Functional APIs are particularly useful for guards, interceptors, and application configuration.

Security note: Route guards control client-side navigation; they are not a substitute for backend authorization. The backend must independently verify the user's permissions.

# 5. Angular Signals — Introduction

## 5.1 What problem do Signals solve?

Modern Angular applications need to keep their UI synchronized with application state.

Consider an employee dashboard displaying:

- The total employee count.
- The active employee count.
- A filtered list of employees.
- A search term.
- Loading and error indicators.

When one value changes, some parts of the interface may need to update. Signals provide a reactive mechanism that tracks state reads and notifies interested consumers when the state changes.

An Angular Signal is a wrapper around a value. Reading it establishes a dependency that Angular can track; updating it notifies relevant consumers.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



Signals do not replace all other reactive approaches. They are particularly useful for synchronous state and derived values, while RxJS remains important for streams and asynchronous event processing.

## 5.2 Creating a Signal with `signal()`

Import `signal` from `@angular/core`.

```
import { signal } from '@angular/core';

const count = signal(0);

console.log(count()); // 0
```

Unlike an ordinary variable, a signal is accessed using function-call syntax.

```
count(); // Read the current value
```

You can update the signal in two ways.

### Using `set()`

Use `set()` when you know the new value.

```
count.set(10);

console.log(count()); // 10
```

### Using `update()`

Use `update()` when the new value depends on the current value.

```
count.update(currentValue => currentValue + 1);

console.log(count()); // 11
```

`set()` replaces the value; `update()` calculates a replacement using the current value.

## 5.3 Signals inside Angular components

Consider a counter component.

```
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-counter',
    standalone: true,
    template: `
        <h2>Counter</h2>

        <p>Current value: {{ count() }}</p>

        <button (click)="increment()">
            Increment
        </button>

        <button (click)="reset()">
            Reset
        </button>
    `
})
export class CounterComponent {
    count = signal(0);

    increment(): void {
        this.count.update(value => value + 1);
    }

    reset(): void {
        this.count.set(0);
    }
}
```

When the user clicks Increment:

1. Angular invokes `increment()`.
2. `count.update()` produces a new value.
3. Angular detects that the signal changed.
4. The component template, which reads `count()`, is refreshed as needed.

The signal is the state source; the template expresses how that state should be displayed.

## 5.4 Computed Signals with `computed()`

A computed Signal derives its value from other Signals.

Suppose an application stores an item price and quantity. The total should be calculated automatically whenever either input changes.

```
import { computed, signal } from '@angular/core';

const price = signal(100);
const quantity = signal(3);

const total = computed(() => price() * quantity());

console.log(total()); // 300

quantity.set(5);

console.log(total()); // 500
```

The key difference is that `total` is not independently writable. It is derived from `price` and `quantity`.

Computed Signals are lazy and memoized: their calculation is performed when needed and cached until an input dependency changes. Angular also tracks dependencies dynamically based on the Signals actually read during the computation.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



### An enterprise example: employee filtering

```
import { computed, signal } from '@angular/core';

interface Employee {
    id: number;
    name: string;
    department: string;
}

const employees = signal<Employee[]>([
    { id: 101, name: 'Arun', department: 'IT' },
    { id: 102, name: 'Priya', department: 'Finance' },
    { id: 103, name: 'Kumar', department: 'IT' }
]);

const selectedDepartment = signal('IT');

const filteredEmployees = computed(() =>
    employees().filter(
        employee => employee.department === selectedDepartment()
    )
);

console.log(filteredEmployees());
// Arun and Kumar

selectedDepartment.set('Finance');

console.log(filteredEmployees());
// Priya
```

This demonstrates declarative state derivation. When `selectedDepartment` changes, Angular's reactive system knows that `filteredEmployees` depends on it and can calculate the updated result when required.

## 5.5 Effects with `effect()`

An effect executes a callback when the Signals read by that callback change. It always runs at least once and tracks its dependencies dynamically.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



```
import { Component, effect, signal } from '@angular/core';

@Component({
    selector: 'app-settings',
    standalone: true,
    template: `
        <button (click)="changeTheme()">
            Toggle theme
        </button>

        <p>Theme: {{ theme() }}</p>
    `
})
export class SettingsComponent {
    theme = signal<'light' | 'dark'>('light');

    constructor() {
        effect(() => {
            console.log('Current theme:', this.theme());
        });
    }

    changeTheme(): void {
        this.theme.update(current =>
            current === 'light' ? 'dark' : 'light'
        );
    }
}
```

When the component is created, the effect logs the initial theme. When `theme` changes, the effect runs again.

### When should `effect()` be used?

Effects are best suited to synchronizing Signals with systems outside the normal reactive state model, such as:

- Logging or analytics.
- Browser storage.
- Integrations with third-party imperative libraries.
- Certain DOM-related side effects.

Avoid using effects to copy one Signal into another merely to keep them synchronized. For derived state, prefer `computed()`. Unnecessary effects can introduce circular updates, extra work, and change-detection problems.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



## 5.6 Writable Signals versus computed Signals

| Feature           | `signal()`                         | `computed()`                             |
| ----------------- | ---------------------------------- | ---------------------------------------- |
| Purpose           | Store writable state               | Derive a value from other reactive state |
| Read syntax       | `count()`                          | `total()`                                |
| Update mechanism  | `.set()` or `.update()`            | Recalculate from dependencies            |
| Directly writable | Yes                                | No                                       |
| Typical use case  | Search text, selected tab, counter | Filtered records, totals, derived status |

A good rule is to keep the number of independent state variables manageable and derive values wherever possible.

## 5.7 Signals, Observables, and RxJS

Signals and RxJS Observables both support reactive programming, but they serve different purposes.

| Signals                                                | RxJS Observables                                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Convenient for current state                           | Convenient for sequences of asynchronous values or events                        |
| Read by calling the signal                             | Observed by subscription or used with operators                                  |
| Update with `set()` or `update()` for writable Signals | Streams may emit zero, one, or many values over time                             |
| `computed()` derives state                             | Operators such as `map`, `filter`, and `switchMap` transform streams             |
| Often ideal for UI state and synchronous derivations   | Often ideal for HTTP streams, event streams, cancellation and stream composition |

For example, a search field's current text could be held in a Signal, while an HTTP search workflow could use RxJS operators to debounce input and cancel outdated requests.

These approaches can coexist in the same Angular application.

For this introductory module, understand the purpose and core APIs. The detailed comparison of Signals and Observables belongs in the later Signals and RxJS modules.

# 6. Latest Angular features

This section is particularly important for experienced developers because modern Angular has evolved beyond its traditional NgModule-based architecture and conventional change-detection model.

The following features distinguish established modern Angular capabilities from features introduced or stabilized in Angular 22.

## 6.1 Built-in template control flow

Angular provides built-in control-flow blocks that allow developers to display conditional content, iterate over collections, and select between alternatives without relying on the older structural-directive syntax for these common cases. ([Angular control flow guide](https://angular.dev/guide/templates/control-flow?utm_source=chatgpt.com))

### Conditional rendering with `@if`

```
@if (isLoggedIn) {
    <p>Welcome to the employee portal.</p>
} @else {
    <p>Please log in.</p>
}
```

Angular displays the first block when `isLoggedIn` is truthy; otherwise, it displays the second.

### Iterating with `@for`

```
@for (employee of employees; track employee.id) {
    <p>{{ employee.name }}</p>
} @empty {
    <p>No employees found.</p>
}
```

The `track employee.id` expression identifies each employee's corresponding rendered item. This lets Angular associate data records with DOM elements when updating a collection.

Use a stable unique identifier when the data provides one.

### Selection with `@switch`

```
@switch (orderStatus) {
    @case ('PENDING') {
        <p>Order is pending.</p>
    }
    @case ('SHIPPED') {
        <p>Order has been shipped.</p>
    }
    @case ('DELIVERED') {
        <p>Order has been delivered.</p>
    }
    @default {
        <p>Unknown order status.</p>
    }
}
```

In Angular 22, `@switch` also supports exhaustive checking with `@default never;` for suitable typed expressions. This helps detect unhandled cases during template type checking, rather than leaving them to appear as UI bugs. ([Angular v22 release notes](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664?utm_source=chatgpt.com))

## 6.2 Deferred loading with `@defer`

Large applications often contain components that are not required during initial page rendering, such as analytics charts, detailed reports, or rarely opened dialogs.

The `@defer` block allows eligible dependencies to be loaded later, reducing the amount of code required for the initial render.

```
<h2>Employee Dashboard</h2>

<p>Welcome to your dashboard.</p>

@defer (on viewport) {
    <app-employee-analytics />
} @placeholder {
    <p>Analytics will load when this section becomes visible.</p>
} @loading {
    <p>Loading analytics...</p>
} @error {
    <p>Unable to load analytics.</p>
}
```

Here:

- `@defer` defines content that can load later.
- `on viewport` triggers loading when the relevant content approaches the viewport.
- `@placeholder` supplies content before deferred loading begins.
- `@loading` displays a loading state.
- `@error` supplies fallback content if deferred loading fails.

For deferred dependencies to be split out as intended, Angular imposes restrictions: the dependencies must be standalone, and references elsewhere in the same file can cause them to be loaded eagerly instead. ([Angular deferred-loading guide](https://angular.dev/guide/templates/defer?utm_source=chatgpt.com))

Enterprise use case: An employee dashboard might initially load the summary cards and load detailed reporting components only when the user scrolls to that section.

## 6.3 Zoneless Angular

Angular has traditionally used ZoneJS to help detect asynchronous activity and determine when application views may need updating.

Zoneless Angular reduces reliance on ZoneJS and uses explicit notifications from mechanisms such as Signals, component inputs, template event listeners, and other Angular APIs to schedule updates.

Angular 21 and later use zoneless change detection by default, according to the current official documentation. ([Angular zoneless guide](https://angular.dev/guide/zoneless?utm_source=chatgpt.com))

Benefits include:

- Less overhead associated with ZoneJS.
- More explicit state-change notifications.
- Potential improvements in startup performance and application efficiency.
- Simpler debugging in situations where ZoneJS previously complicated call stacks.

However, zoneless does not mean that Angular stops updating the UI. The framework still needs to know when state changes should trigger rendering.

For example, Signals provide one way to communicate such changes:

```
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-notification',
    standalone: true,
    template: `
        <p>Notifications: {{ unreadCount() }}</p>
        <button (click)="markAsRead()">Mark as read</button>
    `
})
export class NotificationComponent {
    unreadCount = signal(3);

    markAsRead(): void {
        this.unreadCount.update(count => Math.max(0, count - 1));
    }
}
```

The template reads the Signal. Updating it provides Angular with the required reactive notification.

When upgrading legacy applications, developers should verify compatibility with existing libraries and code that assumes ZoneJS is present.

## 6.4 Server-side rendering and hydration

Modern Angular supports multiple rendering strategies:

- Client-side rendering (CSR): Angular runs in the browser and renders the application there.
- Server-side rendering (SSR): The server generates HTML for the requested route.
- Prerendering: HTML is generated ahead of time for selected routes.
- Hydration: Angular initializes the client application and reuses eligible server-rendered DOM rather than rebuilding the entire UI from scratch.

Hydration can reduce unnecessary DOM recreation and visible rendering changes. It is relevant to performance, user experience, and Core Web Vitals. ([Angular hydration guide](https://angular.dev/guide/hydration?utm_source=chatgpt.com))

The following configuration illustrates hydration for a standalone application configured for SSR:

```
import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideClientHydration()
    ]
});
```

This provider must be configured appropriately in the application's server and client bootstrap arrangements. In projects scaffolded with Angular CLI's SSR setup, hydration configuration is generally included automatically.

When is it useful? SSR and hydration are relevant when initial HTML delivery, content visibility, or search-engine discoverability is important. They are not mandatory for every internal enterprise dashboard.

## 6.5 Important Angular 22 changes

Angular 22 was released on June 3, 2026. Its major themes include stabilization of reactive APIs, stronger template capabilities, and improvements to dependency management and change detection. ([Angular v22 release announcement](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664?utm_source=chatgpt.com))

A. Signal Forms — stable in Angular 22

Signal Forms provide a reactive forms approach built around Signals and typed models. They support declarative field definitions, validation, and template binding.

This is a new option for form development, not a requirement to rewrite every existing reactive form.

Related course topic: Module 9 — Forms.

B. Asynchronous reactivity APIs — stable in Angular 22

APIs such as `resource` provide a Signal-oriented way to represent asynchronous data, including loading and value states. `httpResource` extends this model to HTTP-based data fetching.

This is particularly relevant to data-driven applications, although RxJS remains valuable for complex streams and asynchronous orchestration.

Related course topic: Modules 7, 11 and 13.

C. Angular Aria — stable in Angular 22

Angular Aria supplies accessible UI interaction patterns and primitives that developers can use when building customizable components.

It helps address accessibility concerns such as keyboard interaction and assistive-technology support without forcing a particular visual design.

Enterprise relevance: reusable, accessible UI components.

D. The new `@Service` decorator

Angular 22 introduced `@Service()` as a concise way to define an automatically provided service for common application-wide use cases.

```
import { Service } from '@angular/core';

@Service()
export class EmployeeStore {
    private employees: string[] = [];

    addEmployee(name: string): void {
        this.employees.push(name);
    }

    getEmployees(): string[] {
        return [...this.employees];
    }
}
```

Existing `@Injectable()` patterns remain relevant, including cases that require additional dependency-injection configuration. Check the version-specific guidance before migrating existing services.

E. Asynchronous dependency injection with `injectAsync()`

Angular 22 introduces support for loading certain services on demand through asynchronous dependency injection.

Conceptually, this can help split rarely used services into separate chunks instead of eagerly loading them at startup.

```
import { Component, injectAsync } from '@angular/core';

@Component({
    selector: 'app-report',
    template: `
        <button (click)="exportReport()">Export report</button>
    `
})
export class ReportComponent {
    private exporter = injectAsync(
        () => import('./report-exporter')
    );

    async exportReport(): Promise<void> {
        const exporter = await this.exporter();
        exporter.export();
    }
}
```

The dynamically loaded module must expose the expected service implementation, and the feature should be used according to Angular 22's dependency-injection requirements.

These changes are documented in Angular's official [v22 announcement](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664?utm_source=chatgpt.com). The Signal Forms, Angular Aria, and asynchronous reactivity APIs are identified there as stable. Other APIs may have their own stability or preview status.

## 6.6 Additional Angular 22 template and change-detection improvements

Experienced developers should also be aware of these changes:

| Feature                               | Why it matters                                                                                                                                                                          |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@switch` improvements                | Supports shared cases, reduces duplication, and supports exhaustive checking for appropriate typed expressions.                                                                         |
| Spread and rest syntax in templates   | Makes certain object, array, and function-call expressions more concise.                                                                                                                |
| Arrow functions in templates          | Enables simple inline callbacks, although complex logic should remain in component code.                                                                                                |
| `OnPush` default for new applications | Aligns new applications with a more explicit, performance-conscious change-detection model.                                                                                             |
| `ChangeDetectionStrategy.Eager`       | The former `Default` change-detection strategy is renamed `Eager` in Angular 22.                                                                                                        |
| Template error boundaries             | Angular 22 announced `@boundary` as a way to isolate certain template errors; its exact preview/stability status should be checked against the installed minor version before adoption. |

The `OnPush` change deserves attention. Developers familiar with older Angular projects may be used to explicitly configuring `ChangeDetectionStrategy.OnPush`. In Angular 22, it is the default for new applications, although existing applications may have different configuration and migration requirements. ([Angular v22 announcement](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664?utm_source=chatgpt.com))

### Which features should you emphasize in this two-hour module?

Prioritize these concepts in this order:

1. Architecture and standalone components: These establish the modern Angular application model.
2. Standalone APIs: These explain how applications are bootstrapped and configured.
3. Signals: These introduce reactive state management.
4. Current Angular capabilities: Briefly demonstrate built-in control flow, `@defer`, zoneless change detection, and the important Angular 22 additions.

Signal Forms and RxJS operators deserve more detailed treatment in their dedicated modules later in your course. This module should introduce them without trying to replace those lessons.

# 7. Integrated practical example

The following example brings together standalone components, standalone application configuration, routing, Signals, and built-in control flow.

Suppose the application displays employees and allows the user to filter them by department.

## Step 1: Create the employee model

File: `employee.model.ts`

```
export interface Employee {
    id: number;
    name: string;
    department: string;
}
```

This defines the structure of an employee record.

## Step 2: Create the employee component

File: `employee-list.component.ts`

```
import { Component, computed, signal } from '@angular/core';

import { Employee } from './employee.model';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    template: `
        <h2>Employee Directory</h2>

        <label for="department">Department</label>

        <select
            id="department"
            [value]="selectedDepartment()"
            (change)="changeDepartment($event)">
            <option value="ALL">All departments</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
        </select>

        <p>Employees found: {{ filteredEmployees().length }}</p>

        <ul>
            @for (employee of filteredEmployees(); track employee.id) {
                <li>
                    {{ employee.name }} — {{ employee.department }}
                </li>
            } @empty {
                <li>No employees found.</li>
            }
        </ul>
    `
})
export class EmployeeListComponent {

    employees = signal<Employee[]>([
        { id: 101, name: 'Arun', department: 'IT' },
        { id: 102, name: 'Priya', department: 'Finance' },
        { id: 103, name: 'Kumar', department: 'IT' }
    ]);

    selectedDepartment = signal('ALL');

    filteredEmployees = computed(() => {
        const department = this.selectedDepartment();

        if (department === 'ALL') {
            return this.employees();
        }

        return this.employees().filter(
            employee => employee.department === department
        );
    });

    changeDepartment(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedDepartment.set(selectElement.value);
    }
}
```

### How does it work?

- `Employee` defines the data structure.
- `EmployeeListComponent` is a standalone component.
- `employees` stores the employee collection in a writable Signal.
- `selectedDepartment` stores the selected filter.
- `computed()` derives the filtered list from those values.
- `@for` renders each employee.
- `track employee.id` gives Angular a stable item identifier.
- The event handler updates the selected department.

When the department changes, the computed Signal is invalidated, and the rendered list is updated as required.

## Step 3: Configure application routing

File: `app.routes.ts`

```
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list.component';

export const routes: Routes = [
    {
        path: 'employees',
        component: EmployeeListComponent
    },
    {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
    }
];
```

## Step 4: Configure the root component

File: `app.component.ts`

```
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `
        <header>
            <h1>Employee Management</h1>
        </header>

        <main>
            <router-outlet />
        </main>
    `
})
export class AppComponent {}
```

The router outlet is where Angular renders the component corresponding to the active route.

## Step 5: Configure standalone providers

File: `app.config.ts`

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

## Step 6: Bootstrap the application

File: `main.ts`

```
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
    .catch(error => console.error(error));
```

After running the application, navigate to `/employees`. Users should see the employee list, and changing the department should filter the displayed records.

This is a deliberately small in-memory example. A production implementation would normally retrieve employee records through an Angular service and backend API.

# 8. Common mistakes and best practices

| Common mistake                                                                     | Better approach                                                                                                       |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Treating standalone components and standalone APIs as identical                    | Components describe UI; standalone APIs configure application capabilities.                                           |
| Importing a component in TypeScript but omitting it from the component's `imports` | Declare the dependency in the standalone component metadata.                                                          |
| Creating independent Signals for every derived value                               | Use `computed()` for values that can be calculated from existing state.                                               |
| Using `effect()` to maintain copies of related state                               | Prefer derived state with `computed()` where appropriate.                                                             |
| Loading every feature eagerly                                                      | Evaluate route-level lazy loading and `@defer` for suitable features.                                                 |
| Assuming Angular 22 behaves exactly like Angular 18 or 19                          | Verify the framework version, defaults, migration requirements, and API stability.                                    |
| Treating route guards as backend security                                          | Enforce authentication and authorization on the backend as well.                                                      |
| Assuming a TypeScript response type validates server data                          | Use runtime validation where external data cannot be trusted.                                                         |
| Using Signals as a replacement for all RxJS functionality                          | Choose Signals for state and derivation; use RxJS when stream operators and asynchronous composition fit the problem. |


## Quick knowledge check

1\. What does a standalone component primarily eliminate the need for?

TypeScript

An NgModule declaration for that component

Angular templates

Dependency injection

2\. Which API is used to start an Angular application with a standalone root component?

provideRouter()

computed()

bootstrapApplication()

inject()

3\. Which Signal API is best suited to deriving a total from a price and quantity?

effect()

computed()

bootstrapApplication()

provideHttpClient()

4\. What is the main purpose of @defer?

Define an interface

Replace the Angular Router

Delay loading eligible dependencies until they are needed

Create an NgModule

5\. Are Signals a complete replacement for RxJS?

Yes, all Observables are obsolete

No, the two solve overlapping but different reactive needs

Yes, but only for HTTP requests

No, because Signals cannot store values

Check answers

## Official references for further study

For practical demonstrations, the most useful references are the official Angular documentation:

- [Angular introduction and components](https://angular.dev/essentials/components?utm_source=chatgpt.com)
- [Standalone components](https://angular.dev/guide/components/importing?utm_source=chatgpt.com)
- [Standalone application bootstrap](https://angular.dev/api/platform-browser/bootstrapApplication?utm_source=chatgpt.com)
- [Dependency injection](https://angular.dev/guide/di/dependency-injection?utm_source=chatgpt.com)
- [Signals overview](https://angular.dev/guide/signals?utm_source=chatgpt.com)
- [Built-in template control flow](https://angular.dev/guide/templates/control-flow?utm_source=chatgpt.com)
- [Deferred loading with ](https://angular.dev/guide/templates/defer?utm_source=chatgpt.com)[`@defer`](https://angular.dev/guide/templates/defer?utm_source=chatgpt.com)
- [Angular v22 release announcement](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664?utm_source=chatgpt.com)

Key takeaway: Modern Angular combines a component-oriented architecture with standalone configuration, reactive Signals, declarative templates, and improved rendering strategies. For experienced developers, the goal is not merely to learn new syntax but to understand how these features affect architecture, reactivity, performance, testability, and maintainability in enterprise applications.