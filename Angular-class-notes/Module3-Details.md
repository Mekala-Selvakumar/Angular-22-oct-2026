# Module 3: Angular Setup & Project Structure


This module follows the four topics in your course outline: Node.js, Angular CLI, VS Code Setup, and Angular Project Structure.&#x20;

## Product Management

An Angular frontend that will eventually communicate with a backend REST API.

Planned application features

Product listing

Display available products

Search and filter

Find products by name or category

Product maintenance

Add, edit, and delete products

Inventory

Price, category, and stock quantity

In this module, we will create the project, configure the development environment, and understand the generated structure. We will implement the application features in the subsequent modules.

## 1. Node.js

### 1.1 What is Node.js?

Node.js is a JavaScript runtime that allows JavaScript code to execute outside a browser.

JavaScript normally runs in a browser to control interactive web pages. Node.js enables JavaScript tools and applications to execute on the developer's machine or a server.

Angular development uses Node.js to run tools such as Angular CLI, build tools, development servers, and package-management utilities.

Important distinction: Node.js is not Angular, and it is not a prerequisite for every browser to execute the final Angular frontend. It is primarily required for Angular development and building. A production application can often be served as static files without running a Node.js application server.

### 1.2 Why is Node.js required for Angular?

When developing the Product Management application, we need to:

- Create the Angular project.
- Install Angular and third-party libraries.
- Transpile and bundle TypeScript and application code.
- Run a local development server.
- Build an optimized production application.

Node.js enables the JavaScript-based tools that perform these tasks.

For example, when we run:

```
ng serve
```

the Angular CLI runs in the local development environment, starts a development server, and builds the application for browser use.

The browser executes the generated JavaScript. It does not need to understand the original TypeScript annotations.

### 1.3 What is npm?

npm is the package manager commonly installed with Node.js. It is used to install and manage the packages required by Angular projects.

For our application, dependencies might include:

- Angular framework packages.
- Angular Router.
- Angular HTTP Client packages.
- RxJS.
- Other UI or utility libraries added later.

For example:

```
npm install
```

This installs the dependencies listed in the project's `package.json`, using the lockfile when available to resolve reproducible dependency versions.

The distinction is important:

| Tool                                   | Responsibility                                                 |
| -------------------------------------- | -------------------------------------------------------------- |
| Node.js                                | Runs JavaScript tools outside the browser                      |
| npm                                    | Installs and manages packages                                  |
| Angular CLI                            | Creates, serves, builds, tests, and maintains Angular projects |
| TypeScript compiler and build pipeline | Checks types and transforms source code for the browser        |

### 1.4 Verify the environment

For this course, we will use Windows PowerShell or the VS Code integrated terminal.

First, check whether Node.js and npm are installed.

```
node -v
npm -v
```

The first command displays the installed Node.js version. The second displays the npm version.

If either command is not recognized, Node.js may not be installed correctly or its executable path may not be configured.

### Which Node.js version should we use?

As of October 26, 2026, the Angular 22 compatibility table lists these supported Node.js ranges: `^22.22.3`, `^24.15.0`, and `^26.0.0`. Choose a version within one of the supported ranges and use a consistent version across the training machines.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



For an existing enterprise project, use the Node.js version supported by that project's Angular version instead of automatically installing the newest Node.js release.

## 2. Angular CLI

### 2.1 What is Angular CLI?

Angular CLI stands for Angular Command Line Interface.

It is a command-line tool that automates common development tasks, such as creating an Angular workspace, generating components and services, serving the application locally, executing tests, and creating production builds.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



Without Angular CLI, developers would have to configure much of the build tooling, dependencies, project files, and scripts manually.

### 2.2 Install Angular CLI

Once Node.js is installed, execute:

```
npm install -g @angular/cli
```

Here:

- `npm install` installs a package.
- `-g` installs the package globally so its CLI can be invoked from the terminal.
- `@angular/cli` is the Angular CLI package.

Verify the installation:

```
ng version
```

The command displays the versions of Angular CLI and relevant development packages.

Training recommendation: Use an Angular CLI version compatible with the Angular version selected for the course. For an existing application, check `package.json` and the locally installed package versions rather than relying only on the globally installed CLI.

### 2.3 Create the Product Management project

Move to the directory in which you want to create your training project.

```
cd D:\Training
```

Then run:

```
ng new product-management --routing --style=css
```

This command asks Angular CLI to create a new workspace and application named `product-management`, configure routing, and use CSS for stylesheets.

The CLI may ask additional configuration questions depending on its version. Use the agreed training settings and allow the installation to complete.

Next, move into the project directory:

```
cd product-management
```

Open the project in Visual Studio Code:

```
code .
```

Finally, start the application:

```
ng serve --open
```

The development server usually opens the application at `http://localhost:4200/`. The `--open` option instructs the CLI to open the browser automatically.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



### 2.4 Important Angular CLI commands

These commands will be useful throughout the remaining modules.

| Command                     | Purpose                           | Product Management example             |
| --------------------------- | --------------------------------- | -------------------------------------- |
| `ng version`                | Displays Angular and CLI versions | Verify the development environment     |
| `ng new product-management` | Creates a new workspace           | Initial application setup              |
| `ng serve`                  | Runs the development server       | Preview the product UI                 |
| `ng generate component ...` | Generates a component             | Create the product list page           |
| `ng generate service ...`   | Generates a service               | Create product API communication       |
| `ng generate interface ...` | Generates an interface file       | Define the product model               |
| `ng build`                  | Builds the application            | Prepare distributable frontend files   |
| `ng test`                   | Runs configured unit tests        | Verify component and service behaviour |

The `ng generate` command is commonly shortened to `ng g`. For example:

```
ng g component features/products/pages/product-list
```

This generates a component within the specified feature path.

## 3. Visual Studio Code setup

### 3.1 Why use VS Code?

Visual Studio Code provides a development environment for editing TypeScript, HTML, CSS, Angular templates, and configuration files.

It also provides a terminal, source-control integration, debugging tools, and extension support.

For this course, VS Code will be the primary editor for the Product Management application.

### 3.2 Recommended extensions

[Visual studio code 2019 Icons, Logos, Symbols – Free Download PNG, SVG](https://images.openai.com/static-rsc-4/GILPu0zp24qL03rxp3SNyJwdDcz7dP3lpXjZwuWcmPPZkgx5zMrAfgpTp29fN-Hnnf8MT97IclakqWR1QOJ61GLxa4xo0WKyNuJy4tfiq8Q14TNGf9t1-CSO-Ra_oBxrTerFb4dFWLbNcUG0osVhIotml8pgIS_-UHZcL3HuSik?purpose=inline)

Visual Studio Code

The primary editor for Angular, TypeScript, HTML, CSS, and project configuration.

Website: [Visual Studio Code](https://code.visualstudio.com/?utm_source=chatgpt.com)

[Frontend development  - Software house | Advox Studio | Advox Studio](https://images.openai.com/static-rsc-4/FonKW7XGLgR6fcuDlVHKKoKKQ8z3xUu9heK04Kn2PmBKRWQxXBXhfDyPnxaPk7Ob-W3wNr7eL2ZSyarwIZxcF9KfuXspp_9Bm7ZUvDm2f3_Xytp4yH0If3FNLcxU813Jq8BzhePNK0j6jbXVi5Ur0k3-wXyIgh6ebtasw2xNGhI?purpose=inline)

Angular Language Service

Provides Angular template diagnostics, editor assistance, navigation, and autocompletion.

Find it in the VS Code Extensions view by searching for “Angular Language Service”.

ESLint — recommended

Helps identify code-quality problems and enforce consistent development rules when the project is configured for ESLint.

Developers may also use a formatter such as Prettier if the team has standardized its formatting configuration. Extensions should complement the project's existing tooling rather than introduce conflicting rules.

### 3.3 Open the project correctly

In VS Code, choose File → Open Folder and select the `product-management` folder.

The editor should show files such as:

```
product-management/
├── src/
├── public/
├── angular.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

The exact list varies with Angular CLI version and the options selected when the project was created.

### 3.4 Use the integrated terminal

Choose Terminal → New Terminal.

Ensure the terminal is positioned at the project root, where `angular.json` and `package.json` exist.

Execute:

```
ng serve
```

The terminal displays build output and compilation errors. Keep the development server running while editing the application.

When source files change, the development tooling rebuilds the affected application code and updates the browser as appropriate.

## 4. Angular project structure

This is the most important part of the module because participants need to understand how the generated files fit together before implementing application features.

### 4.1 Default Angular project structure

A modern Angular CLI application may have the following structure. Current CLI defaults use concise filenames such as `app.ts` and `app.html`; older projects may use names such as `app.component.ts` and `app.component.html`.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



```
product-management/
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.spec.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

Some files appear only when particular features or testing options are enabled. The structure above represents a typical standalone application, not a mandatory structure for every Angular project.

### 4.2 Understanding each important file

| File or folder       | Purpose                                                                            |
| -------------------- | ---------------------------------------------------------------------------------- |
| `src/`               | Contains application source files                                                  |
| `src/app/`           | Contains application components, services, routes, configuration, and related code |
| `src/index.html`     | Initial HTML document served to the browser                                        |
| `src/main.ts`        | Entry point that bootstraps the Angular application                                |
| `src/styles.css`     | Global CSS styles                                                                  |
| `public/`            | Static files copied or served as configured                                        |
| `app.ts`             | Root component class and component metadata                                        |
| `app.html`           | Root component's HTML template                                                     |
| `app.css`            | Styles specific to the root component                                              |
| `app.config.ts`      | Application-level configuration and providers                                      |
| `app.routes.ts`      | Route definitions, when routing is configured                                      |
| `app.spec.ts`        | Root component test file, when generated                                           |
| `angular.json`       | Angular workspace and build configuration                                          |
| `package.json`       | Package dependencies and npm scripts                                               |
| `package-lock.json`  | Locks resolved package versions for repeatable installations                       |
| `tsconfig.json`      | Base TypeScript compiler configuration                                             |
| `tsconfig.app.json`  | Application-specific TypeScript and Angular compiler configuration                 |
| `tsconfig.spec.json` | TypeScript configuration for tests, when generated                                 |

Angular's official file-structure reference explains these files and how they fit into the workspace.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://angular.dev\&sz=32)

Angular

+1



### 4.3 `index.html` versus `main.ts`

This distinction is frequently misunderstood.

`index.html` is the initial HTML document. It defines the page that the browser loads.

A simplified version might look like this:

```
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Product Management</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <app-root></app-root>
</body>
</html>
```

`<app-root>` is the host element for the root Angular component when the root component's selector is `app-root`.

`main.ts` is the Angular application's entry point. It imports the root component and starts Angular.

For example:

```
import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
    .catch(error => console.error(error));
```

The exact root-component import depends on the generated filename and class name in your project.

### What happens when the application runs?

1\. Browser requests `index.html`

Initial HTML document

2\. Browser loads built JavaScript

Generated by the Angular build pipeline, with `main.ts` as the application entry point

3\. Angular bootstraps the root component

`bootstrapApplication()` initializes the application

4\. Angular renders the root template

The Product Management UI appears inside `<app-root>`

The important distinction is that the browser initially loads the HTML document, and the JavaScript entry point is subsequently executed through the script bundles supplied by the build setup. `main.ts` is not itself an HTML document, and the browser does not execute raw TypeScript as JavaScript.

### 4.4 How TypeScript becomes JavaScript

Consider a component containing:

```
export class ProductList {
    productCount: number = 10;
}
```

The source file uses a TypeScript annotation, `: number`. Browsers do not execute that TypeScript annotation as native JavaScript syntax.

Angular's build pipeline checks and transforms the application's code into browser-compatible JavaScript.

A simplified view of the process is:

```
app.ts / app.html / app.css
              |
              v
Angular build and compilation tools
              |
              v
Generated JavaScript and CSS assets
              |
              v
Browser executes JavaScript
              |
              v
Angular renders and updates the UI
```

In practice, the build pipeline includes template processing, type checking, bundling, and other transformations. The exact internals depend on the Angular version and build configuration.

### 4.5 What is `node_modules`?

After installing the project's dependencies, you will see a `node_modules` folder.

It contains installed npm packages and their dependency trees. These packages include Angular libraries and the tooling required to develop, compile, and build the application.

For example:

```
node_modules/
├── @angular/
├── rxjs/
├── typescript/
└── ...
```

Do not manually edit application source code inside `node_modules`.

The folder is generally not committed to Git. Instead, the project tracks `package.json` and `package-lock.json`, which allow dependencies to be installed again.

To restore dependencies after cloning the project:

```
npm ci
```

This installs dependencies from the lockfile and is useful in reproducible development and continuous-integration environments.

### 4.6 Understanding `package.json`

A simplified version might look like this:

```
{
  "name": "product-management",
  "version": "0.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/core": "version-defined-by-project",
    "@angular/common": "version-defined-by-project",
    "rxjs": "version-defined-by-project"
  },
  "devDependencies": {
    "@angular/cli": "version-defined-by-project",
    "typescript": "version-defined-by-project"
  }
}
```

This is an illustrative structure, not a file to copy as-is. Let Angular CLI generate the real file and preserve the actual version ranges and dependencies.

The `scripts` section defines shorthand commands. For example:

```
npm start
npm run build
npm test
```

These invoke the configured scripts. The actual build and test tools depend on the project configuration.

### 4.7 Understanding `angular.json`

`angular.json` controls important Angular CLI project settings.

It can configure:

- Source and output locations.
- Build targets.
- Global styles and assets.
- Development and production configurations.
- Test targets.
- Other CLI options.

For instance, if the build configuration specifies a production output directory such as `dist/product-management`, the production build generates distributable assets there.

Do not confuse `angular.json` with `package.json`: the former configures Angular workspace projects and CLI targets, while the latter describes npm packages, dependency versions, and scripts.

### 4.8 Understanding `tsconfig.json`

The TypeScript compiler reads the applicable `tsconfig` files to determine how source code should be checked and compiled.

An Angular project commonly has:

- `tsconfig.json`: shared compiler settings.
- `tsconfig.app.json`: settings for the application build.
- `tsconfig.spec.json`: settings for tests, when present.

Strict type checking is particularly useful for experienced teams working on large applications because it helps detect incorrect assignments, unsafe null handling, and other type errors during development.

For production projects, preserve the compiler configuration generated by Angular CLI unless there is a clear reason to change it.

## 5. Organizing the Product Management application

The default structure is suitable for starting a project. As features are added, we should organize the code around business responsibilities.

For the course, we will progressively build toward a structure like this:

```
src/
└── app/
    ├── core/
    │   ├── services/
    │   ├── interceptors/
    │   └── guards/
    │
    ├── shared/
    │   ├── components/
    │   ├── directives/
    │   └── pipes/
    │
    ├── features/
    │   └── products/
    │       ├── pages/
    │       │   ├── product-list/
    │       │   └── product-form/
    │       │
    │       ├── components/
    │       │   └── product-card/
    │       │
    │       ├── models/
    │       │   └── product.ts
    │       │
    │       └── services/
    │           └── product.service.ts
    │
    ├── app.routes.ts
    ├── app.config.ts
    └── app.ts
```

This is a recommended target structure for our running example, not the structure automatically created by `ng new`. We will create these feature folders as needed.

The responsibilities are:

| Area                            | Responsibility                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| `core/`                         | Application-wide services and infrastructure, such as authentication and interceptors |
| `shared/`                       | Reusable UI components, directives, and pipes                                         |
| `features/products/pages/`      | Main product screens and page-level components                                        |
| `features/products/components/` | Product-specific reusable UI elements                                                 |
| `features/products/models/`     | Types and interfaces representing product data                                        |
| `features/products/services/`   | Product-related operations and backend communication                                  |

For a larger enterprise system, teams might separate API data-access logic, domain models, and UI components even further. We will begin with this manageable structure and refine it as the course introduces services, state management, routing, and testing.

## 6. Hands-on lab: Set up Product Management

Complete the following exercise during the training session.

### Step 1: Create and run the project

```
ng new product-management --routing --style=css
cd product-management
ng serve --open
```

Confirm that the default Angular application appears in the browser.

### Step 2: Generate the initial feature files

Stop the development server if needed, then execute these commands from the workspace root:

```
ng g component features/products/pages/product-list
ng g component features/products/pages/product-form
ng g component features/products/components/product-card
ng g service features/products/services/product
ng g interface features/products/models/product
```

The CLI will create the files in the specified paths. Generated filename conventions depend on the configured Angular style guide.

### Step 3: Inspect the generated files

Participants should locate:

- The root component.
- The product-list component.
- The product-form component.
- The product-card component.
- The product service.
- The product interface.
- `main.ts`, `index.html`, `app.config.ts`, `app.routes.ts`, `angular.json`, and `package.json`.

Do not implement the complete CRUD functionality in this module. We will use these files in the upcoming modules.

### Step 4: Define the Product interface

In the generated `product.ts` file, define a product data contract:

```
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stockQuantity: number;
}
```

This represents the data that our application will work with. We will add validation, presentation, and API integration later.

### Step 5: Display a simple page

Open the generated product-list component and replace its template with a heading such as:

```
<h2>Product Management</h2>
<p>Product list page is ready.</p>
```

The template may be inline or in a separate HTML file, depending on the CLI configuration. Update the correct file for your generated component.

### Step 6: Verify the build

```
ng build
```

Resolve any compilation errors. Then run `ng serve` and confirm that the application continues to work.

## 7. Troubleshooting common setup issues

| Problem                                                | Likely cause                                                                   | What to check                                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `node` or `npm` is not recognized                      | Node.js is missing or PATH is not configured                                   | Reinstall or repair Node.js installation, then open a new terminal                                      |
| `ng` is not recognized                                 | Angular CLI is not installed or its global executable directory is not on PATH | Verify npm global installation and use the correct terminal                                             |
| PowerShell blocks the Angular CLI script               | PowerShell execution policy                                                    | Review the official CLI guidance before changing the policy; using Command Prompt may be an alternative |
| `ng serve` reports missing packages                    | Dependencies are not installed or installation failed                          | Run `npm ci` if the lockfile is valid, or `npm install` for initial dependency installation             |
| Browser shows a blank page                             | Bootstrap, template, routing, or runtime error                                 | Inspect terminal output and the browser console                                                         |
| Generated file names differ from the trainer's example | Different Angular CLI version or naming configuration                          | Follow the files generated in the actual project                                                        |
| TypeScript or Angular version incompatibility          | Unsupported combination of dependencies                                        | Check `ng version` and Angular's version compatibility table                                            |

For a reliable classroom environment, create the project ahead of the session, verify the Angular CLI and Node.js versions, and ensure that all participants can run `ng serve`.

                         |

## Knowledge check

1\. What does Node.js primarily provide during Angular development?

The HTML template engine in the browser

A runtime for JavaScript development tools outside the browser

The database for Angular applications

The Angular Router

2\. Which command creates the Product Management Angular workspace?

npm build product-management

ng serve product-management

ng new product-management

node product-management

3\. Which file is the usual entry point that bootstraps a modern standalone Angular application?

index.html

package.json

main.ts

angular.json

4\. What is the purpose of node_modules?

It stores the browser's rendered page

It contains installed npm packages and their dependency trees

It defines the application's routes

It replaces package.json

5\. Which file configures Angular CLI workspace projects and build targets?

tsconfig.json

package-lock.json

angular.json

styles.css

Check answers


