# TypeScript Fundamentals: Operators, Type Casting, Conditional Statements and Loops

TypeScript is a statically typed superset of JavaScript. It supports familiar programming concepts such as operators, type conversion, decision-making statements, and loops, while adding compile-time type checking.

For experienced Java developers, most of these concepts will be familiar. The important differences are JavaScript's runtime type conversion and TypeScript's compile-time type system.

# 1. Operators in TypeScript

An operator is a symbol that performs an operation on one or more values.

```
let a: number = 10;
let b: number = 3;

console.log(a + b); // 13
```

Here, `+` is an arithmetic operator.

## 1.1 Types of operators

\| Category | Operators | Purpose |\
\|---|---|---|\
\| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**` | Mathematical calculations |\
\| Assignment | `=`, `+=`, `-=`, `*=`, `/=` | Assign or update values |\
\| Comparison | `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=` | Compare values |\
\| Logical | `&&`, `||`, `!` | Combine or reverse conditions |\
\| Increment/decrement | `++`, `--` | Increase or decrease by one |\
\| Conditional | `? :` | Choose between two expressions |\
\| Nullish coalescing | `??` | Provide a fallback for null or undefined |\
\| Optional chaining | `?.` | Safely access properties |\
\| Type-related | `typeof`, `instanceof`, `as` | Inspect or describe types |\
\| Bitwise | `&`, `|`, `^`, `~`, `<<`, `>>` | Perform bit-level operations |

## 1.2 Arithmetic operators

```
let a: number = 10;
let b: number = 3;

console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.333...
console.log(a % b);  // 1
console.log(a ** b); // 1000
```

The `%` operator returns the remainder, while `**` calculates a power.

Unlike Java, TypeScript uses `**` for exponentiation. Java typically uses `Math.pow()`.

One important JavaScript behavior is that `+` can perform string concatenation as well as numeric addition.

```
console.log(10 + 20);    // 30
console.log("10" + 20);  // "1020"
console.log("10" - 5);   // 5
```

JavaScript converts operands differently depending on the operator. TypeScript does not eliminate these runtime behaviors.

## 1.3 Assignment operators

```
let total: number = 100;

total += 20;
console.log(total); // 120

total -= 10;
console.log(total); // 110

total *= 2;
console.log(total); // 220

total /= 2;
console.log(total); // 110
```

For example, `total += 20` is shorthand for `total = total + 20`.

## 1.4 Comparison operators

Comparison operators return a Boolean value.

```
let age: number = 25;

console.log(age > 18);   // true
console.log(age < 18);   // false
console.log(age >= 25);  // true
console.log(age === 25); // true
console.log(age !== 30); // true
```

### Difference between `==` and `===`

```
console.log(5 == "5");  // true
console.log(5 === "5"); // false
```

- `==` permits type coercion before comparison.
- `===` compares without that coercion.

Best practice: Prefer `===` and `!==` to avoid unexpected comparisons.

## 1.5 Logical operators

```
let age: number = 25;
let hasId: boolean = true;

console.log(age >= 18 && hasId); // true
console.log(age < 18 || hasId);  // true
console.log(!hasId);             // false
```

\| Operator | Meaning | Example |\
\|---|---|---|\
\| `&&` | AND: both conditions must be true | `age >= 18 && hasId` |\
\| `||` | OR: at least one condition must be true | `age < 18 || hasId` |\
\| `!` | NOT: reverses the truth value | `!hasId` |

Logical operators use short-circuit evaluation: the second operand may not be evaluated if the first operand determines the result.

## 1.6 Ternary operator

The ternary operator is a concise alternative to a simple `if...else`.

```
let marks: number = 75;

let result: string = marks >= 40 ? "Pass" : "Fail";

console.log(result); // Pass
```

Syntax:

```
condition ? valueIfTrue : valueIfFalse;
```

## 1.7 Nullish coalescing and optional chaining

The `??` operator provides a fallback only when a value is `null` or `undefined`.

```
let score: number | undefined = 0;

console.log(score ?? 100); // 0
```

The optional chaining operator `?.` safely accesses a property that may not exist.

```
type Learner = {
    name: string;
    address?: {
        city: string;
    };
};

const learner: Learner = { name: "Arun" };

console.log(learner.address?.city); // undefined
```

These operators are particularly useful when working with API responses and optional object properties.

In TypeScript, Nullish Coalescing (`??`) and Optional Chaining (`?.`) are two useful operators for handling values that may be `null` or `undefined`.

They are especially useful when working with API responses, objects, and optional properties in Angular applications.

## 1. Nullish Coalescing Operator (`??`)

The nullish coalescing operator provides a default value when the left-hand value is either `null` or `undefined`.

### Syntax

```
value ?? defaultValue
```

If `value` is `null` or `undefined`, TypeScript evaluates the expression to `defaultValue`. Otherwise, it uses `value`.

### Example 1: Basic usage

```
let username: string | null = null;

let displayName = username ?? "Guest";

console.log(displayName); // Guest
```

Explanation:

- `username` contains `null`.
- The `??` operator checks whether the value is `null` or `undefined`.
- Because it is `null`, `"Guest"` is used as the default value.

Now consider this example:

```
let username: string | null = "Arun";

let displayName = username ?? "Guest";

console.log(displayName); // Arun
```

Since `username` contains `"Arun"`, the default value is not used.

### Example 2: Difference between `??` and `||`

This is the most important point to understand.

```
let score: number = 0;

console.log(score || 100); // 100
console.log(score ?? 100); // 0
```

Why?

- `||` uses the default when the left side is falsy, such as `0`, `false`, or `""`.
- `??` uses the default only when the left side is `null` or `undefined`.

\| Value | `value || 100` | `value ?? 100` |\
\|---|---:|---:|\
\| `0` | `100` | `0` |\
\| `false` | `100` | `false` |\
\| `""` | `100` | `""` |\
\| `null` | `100` | `100` |\
\| `undefined` | `100` | `100` |\
\| `50` | `50` | `50` |

### Example 3: Real-world use case

Suppose an Angular application receives a user's age from an API. If the age is missing, you want to use a default value of 18.

```
let age: number | null | undefined = null;

let finalAge: number = age ?? 18;

console.log(finalAge); // 18
```

If the age is `0`, it remains `0`. This is useful when zero is a meaningful value.

## 2. Optional Chaining Operator (`?.`)

The optional chaining operator allows you to access a property or method without throwing an error when the value immediately before `?.` is `null` or `undefined`.

### The problem without optional chaining

Consider a learner object:

```
let learner = {
    name: "Arun",
    address: {
        city: "Chennai"
    }
};

console.log(learner.address.city); // Chennai
```

This works because `address` exists.

Now suppose the address is missing:

```
let learner = {
    name: "Arun",
    address: undefined
};

// console.log(learner.address.city);
// Runtime error!
```

JavaScript throws a `TypeError` because it tries to access `city` on `undefined`.

### Solution using `?.`

```
let learner = {
    name: "Arun",
    address: undefined
};

console.log(learner.address?.city); // undefined
```

Explanation:

- TypeScript evaluates `learner.address`.
- If it is `null` or `undefined`, the expression stops and returns `undefined`.
- Otherwise, it accesses `city`.

Notice that optional chaining prevents this particular error; it does not automatically provide a default value.

### Example 2: Optional chaining with a default value

You can combine `?.` with `??`.

```
type Learner = {
    name: string;
    address?: {
        city: string;
    };
};

let learner: Learner = {
    name: "Arun"
};

let city = learner.address?.city ?? "Unknown";

console.log(city); // Unknown
```

Here:

1. `learner.address?.city` safely accesses the city.
2. Since the address is missing, the expression returns `undefined`.
3. `?? "Unknown"` supplies the default.

How the operators work together

`learner.address?.city`

Safely access the city

Result: `undefined`

The address is missing

`undefined ?? "Unknown"`

Provide a fallback value

## `"Unknown"`

Final result

### Example 3: Optional chaining with arrays

```
let learners: string[] | undefined;

console.log(learners?.[0]); // undefined
```

If `learners` is an array, `learners?.[0]` accesses its first element. If it is `null` or `undefined`, the expression returns `undefined`.

### Example 4: Optional chaining with methods

```
type User = {
    greet?: () => string;
};

let user: User = {};

console.log(user.greet?.()); // undefined
```

Here, `greet?.()` calls the method only if `greet` exists and is not `null` or `undefined`.

## 3. Difference between `??` and `?.`

| Feature                          | Nullish coalescing `??`   | Optional chaining `?.`                                 |
| -------------------------------- | ------------------------- | ------------------------------------------------------ |
| Purpose                          | Provides a fallback value | Safely accesses a property or method                   |
| Checks for                       | `null` or `undefined`     | `null` or `undefined` before the operator              |
| Example                          | `name ?? "Guest"`         | `user?.name`                                           |
| Returns a default automatically? | Yes, when nullish         | No; returns `undefined` when access is short-circuited |

Remember these two rules:

- `??` means: If the value is missing, use this default.
- `?.` means: If the object is missing, stop safely instead of throwing an error.

You can use both together:

```
let city = user?.address?.city ?? "Unknown";
```

This safely accesses the nested city property and returns `"Unknown"` if the resulting value is `null` or `undefined`.

# 2. Type Casting and Type Conversion in TypeScript

This is an important topic because TypeScript behaves differently from Java in this area.

First, understand the difference:

- Type conversion changes a value from one runtime representation to another.
- Type assertion tells the TypeScript compiler how to treat a value, without changing the value at runtime.

TypeScript commonly uses the term type assertion for what developers sometimes call type casting.

## 2.1 Type conversion using built-in functions

You can convert values using functions such as `Number()`, `String()`, and `Boolean()`.

### A. Convert a string to a number

```
let value: string = "100";

let result: number = Number(value);

console.log(result);        // 100
console.log(typeof result); // "number"
```

Another common approach is `parseInt()`.

```
let age: number = parseInt("25", 10);

console.log(age); // 25
```

`Number()` and `parseInt()` have different parsing rules.

```
console.log(Number("25px"));       // NaN
console.log(parseInt("25px", 10)); // 25
```

Use `Number()` when the complete string should represent a valid number. Remember to check for `NaN` when the input might be invalid.

### B. Convert a number to a string

```
let age: number = 25;

let result: string = String(age);

console.log(result);        // "25"
console.log(typeof result); // "string"
```

You can also use the `.toString()` method on a number.

```
let marks: number = 90;
let text: string = marks.toString();

console.log(text); // "90"
```

### C. Convert a value to a Boolean

```
console.log(Boolean(1));       // true
console.log(Boolean(0));       // false
console.log(Boolean("Hello")); // true
console.log(Boolean(""));      // false
console.log(Boolean(null));    // false
```

Be careful: `"false"` is a non-empty string, so `Boolean("false")` returns `true`.

## 2.2 Type assertion using `as`

A type assertion tells the compiler to treat a value as a particular type.

```
let value: unknown = "Hello TypeScript";

let message: string = value as string;

console.log(message.toUpperCase());
```

Here, `as string` does not convert the value. It only informs the compiler of the intended type.

The assertion is valid in this example because the actual value is a string.

However, this example is unsafe:

```
let value: unknown = 100;

let message: string = value as string;

console.log(message.toUpperCase()); // Runtime error
```

The compiler accepts the assertion, but the actual value is still a number.

Important: Type assertions do not perform runtime validation.

## 2.3 Type assertion using angle-bracket syntax

TypeScript also supports this syntax outside JSX/TSX files:

```
let value: unknown = "Hello";

let message: string = <string>value;

console.log(message.toUpperCase());
```

The equivalent `as` syntax is usually preferred because it is compatible with JSX/TSX syntax.

## 2.4 Type narrowing using `typeof`

When a value's type is unknown, checking its type before using it is often safer than asserting a type.

```
let value: unknown = "Hello TypeScript";

if (typeof value === "string") {
    console.log(value.toUpperCase());
}
```

TypeScript recognizes that `value` is a string inside the `if` block.

Another example:

```
function displayValue(value: string | number): void {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}

displayValue("Angular"); // ANGULAR
displayValue(25);       // 25.00
```

This is called type narrowing. It lets TypeScript determine which operations are valid in each branch.

## 2.5 Type casting versus Java casting

| Java                                                   | TypeScript                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| `(int) value` performs a numeric cast where applicable | `Number(value)` converts to a number                          |
| `(String) value` is a runtime reference cast           | `value as string` is a compile-time assertion                 |
| Invalid reference casts can throw `ClassCastException` | Incorrect assertions may cause runtime errors when used       |
| Types are enforced by the JVM at runtime               | Type annotations and assertions are erased during compilation |

For example, Java's `(String) value` checks the runtime object's type. TypeScript's `value as string` does not.

# 3. Conditional Statements in TypeScript

Conditional statements allow the program to make decisions.

TypeScript supports `if`, `if...else`, `else if`, nested `if`, and `switch`.

## 3.1 `if` statement

Executes a block when the condition is true.

```
let age: number = 22;

if (age >= 18) {
    console.log("Eligible to vote");
}
```

## 3.2 `if...else`

Chooses between two alternative paths.

```
let marks: number = 35;

if (marks >= 40) {
    console.log("Pass");
} else {
    console.log("Fail");
}
```

Output:

```
Fail
```

## 3.3 `if...else if...else`

Useful when there are multiple possible conditions.

```
let marks: number = 85;

if (marks >= 90) {
    console.log("Grade A");
} else if (marks >= 75) {
    console.log("Grade B");
} else if (marks >= 60) {
    console.log("Grade C");
} else if (marks >= 40) {
    console.log("Grade D");
} else {
    console.log("Fail");
}
```

Output:

```
Grade B
```

Conditions are checked from top to bottom. Once a condition is true, the remaining branches are skipped.

## 3.4 Nested `if`

An `if` statement inside another `if` statement is called a nested `if`.

```
let age: number = 25;
let hasLicense: boolean = true;

if (age >= 18) {
    if (hasLicense) {
        console.log("Can drive");
    } else {
        console.log("License required");
    }
} else {
    console.log("Not old enough");
}
```

This is useful when one decision depends on another decision.

## 3.5 `switch` statement

Use `switch` when one expression is compared against several possible values.

```
let day: number = 3;

switch (day) {
    case 1:
        console.log("Monday");
        break;

    case 2:
        console.log("Tuesday");
        break;

    case 3:
        console.log("Wednesday");
        break;

    default:
        console.log("Invalid day");
}
```

Output:

```
Wednesday
```

- `case` specifies a possible value.
- `break` exits the switch.
- `default` handles unmatched values.

### TypeScript benefit: union types

```
type Status = "pending" | "approved" | "rejected";

let status: Status = "approved";

switch (status) {
    case "pending":
        console.log("Awaiting approval");
        break;

    case "approved":
        console.log("Request approved");
        break;

    case "rejected":
        console.log("Request rejected");
        break;
}
```

Here, TypeScript restricts `status` to the three specified values.

# 4. Looping Statements in TypeScript

Loops execute a block of code repeatedly.

The main loop constructs are `for`, `while`, `do...while`, `for...of`, and `for...in`.

## 4.1 `for` loop

Use a `for` loop when you want to control iteration with an initialization, condition, and update.

```
for (let i: number = 1; i <= 5; i++) {
    console.log(i);
}
```

Output:

```
1
2
3
4
5
```

Execution sequence:

1. Initialize `i` to `1`.
2. Check whether `i <= 5`.
3. Execute the loop body.
4. Increment `i`.
5. Repeat until the condition is false.

Example: Calculate the sum from 1 to 10.

```
let sum: number = 0;

for (let i: number = 1; i <= 10; i++) {
    sum += i;
}

console.log(sum); // 55
```

## 4.2 `while` loop

A `while` loop checks its condition before executing the body.

```
let i: number = 1;

while (i <= 5) {
    console.log(i);
    i++;
}
```

Output:

```
1
2
3
4
5
```

If the condition is initially false, the loop body will not execute.

## 4.3 `do...while` loop

A `do...while` loop executes the body first and checks the condition afterward.

```
let count: number = 10;

do {
    console.log("Executed once");
} while (count < 5);
```

Output:

```
Executed once
```

Even though the condition is false, the body executes once.

## 4.4 `for...of` loop

The `for...of` loop iterates over the values of an iterable, such as an array or string.

```
let names: string[] = ["Arun", "Priya", "Kumar"];

for (const name of names) {
    console.log(name);
}
```

Output:

```
Arun
Priya
Kumar
```

This is often the simplest way to process array elements when the index is not needed.

## 4.5 `for...in` loop

The `for...in` loop iterates over enumerable property keys of an object.

```
let learner = {
    name: "Priya",
    age: 22,
    course: "Angular"
};

for (const key in learner) {
    console.log(key, learner[key as keyof typeof learner]);
}
```

Output:

```
name Priya
age 22
course Angular
```

The expression `keyof typeof learner` tells TypeScript that the key belongs to the known property names of `learner`.

For arrays, prefer `for...of` when you need the elements, rather than using `for...in` to iterate over indexes.

## 4.6 Difference between loops

| Loop         | Condition checked                      | Typical use                        |
| ------------ | -------------------------------------- | ---------------------------------- |
| `for`        | Before each iteration                  | Counter-based repetition           |
| `while`      | Before each iteration                  | Repetition based on a condition    |
| `do...while` | After each iteration                   | Execute at least once              |
| `for...of`   | Iteration protocol controls repetition | Iterate over values                |
| `for...in`   | Iterates over enumerable keys          | Iterate over object property names |

## 4.7 `break` and `continue`

`break` terminates the loop.

```
for (let i: number = 1; i <= 5; i++) {
    if (i === 3) {
        break;
    }

    console.log(i);
}
```

Output: `1 2`

`continue` skips the current iteration and moves to the next one.

```
for (let i: number = 1; i <= 5; i++) {
    if (i === 3) {
        continue;
    }

    console.log(i);
}
```

Output: `1 2 4 5`

# 5. Practice exercises

These exercises can be used to check learners' understanding.

1\. What is the output of 10 + "20"?

30

1020

Error

2\. Which converts the string "123" into the number 123?

String("123")

Number("123")

"123" as number

3\. What is the output of 5 == "5"?

true

false

Compilation error

4\. Which loop executes its body at least once?

for

while

do...while

5\. What does for...of return when iterating over an array?

Array values

Property names or indexes

Only array length

Check answers

## Key takeaways

- Operators: Perform calculations, comparisons, and logical operations.
- Type conversion: Changes a value at runtime; use `Number()`, `String()`, and `Boolean()` where appropriate.
- Type assertion: `value as string` informs the compiler but does not convert or validate the value.
- Conditional statements: Make decisions using `if`, `else if`, and `switch`.
- Loops: Repeat operations using `for`, `while`, `do...while`, `for...of`, and `for...in`.

 