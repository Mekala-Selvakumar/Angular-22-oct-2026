 We can create a TypeScript project from scratch. Since you are preparing for Angular , I recommend starting with a standalone TypeScript project using Node.js and TypeScript before moving to Angular. This helps experienced developers understand TypeScript fundamentals independently.

## 1. Prerequisites

Install these tools if they are not already available.

- Node.js — includes npm.
- Visual Studio Code — for writing TypeScript code.

Verify the installations in the VS Code terminal:

```
node -v
npm -v
```

## 2. Create a TypeScript project

Follow these steps in the terminal.

### 1

Create a project folder

```
mkdir typescript-demo
cd typescript-demo
```

### 2

Initialize the Node.js project

```
npm init -y
```

This creates `package.json`, which stores project metadata and scripts.

### 3

Install TypeScript

```
npm install --save-dev typescript
```

TypeScript is installed locally in the project.

### 4

Generate the TypeScript configuration

```
npx tsc --init
```

This creates `tsconfig.json`, which controls how TypeScript is compiled into JavaScript.

### 5

Create a source file

Create `src/app.ts` and add:

```
let employeeName: string = "Arun";
let employeeId: number = 101;
const isActive: boolean = true;

function displayEmployee(
  name: string,
  id: number
): void {
  console.log(`Employee Name: ${name}`);
  console.log(`Employee ID: ${id}`);
}

displayEmployee(employeeName, employeeId);
console.log(`Active: ${isActive}`);
```

### 6

Compile TypeScript

```
npx tsc src/app.ts --outDir dist
```

TypeScript generates `dist/app.js`.

### 7

Run the generated JavaScript

```
node dist/app.js
```

Expected output:

```
Employee Name: Arun
Employee ID: 101
Active: true
```

## 3. Understand the project structure

typescript-demo/

`package.json`

Project details and dependencies

`tsconfig.json`

Compiler configuration

`src/`

`app.ts`

TypeScript source code

`dist/`

Generated JavaScript output

## 4. How does TypeScript execution work?

`app.ts`

Write TypeScript with types

TypeScript compiler (`tsc`)

Type-checks and transpiles code

`app.js`

Generated JavaScript

Node.js

Executes the JavaScript

Important: Browsers and Node.js execute JavaScript, not TypeScript directly in this standard workflow. TypeScript types help catch errors during development and are removed during compilation.

 