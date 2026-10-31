Here are the standard TypeScript naming conventions:

| Item | Convention | Example |
|---|---|---|
| Variables, functions, methods | `camelCase` | `userName`, `getUser()` |
| Classes, interfaces, types, enums | `PascalCase` | `UserService`, `Order`, `Status` |
| Enum members | `PascalCase` (or `UPPER_SNAKE_CASE`) | `Status.Active` |
| Constants (true, module-level) | `UPPER_SNAKE_CASE` | `MAX_RETRIES` |
| Generics | Single capital or `PascalCase` with `T` prefix | `T`, `TKey`, `TValue` |
| Private members | `camelCase` (optionally `#field` for true private) | `#cache`, `private count` |
| Files | `kebab-case.ts` (common), or match the class in `PascalCase` | `user-service.ts` |
| React components | `PascalCase` (file too) | `UserCard.tsx` |
| Boolean variables | Prefix `is`, `has`, `can`, `should` | `isActive`, `hasAccess` |

**Notes**

- **Interfaces:** Don't prefix with `I` (`User`, not `IUser`). That's a C#/Java habit; the TS style guides discourage it.
- **Type aliases:** Same as interfaces, `PascalCase` with no prefix or suffix.
- **Underscore prefix:** Avoid `_name` for private; use the `private` keyword or `#`. `_` is fine for unused params (`_event`).
- **Acronyms:** Treat as words: `HttpClient`, `userId`, `parseJson` (not `HTTPClient`).
- **Consistency wins:** Follow your project's ESLint config (`@typescript-eslint/naming-convention`) if one exists.

Since you work with Java developers: the main differences from Java are that constants are only `UPPER_SNAKE_CASE` when truly constant values, files are usually `kebab-case`, and there's no `I` prefix for interfaces.


TypeScript follows JavaScript's identifier rules for all of these (variables, functions, classes, interfaces, types, enums, properties).

**Allowed characters**

- **First character:** a letter (`a-z`, `A-Z`), underscore `_`, or dollar sign `$`
- **Remaining characters:** the above plus digits `0-9`
- **Unicode:** letters from other scripts are valid too (`const π = 3.14`, `let नाम = "x"`), though rarely used in practice

**Not allowed**

- Starting with a digit (`1user`)
- Hyphens, spaces, dots, `@`, `#` (except `#` for private class fields), or other symbols (`user-name`, `my var`)
- Reserved words (`class`, `function`, `enum`, `const`, `return`, etc.) as identifiers
- Case doesn't matter for validity, but identifiers are case-sensitive (`user` ≠ `User`)

**Examples**

```ts
let userName = "a";     // valid
let _temp = 1;          // valid
let $el = null;         // valid
let user1 = 1;          // valid
interface Order {}      // valid
class UserService {}    // valid

let 1user = 1;          // invalid: starts with digit
let user-name = 1;      // invalid: hyphen
let class = 1;          // invalid: reserved word
```

**Notes**

- `#` is valid only as a prefix for private class fields (`#cache`), not for regular variables.
- Property names accessed with quotes can contain anything (`obj["user-name"]`), but they aren't identifiers.
- Some words (`type`, `of`, `any`, `string`) are contextual keywords: technically allowed as names in places, but best avoided.

------------

# Naming Conventions in TypeScript

Naming conventions are guidelines for choosing meaningful and consistent names for variables, functions, classes, interfaces, enums, files, and other program elements.

TypeScript generally follows JavaScript naming conventions, with some additional conventions commonly used for types and Angular applications.

## 1. Common naming conventions

Examples using the Employee Management project

| Element                 | Convention                                                    | Example                     |
| ----------------------- | ------------------------------------------------------------- | --------------------------- |
| Variables               | `camelCase`                                                   | `employeeName`              |
| Constants               | `camelCase`                                                   | `maxEmployees`              |
| Functions / methods     | `camelCase`                                                   | `calculateSalary()`         |
| Classes                 | `PascalCase`                                                  | `EmployeeService`           |
| Interfaces              | `PascalCase`                                                  | `EmployeeDetails`           |
| Type aliases            | `PascalCase`                                                  | `EmployeeStatus`            |
| Enums                   | `PascalCase`                                                  | `Department`                |
| Enum members            | Usually `PascalCase` or project-consistent style              | `HumanResources`            |
| Generic type parameters | Usually a single uppercase letter or descriptive `PascalCase` | `T`, `TResponse`            |
| Private properties      | Usually `camelCase`                                           | `employeeCount`             |
| Boolean variables       | `camelCase`, often with a meaningful prefix                   | `isActive`, `hasPermission` |
| Source files            | Usually `kebab-case`                                          | `employee-service.ts`       |
| Folders                 | Usually `kebab-case`                                          | `employee-management/`      |

These are conventions, not rules enforced automatically by the TypeScript compiler.

## 2. Variable naming — `camelCase`

Use `camelCase` for variables, parameters, and local values. The first word begins with a lowercase letter, and subsequent words start with uppercase letters.

```
let employeeName = "Arun";
let employeeAge = 25;
let monthlySalary = 50000;

function calculateAnnualSalary(monthlySalary: number): number {
    return monthlySalary * 12;
}
```

Good names:

- `employeeName`
- `totalAmount`
- `monthlySalary`

Avoid unclear names such as:

```
let x = "Arun";
let a = 50000;
let empdata = {};
```

Prefer meaningful names that explain the purpose of the variable.

## 3. Class naming — `PascalCase`

Use `PascalCase` for class names. Every word starts with an uppercase letter.

```
class Employee {
}

class EmployeeService {
}

class PaymentProcessor {
}
```

In an Angular application, common examples include:

- `EmployeeComponent`
- `EmployeeService`
- `EmployeeDetailsComponent`

Java comparison: This convention is the same as the usual Java class naming convention.

## 4. Interface and type alias naming — `PascalCase`

Use `PascalCase` for interfaces and type aliases.

```
interface Employee {
    id: number;
    name: string;
}

type EmployeeStatus = "Active" | "Inactive";

type EmployeeId = number;
```

A common question is whether interface names must start with `I`, as in `IEmployee`.

```
interface IEmployee {
    id: number;
    name: string;
}
```

Although this style is valid, TypeScript projects commonly use `Employee` rather than `IEmployee`. The `I` prefix is optional; follow the conventions of the existing project.

## 5. Constants — use meaningful names

For ordinary constants, use `camelCase`.

```
const maxEmployees = 100;
const taxRate = 0.18;
const companyName = "ABC Technologies";
```

For true, globally meaningful fixed values, some projects use `UPPER_SNAKE_CASE`.

```
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://example.com/api";
```

Both styles are valid. Use the convention established by your team. Do not assume every `const` variable needs uppercase letters.

Also, `const` prevents reassignment of the variable binding; it does not make an object or array immutable.

## 6. Function and method naming — `camelCase`

Function names should usually describe an action, often starting with a verb.

```
function getEmployeeById(id: number) {
    // Find employee
}

function calculateSalary() {
    // Calculate salary
}

function updateEmployee() {
    // Update employee
}

function deleteEmployee() {
    // Delete employee
}
```

Avoid vague names such as `doTask()`, `processData()` or `handle()` when a more precise name is possible.

For event handlers in Angular, names such as `handleSubmit()` and `onEmployeeSelected()` are common.

## 7. Boolean naming conventions

Boolean variables should clearly express a condition. Common prefixes include `is`, `has`, `can`, and `should`.

```
const isActive = true;
const hasPermission = false;
const canEdit = true;
const shouldValidate = true;
```

This makes conditions easier to read:

```
if (isActive && hasPermission) {
    console.log("Access granted");
}
```

## 8. Enum naming

Use `PascalCase` for enum names. Enum members can use `PascalCase`, uppercase names, or another consistent project style.

```
enum Department {
    It = "IT",
    HumanResources = "HR",
    Finance = "FINANCE"
}
```

Usage:

```
const employeeDepartment = Department.It;
```

For string enums, the value (`"IT"`) and member name (`It`) can follow different conventions.

## 9. File and folder naming

For TypeScript source files, `kebab-case` is common, especially in Angular projects.

`employee.ts`

`employee-service.ts`

`employee-details.component.ts`

`employee-details.component.spec.ts`

Test file

In Angular, filenames often identify the artifact and its role: `employee-list.component.ts`, `employee.service.ts`, or `employee.model.ts`. Exact suffixes can vary by Angular version and project conventions.

## 10. Naming conventions for generics

Generic type parameters are commonly named `T`, `K`, `V`, or with descriptive PascalCase names.

```
function getFirstItem<T>(items: T[]): T | undefined {
    return items[0];
}
```

For more complex generics, descriptive names can improve readability:

```
interface ApiResponse<TData> {
    data: TData;
    success: boolean;
}
```

Here, `TData` represents the type of data returned by the API.

## 11. Quick reference: Good vs. bad naming

| Purpose           | Prefer                | Avoid                |
| ----------------- | --------------------- | -------------------- |
| Employee variable | `employeeName`        | `EmployeeName`       |
| Employee class    | `EmployeeService`     | `employeeService`    |
| Function          | `calculateTotal()`    | `CalculateTotal()`   |
| Interface         | `EmployeeDetails`     | `Iemployee`          |
| Boolean           | `isAvailable`         | `availableFlag1`     |
| File              | `employee-service.ts` | `EmployeeService.ts` |
| Collection        | `employees`           | `empArr`             |

The “avoid” examples are not necessarily invalid TypeScript. They are less consistent or less descriptive under the conventions discussed.

## 12. Practice exercise

Choose the best name for each requirement.

1\. A class representing a payment processor

paymentProcessor

PaymentProcessor

payment-processor

2\. A variable storing an employee's name

EmployeeName

employeeName

employee_name

3\. A function calculating tax

CalculateTax()

calculateTax()

calculate_tax()

4\. A TypeScript source filename for an employee service

EmployeeService.ts

employee-service.ts

employee_service.ts

Check answers

Trainer takeaway: Teach learners to use `camelCase` for variables and functions, `PascalCase` for classes and types, and consistent, descriptive filenames. In real projects, consistency with the existing codebase is more important than enforcing optional stylistic preferences.