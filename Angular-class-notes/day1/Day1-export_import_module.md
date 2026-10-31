In TypeScript, named exports and default exports are used to make classes, functions, variables, interfaces, and other declarations available to other files.

The main difference is:

- Named export: A module can export multiple items, and you import them using their exported names inside curly braces `{}`.
- Default export: A module can have only one default export, and you import it without curly braces. You can choose the name used for the import.

## 1. Named export

Use the `export` keyword before each declaration you want to share.

File: `employee.ts`

```
export class Employee {
    constructor(
        public id: number,
        public name: string
    ) {}

    displayDetails(): void {
        console.log(`${this.id} - ${this.name}`);
    }
}

export function greetEmployee(): void {
    console.log("Welcome, employee!");
}
```

Here, both `Employee` and `greetEmployee` are named exports.

File: `app.ts`

```
import { Employee, greetEmployee } from "./employee";

const emp = new Employee(101, "Arun");

emp.displayDetails();
greetEmployee();
```

Output:

```
101 - Arun
Welcome, employee!
```

Notice that the imported names must match the exported names unless you use an alias.

### Importing with an alias

```
import { Employee as Staff } from "./employee";

const emp = new Staff(101, "Arun");
emp.displayDetails();
```

Here, `Employee` is the exported name, while `Staff` is the name used inside `app.ts`.

## 2. Default export

A module can have only one default export. It is useful when a file has one primary item to expose.

File: `employee.ts`

```
export default class Employee {
    constructor(
        public id: number,
        public name: string
    ) {}

    displayDetails(): void {
        console.log(`${this.id} - ${this.name}`);
    }
}
```

File: `app.ts`

```
import Employee from "./employee";

const emp = new Employee(101, "Arun");

emp.displayDetails();
```

You do not need curly braces around `Employee`.

You can also choose a different import name:

```
import Staff from "./employee";

const emp = new Staff(101, "Arun");
emp.displayDetails();
```

This works because the name `Staff` is assigned locally to the default export. The class itself is still named `Employee`.

## 3. Comparison table

| Feature           | Named export                            | Default export                      |
| ----------------- | --------------------------------------- | ----------------------------------- |
| Number per file   | Multiple                                | Maximum one                         |
| Export syntax     | `export class Employee {}`              | `export default class Employee {}`  |
| Import syntax     | `import { Employee } from "./employee"` | `import Employee from "./employee"` |
| Curly braces `{}` | Required for ordinary named imports     | Not required                        |
| Import name       | Must match, unless aliased              | Can be chosen by the importer       |
| Best suited for   | Files with multiple related exports     | Files with one primary export       |

These are standard TypeScript/ES module conventions.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.typescriptlang.org\&sz=32)

Modules

+1



## 4. Can we use both in the same file?

Yes. A file can contain multiple named exports and one default export.

File: `employee.ts`

```
export interface EmployeeDetails {
    id: number;
    name: string;
}

export function greet(): void {
    console.log("Hello!");
}

export default class Employee {
    constructor(public id: number, public name: string) {}
}
```

File: `app.ts`

```
import Employee, { EmployeeDetails, greet } from "./employee";

const emp: EmployeeDetails = new Employee(101, "Arun");

console.log(emp);
greet();
```

Here:

- `Employee` is imported as the default export.
- `EmployeeDetails` and `greet` are named exports.

## 5. Which should you use in Angular projects?

- Use named exports when a file exposes multiple related items, such as utility functions, interfaces, or services.
- Use a default export when a file has one primary item and your project conventions favor it.
- In Angular applications, named exports are commonly used for components, services, interfaces, and classes.

Remember this simple rule: Named exports are imported by name; default exports can be imported using a name of your choice.