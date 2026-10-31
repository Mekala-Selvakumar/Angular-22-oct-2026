There are 3 common ways to add Bootstrap to an Angular 22 application. You can explain all three approaches to learners, but I recommend the npm installation approach for your Product Management application.

## 1. Method 1: Install Bootstrap using npm (Recommended)

This is the preferred approach for Angular projects because Bootstrap becomes part of the project dependencies.

Step 1: Install Bootstrap

Open the terminal in your Angular project directory.

```
npm install bootstrap
```

Step 2: Configure Bootstrap CSS

Open `angular.json` and locate the `styles` array under `architect → build → options`.

Add the Bootstrap CSS path:

```
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
]
```

Step 3: Use Bootstrap classes in HTML

For example, in `app.html`:

```
<div class="container mt-5">

  <h2 class="text-primary">
    Product Management
  </h2>

  <button class="btn btn-success">
    Add Product
  </button>

  <button class="btn btn-danger ms-2">
    Delete Product
  </button>

</div>
```

Step 4: Run the application

```
ng serve
```

Bootstrap styles will be available throughout the Angular application.

## 2. Method 2: Install Bootstrap using npm and import it in styles.css

This is another npm-based approach. Instead of modifying `angular.json`, import Bootstrap directly into your global stylesheet.

Step 1: Install Bootstrap

```
npm install bootstrap
```

Step 2: Open `src/styles.css`

Add:

```
@import 'bootstrap/dist/css/bootstrap.min.css';
```

Step 3: Use Bootstrap classes

```
<div class="container mt-4">
    <h2 class="text-primary">Product List</h2>

    <button class="btn btn-primary">
        Add Product
    </button>
</div>
```

Angular includes `styles.css` as a global stylesheet, so Bootstrap styles are available throughout the application.



Recommended alternative

&#x20;For a simple Angular project, this approach is also perfectly fine.



## 3. Method 3: Use Bootstrap CDN

You can also include Bootstrap directly from a CDN (Content Delivery Network).

No npm installation is required.

Open `src/index.html`.

Add the Bootstrap CSS link inside the `head` section:

```
<head>
  <meta charset="utf-8">
  <title>Product Management</title>

  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
    rel="stylesheet">
</head>
```

Now you can directly use Bootstrap classes in your Angular HTML templates.

For example:

```
<div class="container mt-5">

    <div class="alert alert-success">
        Product added successfully!
    </div>

</div>
```

Note: CDN requires an internet connection. For Bootstrap JavaScript components, you need to include its JavaScript bundle separately.

## 4. What about Bootstrap JavaScript?

Bootstrap has two parts:

1. Bootstrap CSS: Provides styling for buttons, tables, forms, cards, grids, etc.
2. Bootstrap JavaScript: Provides interactive features such as modals, dropdowns, tooltips and collapse.

If you need Bootstrap JavaScript with npm, install Bootstrap and add its bundle to the `scripts` array in `angular.json`:

```
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```

The bundle includes Popper, which Bootstrap uses for dropdowns and tooltips.

For Angular applications, remember that Angular should generally manage application interactions. For example, use Angular event bindings and state for application behavior rather than unnecessarily manipulating the DOM with Bootstrap JavaScript.

## 5. Comparison of all three approaches

| Feature                      | npm + angular.json | npm + styles.css | CDN          |
| ---------------------------- | ------------------ | ---------------- | ------------ |
| Installation                 | npm                | npm              | Not required |
| Configuration                | angular.json       | styles.css       | index.html   |
| Internet required at runtime | No                 | No               | Yes          |
| Project dependency           | Yes                | Yes              | No           |
| Recommended                  | Yes                | Yes              | Quick demos  |

## 6. My recommendation for your Product Management training

Use Method 1 or Method 2.

I would teach Method 2 initially because learners can understand the role of `styles.css` and how global styles are applied in Angular.

Then demonstrate this small Product Management UI:

Product Management

Bootstrap UI

\+ Add Product

Product List

Laptop

₹55,000

Keyboard

₹1,500

Mouse

₹800

EditDelete

Illustrative layout of the Bootstrap-based product interface.

