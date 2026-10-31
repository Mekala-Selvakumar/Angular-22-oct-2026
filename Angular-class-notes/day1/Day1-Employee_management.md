Let's build an Employee Management System using TypeScript step by step. This project is suitable for your TypeScript Fundamentals module and can later serve as a foundation for Angular training.

We'll start with a simple console-based application, without Angular or a database.

# Employee Management System — TypeScript Project

## 1. Project features

By the end, you will be able to:

- Add an employee.
- Display all employees.
- Search for an employee by ID.
- Update employee details.
- Delete an employee.
- Calculate the average salary.
- Organize code using interfaces, classes, enums, and modules.

## 2. Create the project

Open the VS Code terminal and execute:

```
mkdir employee-management
cd employee-management

npm init -y
npm install --save-dev typescript
npx tsc --init
```

Create the following folder structure:

employee-management/

src/

`employee.ts`

Interface and class

`department.ts`

Enum

`employeeService.ts`

Business logic

`app.ts`

Main program

`tsconfig.json`

`package.json`

## 3. Step 1 — Create an enum

Create `src/department.ts`.

```
export enum Department {
    IT = "IT",
    HR = "HR",
    FINANCE = "FINANCE",
    SALES = "SALES"
}
```

Concept: Enums

An enum represents a fixed set of named values. Here, an employee can belong to one of four departments.

For example:

```
let department: Department = Department.IT;

console.log(department); // IT
```

Unlike an unrestricted string, `Department` prevents assigning arbitrary department values during type checking.

## 4. Step 2 — Create an interface and class

Create `src/employee.ts`.

```
import { Department } from "./department";

export interface EmployeeDetails {
    id: number;
    name: string;
    salary: number;
    department: Department;
}

export class Employee implements EmployeeDetails {

    constructor(
        public id: number,
        public name: string,
        public salary: number,
        public department: Department
    ) {}

    displayDetails(): void {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Salary: ${this.salary}`);
        console.log(`Department: ${this.department}`);
    }
}
```

Concepts covered:

- `interface` defines the required structure of an employee.
- `class` provides a concrete implementation.
- `implements` checks that the class satisfies the interface.
- `constructor` initializes employee properties.
- `public` parameter properties declare and initialize class fields.
- `void` indicates that `displayDetails()` does not return a value.

This is similar to using an interface and class in Java, although TypeScript interfaces are removed during compilation.

## 5. Step 3 — Create the employee service

Create `src/employeeService.ts`.

```
import { Employee } from "./employee";
import { EmployeeDetails } from "./employee";

export class EmployeeService {

    private employees: Employee[] = [];

    addEmployee(employee: Employee): void {
        this.employees.push(employee);
    }

    getAllEmployees(): Employee[] {
        return this.employees;
    }

    getEmployeeById(id: number): Employee | undefined {
        return this.employees.find(
            employee => employee.id === id
        );
    }

    updateSalary(id: number, salary: number): boolean {
        const employee = this.getEmployeeById(id);

        if (employee) {
            employee.salary = salary;
            return true;
        }

        return false;
    }

    deleteEmployee(id: number): boolean {
        const index = this.employees.findIndex(
            employee => employee.id === id
        );

        if (index === -1) {
            return false;
        }

        this.employees.splice(index, 1);
        return true;
    }

    getAverageSalary(): number {
        if (this.employees.length === 0) {
            return 0;
        }

        const total = this.employees.reduce(
            (sum, employee) => sum + employee.salary,
            0
        );

        return total / this.employees.length;
    }
}
```

Concepts covered:

| TypeScript feature       | Purpose                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `private`                | Restricts direct access to the employee array from outside the class |
| `Employee[]`             | Represents an array of employees                                     |
| `Employee \\| undefined` | Indicates that a search might not find an employee                   |
| `find()`                 | Finds the first matching employee                                    |
| `findIndex()`            | Finds the index of an employee                                       |
| `reduce()`               | Calculates the total salary                                          |
| `boolean`                | Returns success or failure                                           |

Note: The `EmployeeDetails` import is not needed in this service and can be omitted.

## 6. Step 4 — Create the main program

Create `src/app.ts`.

```
import { Employee } from "./employee";
import { Department } from "./department";
import { EmployeeService } from "./employeeService";

const service = new EmployeeService();

const employee1 = new Employee(
    101, "Arun", 50000, Department.IT
);

const employee2 = new Employee(
    102, "Priya", 60000, Department.HR
);

const employee3 = new Employee(
    103, "Kumar", 55000, Department.FINANCE
);

// Add employees
service.addEmployee(employee1);
service.addEmployee(employee2);
service.addEmployee(employee3);

// Display employees
console.log("All Employees:");

service.getAllEmployees().forEach(employee => {
    employee.displayDetails();
    console.log("----------------");
});

// Search employee
console.log("Search employee with ID 102:");

const result = service.getEmployeeById(102);
console.log(result);

// Update salary
service.updateSalary(101, 65000);

// Display average salary
console.log(
    "Average Salary:",
    service.getAverageSalary()
);

// Delete employee
service.deleteEmployee(103);

console.log("Employees after deletion:");
console.log(service.getAllEmployees());
```

## 7. Step 5 — Compile and execute

Because the files use standard ES module imports, use a compatible TypeScript configuration. For this introductory project, the simplest option is to set the following values in `tsconfig.json`:

```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

Then run:

```
npx tsc
node dist/app.js
```

Expected average salary before deleting the third employee is `55000`. After updating Arun's salary to `65000`, the average is `60000`.

## 8. Learning roadmap

Part 1 — Fundamentals

Variables, types, functions, arrays, operators and conditions.

Part 2 — Interfaces and classes

Access modifiers, constructors, inheritance, abstract classes and interfaces.

Part 3 — Advanced TypeScript

Generics, union types, type narrowing, modules and decorators.

Part 4 — Angular preparation

Use TypeScript classes, interfaces, modules and decorators in an Angular application.

 