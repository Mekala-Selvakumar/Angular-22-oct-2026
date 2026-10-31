# `var`, `let`, and `const` in TypeScript

In TypeScript, `var`, `let`, and `const` are keywords used to declare variables. The main differences are in scope, redeclaration, reassignment, and hoisting.

For experienced Java developers, `let` and `const` are generally the most useful declarations to learn first because their behavior is more predictable.

## 1. Basic introduction

```
var name1: string = "Arun";
let name2: string = "Priya";
const name3: string = "Kumar";
```

All three declare variables, but they behave differently.

| Feature                           | `var`                           | `let`                                    | `const`                                  |
| --------------------------------- | ------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Scope                             | Function-scoped                 | Block-scoped                             | Block-scoped                             |
| Reassignment                      | Allowed                         | Allowed                                  | Not allowed                              |
| Redeclaration in the same scope   | Allowed                         | Not allowed                              | Not allowed                              |
| Must initialize at declaration?   | No                              | No                                       | Yes                                      |
| Hoisted                           | Yes, initialized to `undefined` | Yes, but inaccessible before declaration | Yes, but inaccessible before declaration |
| Recommended for modern TypeScript | Generally avoid                 | Yes                                      | Yes, when reassignment is unnecessary    |

Let's explore each keyword with examples.

## 2. `var` — Function-scoped variable

The `var` keyword is the older way of declaring variables in JavaScript and TypeScript.

### Example 1: Declaration and reassignment

```
var age: number = 25;

console.log(age); // 25

age = 30;

console.log(age); // 30
```

The value can be reassigned.

### Example 2: Redeclaration is allowed

```
var city: string = "Chennai";

var city: string = "Bengaluru";

console.log(city); // Bengaluru
```

Both declarations are allowed in the same scope. This can accidentally overwrite a variable.

### Example 3: `var` ignores block scope

```
if (true) {
    var message: string = "Hello";
}

console.log(message); // Hello
```

Even though `message` is declared inside the `if` block, it is accessible outside that block because `var` is not block-scoped.

This behavior can cause unexpected bugs.

### Example 4: Function scope

```
function display(): void {
    var message: string = "Hello TypeScript";
    console.log(message);
}

display();

// console.log(message); // Error: message is not defined
```

A `var` variable declared inside a function is available within that function, but not outside it.

Remember: `var` is function-scoped, not block-scoped.

## 3. `let` — Block-scoped variable

The `let` keyword was introduced in ECMAScript 2015 (ES6) to provide safer variable declarations.

### Example 1: Declaration and reassignment

```
let marks: number = 75;

console.log(marks); // 75

marks = 90;

console.log(marks); // 90
```

Reassignment is allowed.

### Example 2: Redeclaration is not allowed

```
let age: number = 25;

// let age: number = 30; // Compilation error

age = 30; // Allowed
```

You can update the existing variable, but you cannot declare another variable with the same name in the same scope.

### Example 3: Block scope

A block is a section of code enclosed in curly braces `{}`.

```
if (true) {
    let message: string = "Hello";
    console.log(message); // Hello
}

// console.log(message); // Compilation error
```

The variable exists only within the block where it is declared.

This makes `let` safer than `var`.

### Example 4: `let` in a loop

```
for (let i: number = 1; i <= 3; i++) {
    console.log(i);
}

// console.log(i); // Compilation error
```

The loop variable `i` is not accessible outside the loop.

## 4. `const` — Block-scoped constant binding

The `const` keyword declares a variable whose binding cannot be reassigned.

### Example 1: Declaration and reassignment

```
const pi: number = 3.14159;

console.log(pi); // 3.14159

// pi = 3.14; // Compilation error
```

A `const` declaration must be initialized immediately.

```
// const age: number; // Compilation error
```

### Example 2: Block scope

```
if (true) {
    const course: string = "TypeScript";
    console.log(course);
}

// console.log(course); // Compilation error
```

Like `let`, `const` is block-scoped.

### Example 3: Important — `const` does not make objects immutable

Consider this example:

```
const employee = {
    name: "Arun",
    salary: 50000
};

employee.salary = 60000; // Allowed

console.log(employee.salary); // 60000

// employee = { name: "Priya", salary: 70000 };
// Compilation error
```

Why?

- `const` prevents reassignment of the variable `employee`.
- It does not automatically prevent changes to the properties of the object it references.

The same principle applies to arrays.

```
const numbers: number[] = [10, 20, 30];

numbers.push(40); // Allowed

console.log(numbers); // [10, 20, 30, 40]

// numbers = [50, 60]; // Compilation error
```

If you need to prevent changes to an array or object, consider `readonly`, `Readonly<T>`, or `Object.freeze()` depending on your requirements.

## 5. Important difference: `var` versus `let` versus `const`

The following example is useful for classroom explanation.

### Example A — `var`

```
if (true) {
    var x = 10;
}

console.log(x); // 10
```

The variable is accessible outside the block.

### Example B — `let`

```
if (true) {
    let y = 20;
}

console.log(y); // Compilation error
```

The variable is restricted to the block.

### Example C — `const`

```
if (true) {
    const z = 30;
}

console.log(z); // Compilation error
```

The variable is also block-scoped, and its binding cannot be reassigned.

## 6. Hoisting and the Temporal Dead Zone

Hoisting refers to JavaScript's processing of declarations before executing the code in their scope.

### With `var`

```
console.log(a); // undefined

var a: number = 10;
```

The declaration is hoisted, and the variable is initialized to `undefined` before its assignment executes.

### With `let`

```
// console.log(b); // Runtime ReferenceError

let b: number = 20;
```

The declaration is hoisted, but the variable cannot be accessed before its declaration is evaluated. This period is called the Temporal Dead Zone (TDZ).

### With `const`

```
// console.log(c); // Runtime ReferenceError

const c: number = 30;
```

`const` also has a Temporal Dead Zone.

Note that these examples demonstrate JavaScript runtime behavior. TypeScript generally reports a compile-time error when a variable is accessed before its declaration.

## 7. Comparison with Java

| TypeScript                   | Java equivalent or comparison                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `let`                        | Similar to a local variable declared with a Java type                                                        |
| `const`                      | Similar in intent to Java's `final` for preventing reassignment                                              |
| `var`                        | Not equivalent to Java's `var`; TypeScript `var` is function-scoped                                          |
| Block scope                  | `let` and `const` follow block scope, similar to Java local variables                                        |
| Object mutation with `const` | Similar to a Java `final` reference: the reference cannot be reassigned, but the object can still be mutable |

One important distinction: Java's `var` is a local-variable type inference feature, whereas TypeScript's `var` is a variable declaration keyword with function-scoping behavior.

## 8. Best practices in TypeScript

Use the following guidelines when writing modern TypeScript:

- Prefer `const` by default when you do not need to reassign the variable.
- Use `let` when the variable's value must change, such as a loop counter or running total.
- Avoid `var` in modern TypeScript because its function scope and redeclaration behavior can lead to bugs.

Example:

```
const course: string = "TypeScript";
let score: number = 80;

score = 90;

console.log(course);
console.log(score);
```

This code uses `const` for a value that does not need reassignment and `let` for a value that changes.

## 9. Quick knowledge check

1\. Which keyword is block-scoped?

var only

let and const

All three

Correct! — let and const are block-scoped; var is function-scoped.

2\. Can you reassign a const variable?

Yes, always

No

Only inside a loop

Correct! — A const binding cannot be reassigned after initialization.

3\. What happens when a var declaration is accessed before its assignment?

It returns undefined

It always throws a ReferenceError

It returns null

Correct! — A var binding is initialized to undefined during hoisting.

4\. Can a property of a const object be changed?

No, never

Yes, unless separately restricted

Only during initialization

Correct! — const prevents rebinding the variable, not mutation of its object.

## Score: 4 / 4

Try again

Final rule to remember: `const` when possible, `let` when necessary, and avoid `var` in modern TypeScript.