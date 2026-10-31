In TypeScript, both `any` and `unknown` can hold a value of any type, but they differ in how safely you can use that value.

- **`any` disables type checking.** You can use it as if it were any type, which can hide mistakes.
- **`unknown` requires you to check the type first.** TypeScript won’t let you use it in type-specific ways until you narrow it.

```ts
let loose: any = "hello";
loose.toFixed(); // Allowed by TypeScript, but fails at runtime


let value: unknown = "hello";
// value.toFixed(); // Error: check the type first
//value.toUpperCase(); // Error: check the type first
if (typeof value === "string") {
  console.log(value.toUpperCase()); // Safe: value is known to be a string
}
```

**Rule of thumb:** Prefer `unknown` when the type isn’t known yet—such as data from an API. Use `any` only when you deliberately want to opt out of type checking.


In TypeScript, both `any` and `unknown` are used when the type of a variable is not known in advance. The main difference is `any` disables type checking, whereas `unknown` requires you to check the type before using the value.

## 1. Difference between `any` and `unknown`

| Feature                          | `any`         | `unknown`                         |
| -------------------------------- | ------------- | --------------------------------- |
| Type checking                    | Disabled      | Enforced                          |
| Assign any value                 | Yes           | Yes                               |
| Assign to another typed variable | Allowed       | Not allowed without checking      |
| Call methods directly            | Allowed       | Not allowed without checking      |
| Access properties directly       | Allowed       | Not allowed without checking      |
| Safety                           | Less safe     | More safe                         |
| Recommended usage                | Use sparingly | Prefer when the type is not known |

## 2. Example using `any`

```
let data: any = "Hello TypeScript";

console.log(data.toUpperCase()); // HELLO TYPESCRIPT

data = 100;

console.log(data.toUpperCase()); // Runtime error!
```

Explanation:

- TypeScript allows `toUpperCase()` because `data` is declared as `any`.
- When `data` becomes `100`, the same method call causes a runtime error because numbers do not have a `toUpperCase()` method.
- TypeScript does not warn us about this mistake during compilation.

## 3. Example using `unknown`

```
let data: unknown = "Hello TypeScript";

// console.log(data.toUpperCase()); // Compilation error

if (typeof data === "string") {
    console.log(data.toUpperCase()); // HELLO TYPESCRIPT
}

data = 100;

if (typeof data === "number") {
    console.log(data.toFixed(2)); // 100.00
}
```

Explanation:

- TypeScript accepts any value assigned to `data`.
- However, it does not allow us to use string or number methods directly.
- We must first check the type using `typeof`.
- Once the type is verified, TypeScript allows the appropriate operations.

This process is called type narrowing.

## 4. Visual comparison

`any` — Trust the developer

TypeScript allows operations without checking whether they are valid.

```
let value: any = 10;
value.toUpperCase(); // No compile-time error
```

`unknown` — Verify before using

TypeScript requires you to verify the type before performing operations.

```
let value: unknown = 10;

if (typeof value === "number") {
    console.log(value.toFixed(2));
}
```

## 5. Important difference in assignments

Consider this example:

```
let a: any = "Hello";
let u: unknown = "Hello";

let str1: string = a; // Allowed
let str2: string = u; // Compilation error
```

Why?

- `any` can be assigned to a variable of any type without a type check.
- `unknown` cannot be assigned to a specific type until TypeScript can verify that the value is compatible.

To fix the second assignment:

```
if (typeof u === "string") {
    let str2: string = u; // Allowed
}
```

## 6. Real-world example: API response

Suppose you receive data from an API, and you do not know its structure.

Using `any`:

```
function processResponse(response: any) {
    console.log(response.user.name);
}
```

If the response does not contain `user` or `name`, your application might fail at runtime.

Using `unknown`:

```
function processResponse(response: unknown) {
    if (
        typeof response === "object" &&
        response !== null &&
        "user" in response
    ) {
        console.log(response.user);
    }
}
```

Here, TypeScript requires validation before accessing the property. For production applications, you should also validate the nested `user` structure before using it.

## 7. When should you use each one?

- Use `any` when you deliberately want to opt out of type checking, such as when temporarily migrating legacy JavaScript code. Avoid using it unnecessarily.
- Use `unknown` when handling data whose type is uncertain, such as API responses, external input, or caught exceptions.

For example, TypeScript treats caught errors as `unknown` by default when `useUnknownInCatchVariables` is enabled under strict checking.

Remember this simple rule:

> `any` means “Let me do anything with this value.”

> `unknown` means “I can receive any value, but I must check it before using it.”

For experienced Java developers, think of `unknown` as a value whose actual type must be established before performing type-specific operations. Unlike Java's `Object`, TypeScript's `unknown` explicitly prevents unsafe operations until the type is narrowed.