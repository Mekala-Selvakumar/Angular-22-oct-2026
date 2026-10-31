# Module 3: Angular Setup & Project Structure (1 Hour)

This module introduces the tools required to develop Angular applications, how to set up the development environment, and how to understand the structure of an Angular project.

 ## 1. Node.js

### What is Node.js?

Node.js is a JavaScript runtime that allows JavaScript programs to execute outside a web browser.

Angular development tools use Node.js to run build tools, development servers, and other command-line utilities.

Important distinction: Angular applications generally run in the user's browser. Node.js is primarily needed for the development and build tooling, not because every Angular application requires a Node.js server in production.

### Why do we need Node.js for Angular?

- To run npm, the Node.js package manager.
- To install Angular CLI and project dependencies.
- To run the Angular development server.
- To compile, bundle, and build Angular applications.

### What is npm?

npm is the package manager distributed with Node.js. It downloads libraries and manages project dependencies.

For example:

```
npm install
```

Installs dependencies declared in the project's `package.json`.

```
npm install lodash
```

Installs the `lodash` package in the current project.

### Verify the installation

Open the terminal in VS Code or Command Prompt and execute:

```
node -v
npm -v
```

Example output (your versions may differ):

```
v22.x.x
10.x.x
```

If both commands return version numbers, the tools are available in the terminal.

For an actual training batch, use an Angular-supported Node.js version rather than installing an arbitrary version. Angular's compatibility table changes between releases; for example, Angular 22 supports Node.js `^22.22.3`, `^24.15.0`, or `^26.0.0`. Check the [official Angular version compatibility table](https://angular.dev/reference/versions?utm_source=chatgpt.com) before installation.&#x20;

## 2. Angular CLI

### What is Angular CLI?

Angular CLI stands for Angular Command-Line Interface. It is a tool that helps developers create, run, build, test, and maintain Angular applications using commands.&#x20;

Instead of creating every file manually, developers can use CLI commands to generate the project structure and common Angular building blocks.

### Install Angular CLI

Open a terminal and run:

```
npm install -g @angular/cli
```

The `-g` option installs Angular CLI globally so that the `ng` command can be used from different directories.

Verify the installation:

```
ng version
```

This displays Angular CLI and related package versions.

### Important Angular CLI commands

| Command                               | Purpose                                 |
| ------------------------------------- | --------------------------------------- |
| `ng version`                          | Displays installed Angular versions     |
| `ng new employee-app`                 | Creates a new Angular project           |
| `ng serve`                            | Starts the development server           |
| `ng serve --open`                     | Starts the server and opens the browser |
| `ng generate component employee-list` | Generates a component                   |
| `ng generate service employee`        | Generates a service                     |
| `ng build`                            | Builds the application                  |
| `ng test`                             | Runs the configured unit tests          |

### Create and run an Angular application

Execute these commands in sequence:

```
ng new employee-app
cd employee-app
ng serve --open
```

During `ng new`, Angular CLI may ask about routing, stylesheets, and other configuration options. For the introductory exercise, learners can accept the defaults or select CSS for styling.

Once the development server starts, open:

`http://localhost:4200/`

You should see the starter Angular application. The server watches for changes and rebuilds the application as you edit files.&#x20;



## 3. Visual Studio Code setup

### Why use VS Code?

Visual Studio Code is a code editor that provides syntax highlighting, IntelliSense, debugging, an integrated terminal, and extensions for Angular and TypeScript development.

### Recommended setup


1\. Install VS Code

Download it from the [official VS Code website](https://code.visualstudio.com/?utm_source=chatgpt.com).

[Angular Language Service - Visual Studio Marketplace](https://images.openai.com/static-rsc-4/7wa78xckvG17D9gRkk54Z5ZIy3kUBvzifsWWVfBBDAVy5jUY8qkJcpd6xJ2XqgJNC9rT-Bqv2nn0ZVcEFwkSdRIwxMElFV6RPefIcyj6AQrEOzUEtvZtaS9jx-YDTnQA5gjf7SHfbQTgeXja6SzZgFNCE3x-YC3iRW0QvRjNips?purpose=inline)

2\. Install Angular Language Service

Open Extensions in VS Code (`Ctrl+Shift+X`), search for Angular Language Service, and install it. It improves template diagnostics, code completion, and navigation.

[GitHub - prettier/prettier-vscode: Visual Studio Code extension for Prettier](https://images.openai.com/static-rsc-4/ifHPNuAP8HCLTUujeNOE5WYqw0HUV_SoYHyDR90wuS4DN4lgJFVj5pIy5d2fQHyAt6BSIpOl_AcHHEAJJDyAvH-KKyR1v9I9IkI9FzPCla9AWHaa2EFBtDNSLtOlPNTRUjluFB9LbFj1D-Qv8lmD4r8JkpJ600xMTsm1nHFsCGA?purpose=inline)

3\. Optional: install Prettier

Prettier formats code consistently. Configure it according to the team's project conventions.

### Open the Angular project

From the project directory, execute:

```
code .
```

Alternatively, in VS Code choose File → Open Folder and select `employee-app`.

To open the integrated terminal, choose Terminal → New Terminal.

Note: Angular Language Service is recommended but not required for running an Angular project.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



## 4. Angular project structure

Angular CLI generates a project containing source files, configuration files, dependencies, and build settings. The exact filenames vary by Angular version and project options. Recent Angular CLI projects use a newer, shorter naming style by default.&#x20;


### Typical project structure

employee-app/

`src/`

Contains the application's source code and HTML entry page.

`app/`

Root component and related application files; additional components and services can be organized here.

`app.ts` — root component class

`app.html` — root component template

`app.css` — root component styles

`app.config.ts` — application providers and configuration, when generated

`app.routes.ts` — route definitions, when routing is configured

`main.ts`

Bootstraps the Angular application

`index.html`

Main HTML page loaded by the browser

`styles.css`

Global CSS styles

`angular.json`

Angular workspace configuration, including build and serve settings.

`package.json`

Project scripts, dependencies, and development dependencies.

`package-lock.json`

Records the resolved npm dependency versions.

`tsconfig.json`

Base TypeScript compiler configuration.

`public/`

Static assets such as images and icons in projects configured to use this folder.

`node_modules/`

Installed packages and their dependencies.

### Understand the important files

1\. `main.ts` — Application entry point

This file starts the Angular application. In a modern standalone project, it commonly contains code similar to:

```
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';

bootstrapApplication(App)
    .catch(err => console.error(err));
```

The exact import depends on the root component's generated filename and class name. `bootstrapApplication()` starts the application using the root component.

2\. `app.ts` — Root component

The root component is the main component of the application. In a current project, it may look like this:

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>Employee Management</h1>`
})
export class App {
}
```

Here, `@Component` tells Angular how to configure the component. The `selector` identifies its HTML element, and `template` defines its view.

3\. `app.html` — Component template

In projects using separate template files, HTML is stored here instead of directly inside the TypeScript class.

```
<h1>Employee Management System</h1>
<p>Welcome to our application.</p>
```

4\. `angular.json` — Angular configuration

This file configures Angular CLI operations such as building and serving the application. Developers generally let Angular CLI manage most of this configuration.

5\. `package.json` — Project dependencies

A simplified example:

```
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  },
  "dependencies": {
    "@angular/core": "..."
  }
}
```

The real generated file includes additional dependencies and version numbers. The `...` here is only illustrative, not a literal version to install.

6\. `tsconfig.json` — TypeScript configuration

This controls TypeScript compiler options, such as strict type checking and module settings. Angular projects commonly have additional configuration files for application code and tests.

## 5. Hands-on exercise for learners

Ask learners to complete these tasks during the session.

### Practical checklist

0 of 6 completed

Verify Node.js and npm versions.

Install Angular CLI and run ng version.

Create an employee-app Angular project.

Run the application using ng serve --open.

Locate main.ts, the root component, angular.json and package.json.

Change the welcome heading and verify the browser update.

## Key takeaways

- Node.js and npm provide the environment and package management for Angular development tools.
- Angular CLI creates and manages application scaffolding.
- VS Code provides a productive editing environment, enhanced by Angular Language Service.
- `src/` contains application source files; `main.ts` bootstraps the app.
- `angular.json`, `package.json`, and `tsconfig.json` configure different aspects of the project.

Official references

- [Angular installation guide](https://angular.dev/installation?utm_source=chatgpt.com)
- [Angular CLI documentation](https://angular.dev/tools/cli?utm_source=chatgpt.com)
- [Angular workspace and file structure](https://angular.dev/reference/configs/file-structure?utm_source=chatgpt.com)

---
When you execute `ng serve`, Angular does not simply execute every file in the project one by one. Angular CLI starts a development server, builds the application starting from its entry point, and serves the generated application files to the browser. The browser then loads the application and Angular bootstraps the root component.

Let's understand the complete execution flow using a typical modern Angular project.

# 1. What happens when you execute `ng serve`?

```
ng serve
```

Step 1: `ng serve`

Angular CLI receives the command

Step 2: Read `angular.json`

Find the project and its build/serve configuration

Step 3: Build the application

Compile TypeScript, process templates and styles, and bundle assets

Step 4: Start development server

Usually available at localhost:4200

Step 5: Browser requests `index.html`

The server returns the application entry HTML

Step 6: Browser loads JavaScript and CSS

The generated bundles and assets are loaded

Step 7: Angular starts

`main.ts` bootstraps the root component; Angular renders the UI

The important distinction is that some files are read or processed by the development tools, while others run or are loaded in the browser.

## 2. Which files are involved, and in what order?

Assume your project contains these files:

```
employee-app/
├── angular.json
├── package.json
├── tsconfig.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    └── app/
        ├── app.ts
        ├── app.html
        ├── app.css
        ├── app.config.ts
        └── app.routes.ts
```

The exact files depend on the Angular version and options chosen when the project was created.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular



### Step 1: `package.json` — dependencies are available

Before running the application, the project dependencies must be installed. The `package.json` file declares dependencies and scripts; `node_modules` contains the installed packages.

When you run `ng serve`, the `ng` command invokes Angular CLI.

### Step 2: `angular.json` — Angular CLI finds its instructions

Angular CLI reads the workspace configuration to determine which project and `serve` target to use. The `serve` target normally invokes a development-server builder, which in turn uses the application's build configuration.&#x20;

### Step 3: `tsconfig.json` — TypeScript compiler settings

Angular uses the applicable TypeScript configuration files to determine compiler settings, including strictness and module options.

The build process compiles TypeScript and processes Angular templates and styles. The source files are bundled into browser-ready resources.&#x20;

### Step 4: `main.ts` — application entry point

A modern standalone Angular application might have:

```
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
    .catch(err => console.error(err));
```

This is the application's entry point. During the build, Angular includes it in the generated JavaScript bundle.

When the browser loads that bundle, the `bootstrapApplication()` call starts Angular using the `App` component as its root component.&#x20;


### Step 5: `index.html` — browser loads the application page

The development server serves the application's HTML entry page.

A simplified version looks like this:

```
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Employee App</title>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

Notice `<app-root></app-root>`. This is the placeholder where the root Angular component will be rendered.

Angular CLI arranges for the generated JavaScript and CSS resources to be loaded by the HTML page; you generally do not add those bundle references manually.&#x20;


### Step 6: `app.config.ts` — application configuration

If the application uses this file, `main.ts` imports and passes its configuration to `bootstrapApplication()`.

For example, it can configure providers and routing.

Important: `app.config.ts` is not a mandatory step in every Angular project. It is commonly generated for standalone applications.

### Step 7: `app.ts` — root component is initialized

Example:

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Employee Management';
}
```

Angular creates the root component and uses its metadata to locate the template and styles.

### Step 8: `app.html` — UI is rendered

```
<h1>{{ title }}</h1>
<p>Welcome to the Employee Management System.</p>
```

Angular evaluates `{{ title }}` and displays:

```
Employee Management

Welcome to the Employee Management System.
```

The component's CSS is applied, and global styles from `src/styles.css` are also included as configured.

### Step 9: `app.routes.ts` — routes are used when needed

If routing is configured, this file defines the application's routes. The routes are used when Angular's router is configured and the user navigates to the relevant URL. It is not necessarily executed as a separate step immediately after the root component.

## 3. What happens after you change a file?

Suppose you edit `app.html` and save it.

1. Angular CLI detects the file change.
2. The development build is updated.
3. The browser receives the updated application resources and refreshes or updates the displayed page as appropriate.

The development server watches source files and rebuilds the application when they change.&#x20;


## 4. Which files are not executed during `ng serve`?

| File                | Role                                                            |
| ------------------- | --------------------------------------------------------------- |
| `app.spec.ts`       | Used for testing; not run as part of normal application startup |
| `README.md`         | Documentation only                                              |
| `package-lock.json` | Records dependency resolution; not application code             |
| `app.routes.ts`     | Route configuration, used when the router is configured         |
| `tsconfig.json`     | Compiler configuration, not application runtime code            |

## Remember this sequence

`ng serve`

`angular.json` — find the serve/build targets

Compile and bundle TypeScript, templates and styles

Development server serves `index.html` and generated resources

Browser loads JavaScript bundle

`main.ts` entry point → `bootstrapApplication()` → root component → template rendered

The most important distinction for learners is: `ng serve` builds and serves the application; the browser loads the generated JavaScript; Angular then bootstraps the root component and renders the UI. The source files are not executed one by one in the order they appear in the project folder.

---

## 2. Which comes first: `index.html` or `main.ts`?

`index.html` is loaded first by the browser; `main.ts` is the application's source-code entry point. The browser does not directly execute the `.ts` file.

The sequence is:

### 1. Browser requests `index.html`

The Angular development server returns the HTML page.

### 2. Browser loads generated JavaScript

The HTML references the JavaScript bundles produced by the build process.

### 3. JavaScript entry bundle executes

It contains the compiled code originating from `main.ts` and its dependencies.

### 4. Angular bootstraps the root component

Angular renders the component into the `<escape><app-root></app-root></escape>` host element.

The key point is that `index.html` does not normally contain a direct reference to `main.ts`. Angular CLI builds the application and arranges for the generated JavaScript resources to be loaded.&#x20;


## 3. What is the use of `node_modules`?

`node_modules` contains the packages installed for your project through npm.

For example, it contains packages such as:

| Package             | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `@angular/core`     | Angular's core framework functionality                         |
| `@angular/common`   | Common directives and utilities                                |
| `@angular/compiler` | Angular template compilation functionality                     |
| `@angular/cli`      | Command-line tooling, if installed locally                     |
| `typescript`        | TypeScript compiler                                            |
| `rxjs`              | Reactive programming utilities                                 |
| `zone.js`           | Execution-context tracking used by many Angular configurations |

The exact packages depend on your Angular version and project configuration.

Think of `node_modules` as the project's installed library collection. Your application imports functionality from these packages.

For example:

```
import { Component } from '@angular/core';
```

Here, `@angular/core` is a package installed as a project dependency. The build tools resolve the import and include the required code in the generated application bundles.

Important distinctions:

- Node.js runs the Angular CLI and build tooling.
- `node_modules` supplies the installed tools and libraries.
- The TypeScript compiler and Angular build tools process the source files.
- The browser runs the generated JavaScript application.

You generally do not upload the entire `node_modules` folder when deploying an Angular application; you deploy the generated build output.&#x20;


## 4. How are `.ts` files converted into `.js`?

This process is called transpilation: converting source code from one language or language version into another. Angular builds also perform additional work, including Angular template compilation, bundling, and optimization.

Consider this TypeScript file, `app.ts`:

```
let employeeName: string = "Arun";

function displayEmployee(): void {
    console.log(employeeName);
}

displayEmployee();
```

The browser cannot execute this TypeScript source directly because it contains TypeScript-specific syntax, such as `: string` and `: void`.

A simplified JavaScript equivalent is:

```
let employeeName = "Arun";

function displayEmployee() {
    console.log(employeeName);
}

displayEmployee();
```

Notice that the TypeScript type annotations have been removed.

### The Angular build process

TypeScript source files

`main.ts`, `app.ts`, services, other components

TypeScript and Angular compiler tools

Type-checking, TypeScript transformation and Angular template compilation

Build and bundling

Resolve imports, combine required code and process styles and assets

Browser-ready output

JavaScript bundles, CSS and assets served by Angular CLI

Angular uses its build pipeline to compile both TypeScript and Angular templates into browser-ready code. The exact internal tools and intermediate files vary by Angular version and build configuration.&#x20;

### Can we compile TypeScript ourselves?

Yes. In a plain TypeScript project, you can install TypeScript and run:

```
npx tsc app.ts
```

This produces a JavaScript file, typically `app.js`, subject to the compiler settings and any errors.

In an Angular project, you normally do not manually compile each `.ts` file. Instead, Angular CLI handles the integrated compilation and bundling:

```
ng serve
```

For a production build:

```
ng build
```

The production build output is normally placed in `dist/`.

## 5. What happens if `node_modules` is deleted?

Your source code remains, but the project's installed packages are missing. Commands such as `ng serve` may fail because the required CLI or build dependencies are unavailable.

Restore the dependencies from the project folder using:

```
npm install
```

npm reads `package.json` and `package-lock.json` and reinstalls the project's dependencies.

## Final summary for your learners

| Question                                     | Answer                                                          |
| -------------------------------------------- | --------------------------------------------------------------- |
| Which file is loaded first by the browser?   | `index.html`                                                    |
| Does the browser execute `main.ts` directly? | No. It executes generated JavaScript.                           |
| What does `main.ts` do?                      | Provides the application's bootstrap entry point.               |
| What is `node_modules`?                      | The collection of installed project packages.                   |
| Who converts TypeScript into JavaScript?     | TypeScript and Angular build tools.                             |
| What does `ng serve` do?                     | Builds the application as needed and serves it for development. |
| Where is the production build generated?     | Normally in `dist/`.                                            |

