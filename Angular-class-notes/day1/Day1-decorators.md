Introduction
With the introduction of Classes in TypeScript and ES6, there now exist certain scenarios that require additional features to support annotating or modifying classes and class members. Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members.

Decorators
A Decorator is a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter. Decorators use the form @expression, where expression must evaluate to a function that will be called at runtime with information about the decorated declaration.

Purpose
TypeScript Decorators serves the purpose of adding both annotations and metadata to the existing code in a declarative way.
There are five types of decorators we can use:

Class Decorators
Property Decorators
Method Decorators
Accessor Decorators
Parameter Decorators


Eg:

@classDecorator
class Bird {
  @propertyDecorator
  name: string

  @methodDecorator
  fly(
    @parameterDecorator
    meters: number,
  ) {}

  @accessorDecorator
  get egg() {}
}

Timing
Decorators execute only once, when a class definition is first evaluated at runtime. For example:

function f(key: string): any {
  console.log("evaluate: ", key)
  return function () {
    console.log("call: ", key)
  }
}

@f("Class Decorator")
class C {
  @f("Static Property")
  static prop?: number

  @f("Static Method")
  static method(@f("Static Method Parameter") foo) {}

  constructor(@f("Constructor Parameter") foo) {}

  @f("Instance Method")
  method(@f("Instance Method Parameter") foo) {}

  @f("Instance Property")
  prop?: number
}

The code above will print the following messages:

evaluate:  Instance Method
evaluate:  Instance Method Parameter
call:  Instance Method Parameter
call:  Instance Method
evaluate:  Instance Property
call:  Instance Property
evaluate:  Static Property
call:  Static Property
evaluate:  Static Method
evaluate:  Static Method Parameter
call:  Static Method Parameter
call:  Static Method
evaluate:  Class Decorator
evaluate:  Constructor Parameter
call:  Constructor Parameter
call:  Class Decorator



https://mirone.me/a-complete-guide-to-typescript-decorator/


------------

# Decorators in TypeScript

A decorator in TypeScript is a special function that adds metadata to, or modifies the behavior of, a class and certain class members.

Decorators are written using the `@` symbol followed by a decorator name.

Decorators are especially important in Angular because Angular uses decorators such as `@Component`, `@Injectable`, and `@Input`.

## 1. Why do we need decorators?

Suppose we have an ordinary TypeScript class:

```
class Employee {
    name: string = "Arun";
}

const emp = new Employee();
console.log(emp.name);
```

This class represents an employee. Now imagine we want to mark this class as a special component or attach additional metadata to it.

A decorator allows us to do this without putting all that extra logic directly inside the class.

For example:

```
@MyDecorator
class Employee {
    name: string = "Arun";
}
```

Here, `@MyDecorator` is a decorator applied to the `Employee` class.

However, `MyDecorator` is not built into TypeScript. We must define it ourselves.

## 2. Create a simple class decorator

Let's create our own decorator.

```
function Logger(target: Function) {
    console.log("Class created:", target.name);
}

@Logger
class Employee {
    constructor(public name: string) {}
}
```

When this code is evaluated, the output is:

```
Class created: Employee
```

### How does it work?

`@Logger`

Decorator is applied

`Logger(Employee)`

The class constructor is passed to the decorator

Output\
`Class created: Employee`

In this example, `target` refers to the class constructor function, and `target.name` returns `"Employee"`.

Important: This example uses TypeScript's legacy decorator syntax, which requires `"experimentalDecorators": true` in `tsconfig.json`. TypeScript also supports newer standard decorators with different function signatures.

## 3. Types of decorators

In the traditional TypeScript decorator model, you will commonly encounter these categories:

| Decorator           | Applied to                      | Purpose                                  |
| ------------------- | ------------------------------- | ---------------------------------------- |
| Class decorator     | Class                           | Adds metadata or modifies class behavior |
| Method decorator    | Method                          | Observes or modifies a method            |
| Property decorator  | Property                        | Adds metadata about a property           |
| Accessor decorator  | Getter or setter                | Customizes accessor behavior             |
| Parameter decorator | Constructor or method parameter | Adds metadata about a parameter          |

Parameter decorators belong to the legacy decorator model and are not supported by the newer standard decorator implementation.

## 4. Example: Method decorator

Suppose we want to log a message whenever a particular method is called.

```
function LogMethod(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
        console.log(`Calling ${propertyKey}`);
        return originalMethod.apply(this, args);
    };
}

class Employee {
    @LogMethod
    displayDetails(): void {
        console.log("Displaying employee details");
    }
}

const emp = new Employee();
emp.displayDetails();
```

Output:

```
Calling displayDetails
Displaying employee details
```

This legacy method decorator wraps the original method, adding logging before the original implementation runs.

To run this example, enable legacy decorators in `tsconfig.json`:

```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "experimentalDecorators": true
  }
}
```

## 5. Decorators in Angular

Angular uses decorators to tell its framework how classes and their members should be treated.

`@Component`

Defines a class as an Angular component and provides its selector, template and styles.

```
@Component({
  selector: 'app-employee',
  template: '<h1>Employee</h1>'
})
export class EmployeeComponent {}
```

`@Injectable`

Marks a class as available for Angular's dependency injection system.

```
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {}
```

`@Input`

Marks a component property as an input that can receive data from a parent component in the traditional Angular input syntax.

```
@Input() employeeName = '';
```

These are Angular-provided decorators, not decorators that you need to implement yourself. The examples use traditional Angular decorator syntax; the `@Input` example assumes the appropriate Angular import.

## 6. Decorators vs. annotations

You may hear people call decorators annotations, especially in Angular discussions. In TypeScript, a decorator is executable JavaScript/TypeScript logic applied using decorator syntax. Angular decorators provide metadata that Angular uses to configure its framework behavior.

For comparison with Java:

- Java uses annotations such as `@Override` and `@Service`.
- TypeScript uses decorators such as `@Component` and `@Injectable` in Angular.
- Their syntax looks similar, but their implementation and runtime behavior are different.

Remember: The `@` symbol is only the syntax. The actual decorator function or framework implementation determines what happens.