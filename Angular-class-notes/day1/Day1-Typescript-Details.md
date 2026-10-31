# Module 1: TypeScript Fundamentals

 This module covers the six topics : Types, Interfaces, Classes, Decorators, Modules, and Enums. The emphasis is on writing strongly typed, maintainable code that can be used in enterprise Angular applications.

 
## 1. Types in TypeScript

### 1.1 What is a type?

A type defines the kind of value a variable can hold and the operations that are valid for that value.

In JavaScript, developers can assign values of different types to the same variable. TypeScript allows us to declare or infer the expected type so that many mistakes can be detected before execution.

```
let employeeName: string = "Arun";
let employeeAge: number = 35;
let isPermanent: boolean = true;

employeeName = "Priya";  // Valid
employeeAge = 36;        // Valid

// Compile-time errors
// employeeName = 100;
// employeeAge = "thirty-six";
```

The syntax is:

```
let variableName: type = value;
```

Here, `: string`, `: number`, and `: boolean` are called type annotations.

### 1.2 Basic types

| Type        | Purpose                       | Example        |
| ----------- | ----------------------------- | -------------- |
| `string`    | Textual data                  | `"Angular"`    |
| `number`    | Integers and decimal numbers  | `125`, `45.75` |
| `boolean`   | True/false values             | `true`         |
| `null`      | An explicitly empty value     | `null`         |
| `undefined` | A missing or unassigned value | `undefined`    |
| `bigint`    | Very large integers           | `100n`         |
| `symbol`    | Unique identifiers            | `Symbol("id")` |

TypeScript uses the same underlying JavaScript primitive types for these values. The TypeScript annotations enable additional checking during development.

### 1.3 Type inference

Developers do not have to annotate every variable. TypeScript can infer types from initial values and expressions.

```
let company = "ABC Technologies";
let employeeCount = 250;
let isActive = true;

company = "XYZ Technologies"; // Valid

// Compile-time error:
// company = 100;
```

TypeScript infers `company` as `string`, `employeeCount` as `number`, and `isActive` as `boolean`.

This is called type inference.

For experienced developers, the recommended approach is to use inference where the type is obvious and explicit annotations where they improve readability or define an important contract.

### 1.4 Arrays and tuples

An array holds multiple values. TypeScript can restrict the element types of an array.

```
let salaries: number[] = [45000, 55000, 65000];

salaries.push(70000); // Valid

// Compile-time error:
// salaries.push("80000");
```

The generic syntax is also available:

```
let departmentNames: Array<string> = [
    "Engineering",
    "Finance",
    "Human Resources"
];
```

A tuple represents a fixed arrangement of values with specified types.

```
let employeeRecord: [number, string, boolean] =
    [101, "Arun", true];

const employeeId = employeeRecord[0];
const employeeName = employeeRecord[1];
```

Here, the tuple represents an employee ID, name, and active status in a defined order.

In enterprise applications, an array is generally suitable for collections of similar records, whereas tuples are useful for small, fixed-structure values.

### 1.5 The `any` and `unknown` types

These types are especially important when integrating with APIs, third-party libraries, or legacy JavaScript.

The `any` type disables most static checking for a value.

```
let response: any = 100;

response = "Success";
response = { status: "Approved" };

console.log(response.toUpperCase());
```

The last call may fail at runtime if `response` is a number or an object without a compatible method. TypeScript does not protect us adequately because the value is typed as `any`.

```
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```


The `unknown` type allows a value of any type to be assigned, but requires us to establish the value's type before performing type-specific operations.

```
let response: unknown = "Success";

if (typeof response === "string") {
    console.log(response.toUpperCase());
}
```

Compare their intended use:

| `any`                                                                 | `unknown`                                          |
| --------------------------------------------------------------------- | -------------------------------------------------- |
| Allows operations without meaningful type checks                      | Requires narrowing before type-specific operations |
| Can weaken type safety throughout the code                            | Preserves type safety until the value is checked   |
| Useful when migrating poorly typed legacy code, but should be limited | Useful for data whose type is not yet known        |

Enterprise recommendation: Prefer `unknown` over `any` when receiving untrusted or untyped data. Remember that even `unknown` does not validate an API response automatically; runtime validation may still be required.

### 1.6 Union types and type narrowing

A union type allows a variable or parameter to hold one of several specified types.

```
function displayEmployeeId(id: number | string): void {
    console.log(id);
}

displayEmployeeId(101);
displayEmployeeId("EMP-101");
```

The `number | string` notation means that the value can be either a number or a string.

However, code must account for the differences between the possible types.

```
function formatEmployeeId(id: number | string): string {
    if (typeof id === "string") {
        return id.toUpperCase();
    }

    return `EMP-${id}`;
}

console.log(formatEmployeeId("emp-101")); // EMP-101
console.log(formatEmployeeId(101));       // EMP-101
```

Inside the `if` block, TypeScript knows that `id` is a string. After the condition, in the remaining branch, it knows that `id` is a number.

This process is called type narrowing. It is central to writing safe code involving unions.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.typescriptlang.org\&sz=32)

Everyday Types



### 1.7 Literal types

Sometimes a variable should accept only particular values, rather than every string or number.

```
type OrderStatus = "PENDING" | "APPROVED" | "REJECTED";

let status: OrderStatus = "PENDING";

status = "APPROVED"; // Valid

// Compile-time error:
// status = "COMPLETED";
```

The type accepts exactly three string values.

Literal unions are particularly useful for API states, configuration options, UI modes, and small state machines.

### 1.8 Type aliases

A type alias gives a name to a type expression.

```
type EmployeeId = number;

type Employee = {
    id: EmployeeId;
    name: string;
    salary: number;
};

const employee: Employee = {
    id: 101,
    name: "Arun",
    salary: 75000
};
```

A type alias can also represent unions, intersections, tuples, and function types.

```
type Identifier = number | string;

type Calculation = (a: number, b: number) => number;

const add: Calculation = (a, b) => a + b;
```

Notice that a type alias does not create a new runtime class or object. It defines a type that TypeScript checks during development.

### 1.9 `void`, `never`, and `object`

These types describe some additional function and value behaviours.

```
function logMessage(message: string): void {
    console.log(message);
}
```

`void` is commonly used for a function whose return value is not intended to be used.

```
function fail(message: string): never {
    throw new Error(message);
}
```

`never` describes a value that cannot occur normally, such as the result of a function that always throws or never finishes. It is also useful when checking that all cases of a union have been handled.

```
function getEmployeeDisplayName(): object {
    return { name: "Arun" };
}
```

`object` represents non-primitive values. In normal application code, a specific object type is usually more useful than the broad `object` type.

### 1.10 Optional properties, `readonly`, and strict checking

```
interface EmployeeProfile {
    readonly id: number;
    name: string;
    department?: string;
}

const profile: EmployeeProfile = {
    id: 101,
    name: "Arun"
};

profile.name = "Arun Kumar"; // Valid

// Compile-time error:
// profile.id = 102;
```

- `readonly` prevents reassignment of the property through this type.
- `?` indicates that the property may be omitted.
- `strictNullChecks` helps detect unsafe use of `null` and `undefined`.

Important: `readonly` is primarily a compile-time restriction. It does not automatically deep-freeze an object at runtime.

For Angular applications, enabling strict TypeScript checks and Angular template checking helps detect mistakes earlier. Static checking is not a substitute for runtime validation of external data.

## 2. Interfaces

### 2.1 What is an interface?

An interface defines a contract that an object or class is expected to follow.

It describes which properties and methods must exist and the types they must satisfy. It does not generally provide the implementation of those methods.

Interfaces are useful when multiple developers or application layers need to agree on a common data structure or behaviour.

Consider an employee management application.

```
interface Employee {
    id: number;
    name: string;
    department: string;
    salary: number;
}

const employee: Employee = {
    id: 101,
    name: "Arun",
    department: "Engineering",
    salary: 75000
};
```

Here, the `Employee` interface specifies four required properties. An object assigned to this type must provide compatible values for all four properties.

For example, the following is invalid:

```
const employee: Employee = {
    id: 101,
    name: "Arun",
    department: "Engineering"
    // Error: salary is missing
};
```

This is a compile-time error, not a runtime validation mechanism.

### 2.2 Optional and readonly properties

Interfaces support optional and readonly properties.

```
interface Employee {
    readonly id: number;
    name: string;
    email?: string;
}

const employee: Employee = {
    id: 101,
    name: "Arun"
};

employee.name = "Arun Kumar"; // Valid

// Compile-time error:
// employee.id = 102;
```

The `?` indicates that `email` may be omitted. The `readonly` modifier prevents ordinary reassignment of `id` through this type.

### 2.3 Methods in interfaces

Interfaces can define method signatures.

```
interface PaymentProcessor {
    processPayment(amount: number): boolean;
    refundPayment(transactionId: string): void;
}
```

Any class implementing this interface must provide compatible implementations of the required methods.

```
class CardPaymentProcessor implements PaymentProcessor {

    processPayment(amount: number): boolean {
        console.log(`Processing payment: ${amount}`);
        return true;
    }

    refundPayment(transactionId: string): void {
        console.log(`Refunding transaction: ${transactionId}`);
    }
}
```

The interface defines what the processor must do. The class determines how it does it.

### 2.4 Interface extension

An interface can extend one or more compatible interfaces to reuse and refine existing contracts.

```
interface Person {
    id: number;
    name: string;
}

interface Employee extends Person {
    department: string;
    salary: number;
}

const employee: Employee = {
    id: 101,
    name: "Arun",
    department: "IT",
    salary: 75000
};
```

`Employee` inherits the properties of `Person` and adds its own.

This is useful when building related domain models, such as `Person`, `Employee`, `Manager`, and `Customer`.

### 2.5 Interfaces and classes: what is the difference?

| Interface                                        | Class                                                         |
| ------------------------------------------------ | ------------------------------------------------------------- |
| Defines a type-level contract                    | Defines a runtime class                                       |
| Cannot be instantiated directly                  | Can be instantiated unless abstract                           |
| Does not provide ordinary method implementations | Can provide method implementations                            |
| Can be implemented by a class                    | Can implement interfaces                                      |
| Is erased during compilation                     | Produces JavaScript class code, subject to compilation target |

A key point for experienced developers: an interface is not the same as an abstract class. An abstract class can provide shared implementation and instance state, whereas an interface describes a contract.

### 2.6 Interface vs. type alias

Both can describe object shapes, so there is some overlap.

```
interface EmployeeContract {
    id: number;
    name: string;
}

type EmployeeRecord = {
    id: number;
    name: string;
};
```

Both definitions allow compatible objects to be assigned.

The main differences are:

- Interfaces can be extended with `extends` and support declaration merging.
- Type aliases can represent unions, tuples, primitives, intersections, and other type expressions.
- Neither is inherently better for every situation; choose based on the design requirement.

For example:

```
type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";
```

An interface is not suitable for directly expressing that union. A type alias is.

TypeScript uses structural typing, meaning compatibility is primarily based on the members a value provides, rather than only on the name of its declared type.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.typescriptlang.org\&sz=32)

Object Types



### 2.7 Practical Angular example

Interfaces are commonly used to describe API data transferred between a server and an Angular application.

```
export interface Employee {
    id: number;
    name: string;
    department: string;
    salary: number;
}
```

A service can use the interface when requesting data:

```
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';

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

The type argument in `get<Employee[]>()` tells TypeScript what response structure the application expects.

Important: This annotation does not verify the actual JSON returned by the server. If runtime data validation is necessary, validate the received data separately.

## 3. Classes

### 3.1 What is a class?

A class is a blueprint for creating objects. It groups data and behaviour into a single logical unit.

TypeScript supports JavaScript classes and adds type annotations, access modifiers, interfaces, abstract classes, and other object-oriented programming features.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.typescriptlang.org\&sz=32)

Classes



Consider a simple employee class.

```
class Employee {

    id: number;
    name: string;
    salary: number;

    constructor(id: number, name: string, salary: number) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }

    displayDetails(): void {
        console.log(`${this.id} - ${this.name} - ${this.salary}`);
    }
}

const employee = new Employee(101, "Arun", 75000);

employee.displayDetails();
```

The important components are:

- `class Employee`: declares the class.
- Properties such as `id` and `name`: hold object state.
- `constructor()`: initializes an instance.
- `this`: refers to the current instance.
- `displayDetails()`: defines an instance method.
- `new Employee(...)`: creates an object.

### 3.2 Constructor parameter properties

TypeScript provides a shortcut for declaring and initializing properties through constructor parameters.

```
class Employee {

    constructor(
        public id: number,
        public name: string,
        public salary: number
    ) {}

    displayDetails(): void {
        console.log(`${this.name}: ${this.salary}`);
    }
}
```

The `public` parameters become properties automatically. This avoids declaring each property separately and assigning it inside the constructor.

This syntax is particularly useful for concise domain models and service classes.

### 3.3 Access modifiers

TypeScript provides `public`, `private`, and `protected` modifiers to express intended access.

```
class BankAccount {

    public accountHolder: string;
    private balance: number;
    protected accountType: string;

    constructor(
        accountHolder: string,
        balance: number,
        accountType: string
    ) {
        this.accountHolder = accountHolder;
        this.balance = balance;
        this.accountType = accountType;
    }

    public getBalance(): number {
        return this.balance;
    }

    public deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive");
        }

        this.balance += amount;
    }
}

const account = new BankAccount("Arun", 10000, "Savings");

account.deposit(2000);
console.log(account.getBalance()); // 12000

// Compile-time error:
// console.log(account.balance);
```

| Modifier    | Meaning                                                                     |
| ----------- | --------------------------------------------------------------------------- |
| `public`    | Accessible from anywhere the instance or class is accessible                |
| `private`   | Accessible only inside the declaring class under TypeScript's access checks |
| `protected` | Accessible inside the declaring class and its subclasses                    |

The JavaScript runtime does not enforce TypeScript's ordinary `private` modifier in the same way as JavaScript's native `#privateField` syntax. Use native private fields when runtime-enforced private access is required.

Access modifiers improve encapsulation but do not automatically secure sensitive data against inspection or malicious input.

### 3.4 Readonly properties

A `readonly` property can be assigned during declaration or initialization, but it cannot ordinarily be reassigned afterward.

```
class Employee {

    constructor(
        public readonly employeeId: number,
        public name: string
    ) {}
}

const employee = new Employee(101, "Arun");

employee.name = "Arun Kumar"; // Valid

// Compile-time error:
// employee.employeeId = 102;
```

This is useful for identifiers or other values that should remain stable after object creation.

### 3.5 Inheritance

Inheritance allows a class to extend another class and reuse or specialize its behaviour.

```
class Person {

    constructor(public name: string) {}

    introduce(): void {
        console.log(`My name is ${this.name}`);
    }
}

class Manager extends Person {

    constructor(
        name: string,
        public department: string
    ) {
        super(name);
    }

    conductMeeting(): void {
        console.log(`${this.name} is conducting a meeting`);
    }
}

const manager = new Manager("Arun", "Engineering");

manager.introduce();
manager.conductMeeting();
```

Here:

- `Manager extends Person` establishes inheritance.
- `super(name)` initializes the inherited portion of the object.
- `Manager` inherits `introduce()` and adds `conductMeeting()`.

### 3.6 Method overriding

A subclass can provide a specialized implementation of an inherited method.

```
class Employee {

    constructor(public name: string) {}

    calculateBonus(): number {
        return 5000;
    }
}

class SeniorEmployee extends Employee {

    override calculateBonus(): number {
        return 15000;
    }
}
```

The `override` keyword makes the intention explicit. It also helps the compiler detect mistakes if a corresponding base-class method does not exist.

### 3.7 Abstract classes

An abstract class defines shared behaviour and requires subclasses to implement certain operations.

```
abstract class Payment {

    constructor(protected amount: number) {}

    abstract process(): boolean;

    printAmount(): void {
        console.log(`Payment amount: ${this.amount}`);
    }
}

class CardPayment extends Payment {

    override process(): boolean {
        console.log("Processing card payment");
        return true;
    }
}

const payment = new CardPayment(5000);
payment.printAmount();
payment.process();
```

An abstract class cannot be instantiated directly.

```
// Compile-time error:
// const payment = new Payment(5000);
```

Abstract classes are useful when related implementations share common logic and must implement a common operation.

### 3.8 Implementing interfaces

Classes can implement interfaces to enforce a contract.

```
interface NotificationService {
    send(message: string): void;
}

class EmailNotificationService implements NotificationService {

    send(message: string): void {
        console.log(`Sending email: ${message}`);
    }
}

class SmsNotificationService implements NotificationService {

    send(message: string): void {
        console.log(`Sending SMS: ${message}`);
    }
}
```

The interface makes it possible to write code that depends on the contract rather than a specific notification mechanism.

```
function notifyUser(
    service: NotificationService,
    message: string
): void {
    service.send(message);
}

notifyUser(new EmailNotificationService(), "Your order is shipped");
notifyUser(new SmsNotificationService(), "Your OTP is 123456");
```

In production code, the notification mechanism and configuration would be supplied through an appropriate dependency-injection or factory design rather than necessarily constructed directly at every call site.

### 3.9 When should classes be used in Angular?

Classes are essential to Angular's component and service model.

For example:

```
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CalculationService {

    add(a: number, b: number): number {
        return a + b;
    }

    calculateDiscount(amount: number, percentage: number): number {
        return amount * percentage / 100;
    }
}
```

Angular can provide the service through dependency injection to components or other services.

A useful distinction: not every data structure needs to be a class. Interfaces and type aliases are often better for simple data contracts, while classes are appropriate when an entity needs encapsulated state, methods, initialization, or inheritance.

## 4. Decorators

### 4.1 What is a decorator?

A decorator is a special construct represented by the `@` symbol. It associates metadata or behaviour with certain declarations, depending on the decorator implementation.

In Angular, decorators are fundamental to describing application building blocks.

Examples include:

| Decorator     | Purpose in Angular                                                   |
| ------------- | -------------------------------------------------------------------- |
| `@Component`  | Defines a component and its metadata                                 |
| `@Injectable` | Marks a class for Angular dependency-injection use                   |
| `@Directive`  | Defines a directive                                                  |
| `@Pipe`       | Defines a pipe                                                       |
| `@Input`      | Declares a component input in the traditional decorator-based model  |
| `@Output`     | Declares a component output in the traditional decorator-based model |

A decorator does not automatically create business logic. Angular interprets framework decorators as part of its compilation and runtime mechanisms.

### 4.2 Understanding `@Component`

Consider the following Angular component:

```
import { Component } from '@angular/core';

@Component({
    selector: 'app-employee',
    standalone: true,
    template: `
        <h2>Employee Details</h2>
        <p>Employee: {{ employeeName }}</p>
    `
})
export class EmployeeComponent {

    employeeName = 'Arun';
}
```

Examine the following structure:

```
@Component({
    selector: 'app-employee',
    standalone: true,
    template: `<h2>{{ employeeName }}</h2>`
})
```

`@Component` receives a metadata object. Its properties tell Angular how the class should be used.

- `selector` defines the element name that represents the component.
- `standalone` declares that the component is standalone.
- `template` defines its view.
- `EmployeeComponent` supplies the component's application logic.

The decorator connects the TypeScript class to Angular's component model.

### 4.3 How do custom decorators work?

To understand decorators beyond their use in Angular, consider a method decorator that logs when a method is called.

The following example uses the traditional TypeScript decorator model, which is relevant when learning Angular's established decorator syntax.

```
function LogExecution(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
): void {

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
        console.log(`Calling method: ${propertyKey}`);
        return originalMethod.apply(this, args);
    };
}

class EmployeeService {

    @LogExecution
    getEmployee(id: number): string {
        return `Employee ${id}`;
    }
}

const service = new EmployeeService();

console.log(service.getEmployee(101));
```

When `getEmployee()` is invoked, the decorator's wrapper logs the method name and calls the original method.

The example demonstrates the central idea: a decorator can inspect or modify a declaration's behaviour according to the decorator model.

To compile a standalone example using this legacy-style decorator, use compatible TypeScript configuration:

```
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "strict": true,
        "experimentalDecorators": true
    }
}
```

### 4.4 Decorator factories

A decorator factory is a function that accepts configuration and returns a decorator.

For example, a logging decorator could be configured with a message:

```
function Log(message: string) {
    return function (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): void {

        const originalMethod = descriptor.value;

        descriptor.value = function (...args: unknown[]) {
            console.log(message);
            return originalMethod.apply(this, args);
        };
    };
}

class EmployeeService {

    @Log("Retrieving employee details")
    getEmployee(id: number): string {
        return `Employee ${id}`;
    }
}
```

When `getEmployee()` is called, the configured message is logged first.

The difference is:

- A decorator is the function applied to a declaration.
- A decorator factory is a function that creates or configures that decorator.

### 4.5 Important distinction: TypeScript decorators and Angular decorators

TypeScript 5.0 introduced support for the newer ECMAScript standard decorator model, while TypeScript also supports its earlier experimental decorator model. Their signatures and capabilities differ, and they are not interchangeable. Angular's established decorators must be understood in the context of Angular's supported compiler and framework conventions.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.typescriptlang.org\&sz=32)

Decorators



For an Angular training session, focus first on understanding `@Component`, `@Injectable`, `@Input`, and `@Output`, as specified by the framework version being taught. Use custom decorator implementations as a separate exercise.

## 5. Modules

### 5.1 What is a module?

A module is a file that encapsulates code and makes selected functionality available to other files through exports.

Modules help developers separate application responsibilities, control dependencies, and organize a large codebase into maintainable units.

TypeScript uses JavaScript's import/export module system. Its module documentation also covers how compiler settings interact with the runtime or bundler used to execute an application.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.typescriptlang.org\&sz=32)

Introduction



### 5.2 Exporting functionality

Suppose an application contains an employee utility.

File: `employee-utils.ts`

```
export interface Employee {
    id: number;
    name: string;
}

export function getEmployeeName(employee: Employee): string {
    return employee.name;
}

export const COMPANY_NAME = "ABC Technologies";
```

The `export` keyword makes the selected declarations available to other modules.

### 5.3 Importing functionality

File: `app.ts`

```
import {
    Employee,
    getEmployeeName,
    COMPANY_NAME
} from './employee-utils';

const employee: Employee = {
    id: 101,
    name: "Arun"
};

console.log(getEmployeeName(employee));
console.log(COMPANY_NAME);
```

The import statement brings the exported declarations into the current module.

This is a named import, which uses the same names as the original exports.

### 5.4 Default exports

A module can also define a default export.

File: `employee-service.ts`

```
export default class EmployeeService {

    getEmployees(): string[] {
        return ["Arun", "Priya", "Kumar"];
    }
}
```

File: `app.ts`

```
import EmployeeService from './employee-service';

const service = new EmployeeService();

console.log(service.getEmployees());
```

A default import can use a local name chosen by the importing module. Named imports, on the other hand, normally refer to named exports.

For application libraries and shared utilities, named exports are often convenient because they make imported dependencies explicit.

### 5.5 Type-only imports

An interface or other type that is used only for checking does not need to become a runtime dependency.

```
import type { Employee } from './employee-utils';

function displayEmployee(employee: Employee): void {
    console.log(employee.name);
}
```

`import type` clearly marks the import as type-only. It can help distinguish compile-time dependencies from runtime dependencies in larger projects.

### 5.6 Re-exporting modules

A feature can expose several related declarations through a single entry point.

For example:

File: `employee/index.ts`

```
export { EmployeeService } from './employee.service';
export type { Employee } from './employee.model';
```

Another file can then import from that entry point:

```
import { EmployeeService } from './employee';
import type { Employee } from './employee';
```

This pattern can simplify imports in a large application, although excessive barrel files can also make dependencies harder to trace.

### 5.7 Modules in Angular applications

Consider this simplified feature-oriented structure:

```
src/
└── app/
    └── employee/
        ├── employee.model.ts
        ├── employee.service.ts
        ├── employee-list.component.ts
        └── index.ts
```

The responsibilities might be:

- `employee.model.ts`: employee interfaces and related types.
- `employee.service.ts`: API communication and employee-related operations.
- `employee-list.component.ts`: UI logic and presentation.
- `index.ts`: selected exports for convenient reuse.

Angular projects can organize these files around standalone components and feature areas. TypeScript modules and Angular NgModules are different concepts. A TypeScript module is based on file-level imports and exports; an Angular `NgModule` is a framework construct that groups Angular declarations and related configuration. A standalone Angular application does not need to use `NgModule` for every feature.

## 6. Enums

### 6.1 What is an enum?

An enum defines a named set of related constants. Enums are useful when application logic depends on a limited set of meaningful choices.

For example, an order can be pending, shipped, or delivered. Instead of repeating raw numeric values throughout the code, the application can use descriptive names.

### 6.2 Numeric enums

```
enum OrderStatus {
    Pending,
    Shipped,
    Delivered
}

const status: OrderStatus = OrderStatus.Shipped;

console.log(status); // 1
```

When no values are explicitly supplied, numeric enum members start at `0` and increment by `1`.

The generated runtime representation depends on compilation settings, but ordinary numeric enums have runtime values.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.typescriptlang.org\&sz=32)

Enums



You can also assign explicit values:

```
enum HttpResult {
    Success = 200,
    BadRequest = 400,
    Unauthorized = 401,
    ServerError = 500
}

console.log(HttpResult.Success); // 200
```

Explicit values can be useful when the values must correspond to an external protocol or established numeric codes.

### 6.3 String enums

String enums associate each member with a descriptive string value.

```
enum OrderStatus {
    Pending = "PENDING",
    Shipped = "SHIPPED",
    Delivered = "DELIVERED",
    Cancelled = "CANCELLED"
}

function updateOrderStatus(status: OrderStatus): void {
    console.log(`Order status: ${status}`);
}

updateOrderStatus(OrderStatus.Shipped);
```

String enums are often easier to understand in logs and when mapping to string-based API values.

One design consideration: strings received from a server are not automatically validated as enum members merely because the variable has been annotated with an enum type.

### 6.4 Enums in business applications

Consider a payment processing application:

```
enum PaymentStatus {
    Initiated = "INITIATED",
    Processing = "PROCESSING",
    Completed = "COMPLETED",
    Failed = "FAILED"
}

interface Payment {
    transactionId: string;
    amount: number;
    status: PaymentStatus;
}

const payment: Payment = {
    transactionId: "TXN-1001",
    amount: 5000,
    status: PaymentStatus.Completed
};
```

The enum provides a shared vocabulary for the different payment states.

In real systems, status transitions must also be checked by business rules. A declared enum does not determine whether a particular transition, such as `FAILED` to `COMPLETED`, is valid.

### 6.5 Alternatives to enums

In modern TypeScript, a string literal union is often a useful alternative when you need a restricted set of values without creating an enum object at runtime.

```
type PaymentStatus =
    | "INITIATED"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";

function processStatus(status: PaymentStatus): void {
    console.log(status);
}

processStatus("COMPLETED");
```

Another alternative is a constant object:

```
const PaymentStatus = {
    Initiated: "INITIATED",
    Processing: "PROCESSING",
    Completed: "COMPLETED",
    Failed: "FAILED"
} as const;

type PaymentStatus =
    typeof PaymentStatus[keyof typeof PaymentStatus];

const status: PaymentStatus = PaymentStatus.Completed;
```

This combines a runtime object of named values with a type derived from those values.

| Approach             | Useful when                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| Numeric enum         | Named numeric constants or existing APIs require numeric values          |
| String enum          | A named enum object and explicit string values are useful                |
| String literal union | You need a restricted set of string values with minimal runtime overhead |
| `as const` object    | You want named runtime constants and a type derived from their values    |

Neither enums nor union types replace runtime validation for untrusted input.

## 7. Bringing the six concepts together

The following example combines interfaces, classes, decorators, modules, and enums in an Angular-style employee feature.

File: `employee.model.ts`

```
export enum EmployeeStatus {
    Active = "ACTIVE",
    Inactive = "INACTIVE"
}

export interface Employee {
    id: number;
    name: string;
    status: EmployeeStatus;
}
```

File: `employee.service.ts`

```
import { Injectable } from '@angular/core';
import { Employee, EmployeeStatus } from './employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private employees: Employee[] = [
        {
            id: 101,
            name: "Arun",
            status: EmployeeStatus.Active
        },
        {
            id: 102,
            name: "Priya",
            status: EmployeeStatus.Inactive
        }
    ];

    getActiveEmployees(): Employee[] {
        return this.employees.filter(
            employee => employee.status === EmployeeStatus.Active
        );
    }
}
```

File: `employee-list.component.ts`

```
import { Component, inject } from '@angular/core';
import { EmployeeService } from './employee.service';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    template: `
        <h2>Active Employees</h2>

        @for (employee of employeeService.getActiveEmployees();
              track employee.id) {
            <p>{{ employee.id }} - {{ employee.name }}</p>
        }
    `
})
export class EmployeeListComponent {
    protected employeeService = inject(EmployeeService);
}
```

This example illustrates how the concepts work together:

- Types: The employee properties and method results have defined types.
- Interfaces: `Employee` specifies the employee data contract.
- Classes: The service and component encapsulate application responsibilities.
- Decorators: `@Injectable` and `@Component` provide Angular metadata.
- Modules: `export` and `import` connect files.
- Enums: `EmployeeStatus` represents the valid declared employee states.

For a production application, employee data would normally be retrieved through an HTTP API, and the component would use an appropriate state or presentation strategy.

 
## 8. Hands-on exercise for experienced developers

Problem statement: Develop a small TypeScript employee management feature.

Participants should create the following files:

```
employee-app/
├── employee.model.ts
├── employee.service.ts
├── employee.component.ts
└── app.ts
```

Requirements:

1. Define an `Employee` interface with `id`, `name`, `department`, and `salary`.
2. Define an `EmployeeStatus` enum with `ACTIVE` and `INACTIVE`.
3. Implement a service class that retrieves employees and filters active employees.
4. Use appropriate TypeScript types for method parameters and return values.
5. Export the interface, enum, and service from their respective modules.
6. In an Angular version of the exercise, create a component decorated with `@Component` that displays the active employees.
7. Enable strict type checking and correct the compilation errors without using `any` to bypass them.

Expected learning outcome: Participants should be able to explain not only the syntax but also the design choices—why a particular value is an interface, a class, an enum, or a type alias—and how those choices support maintainable Angular applications.

For reference, the official [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html?utm_source=chatgpt.com) provides further details on the language's types, classes, modules, and enums.