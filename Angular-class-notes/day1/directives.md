# Custom Directives in Angular

A custom directive is a feature that allows us to extend HTML elements with our own behavior. We create a directive when we want to reuse the same behavior across multiple elements instead of writing the same code repeatedly in different components.

For example, in your Angular training, suppose you want to highlight a product name whenever the user moves the mouse over it. Instead of implementing mouse events separately for every product, you can create a reusable custom directive called `HighlightDirective`.

## 1. Types of directives in Angular

Angular directives are commonly classified into three types.

[Angular Directives Simplified: The Ultimate Guide for Every Developer | by Jenil Sojitra | Medium](https://images.openai.com/static-rsc-4/0FaObioP2uAfzXJV3CaCTKfaCbFH5xrNHSssnukGXJyC1QXT-b0KX7SO8h9qWKjBbGcXeUuMJXUGXGlpbjnsYpy6Jy-TA1MldRBJ6_AuIhSw5v0sFvMFCWh-iwN_7Vzzn4_mbF9eBZGej9PiPpXqLzA0_ualy_n1oxklJqihnUA?purpose=inline)

1\. Structural directives

Change the DOM structure by adding, removing, or repeating elements.

Examples: `*ngIf`, `*ngFor` (traditional syntax).

[💡 6 Powerful Custom Directives Every Angular Developer Should Know | by GT | Medium](https://images.openai.com/static-rsc-4/yRx2HeHpUb8YgL5B8xBxrt7vI8c3ia68EWI9yIinIu03AW7EkSAlS6FPfu-UaKrD3J75efGth08iNJZW_2ZddVQX6hit5XMAQmsV-y4jM7_tZGJ1X1POoCODXUkiqnRFIK0LXrL3jwTg3afnKSFemXx4Jhua39JFNMg2mB2KLHU?purpose=inline)

2\. Attribute directives

Change the appearance or behavior of an existing element.

Examples: `ngClass`, `ngStyle`, and custom highlight directives.

[Angular Decorators: Defining Components, Directives & Services | Shashi Verma posted on the topic | LinkedIn](https://images.openai.com/static-rsc-4/48dTsV-5FWkYJncKKvX-yUn3-ldi5cZRUmRkn112G_5JBTjA-90ru1ghrW8BnzjLk4KOfMMlIpbNXHzvLKOtqmL5RS4O_KOwi8fbv3MCKgjLPiayttGLN6h9Ktw4zQ-fQVfunhwQIIMXfHeP0yQOrZwQBxwXvKfr-5kT1lC28SQ?purpose=inline)

3\. Components

Components are directives with their own templates. They define a view, whereas a typical custom attribute directive does not have its own template.

In this lesson, we will create a custom attribute directive.

## 2. Create a custom directive

Let's create a directive that highlights an element when the mouse enters it and removes the highlight when the mouse leaves.

### Step 1: Generate the directive

Run this command in your Angular project terminal:

```
ng generate directive highlight
```

Short form:

```
ng g d highlight
```

Angular CLI generates a file such as `highlight.directive.ts`. In a modern Angular project, the directive is standalone by default.

### Step 2: Implement the directive

highlight.directive.ts

```
import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {

  @HostBinding('style.backgroundColor')
  backgroundColor = '';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.backgroundColor = '';
  }
}
```

Let's understand the important parts.

| Code                          | Meaning                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `@Directive()`                | Marks the class as an Angular directive.                           |
| `selector: '[appHighlight]'`  | Allows us to use the directive as an HTML attribute.               |
| `@HostBinding()`              | Binds a directive property to a property of the host HTML element. |
| `@HostListener('mouseenter')` | Calls a method when the mouse enters the element.                  |
| `@HostListener('mouseleave')` | Calls a method when the mouse leaves the element.                  |

The host element is the HTML element on which you apply the directive.

For example, if you write `<h2 appHighlight>`, the `<h2>` is the host element.

### Step 3: Use the directive in your HTML

```
<h2 appHighlight>Product Management</h2>

<p appHighlight>
  Angular custom directives are reusable.
</p>

<button appHighlight>
  Move your mouse over me
</button>
```

When you move your mouse over any of these elements, its background becomes yellow. When you move the mouse away, the background returns to its original state.

### Step 4: Import the directive

If your component is standalone, import `HighlightDirective` into the component where you want to use it.

```
import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [HighlightDirective],
  templateUrl: './test.component.html'
})
export class TestComponent {}
```

Use the correct relative path for your project structure. If your component is declared in an NgModule instead, import the standalone directive into that module.

## 3. How does it work internally?

HTML element

`<h2 appHighlight>Product</h2>`

Angular finds the directive

`selector: '[appHighlight]'`

Mouse event occurs

`mouseenter` or `mouseleave`

Element appearance changes

`backgroundColor = 'yellow'`

The directive does not create a new HTML element or a separate view. It adds behavior to an existing element.

## 4. Can we pass a color to the directive?

Yes. We can make the directive reusable by allowing the developer to specify the highlight color.

For example:

```
<h2 appHighlight="lightblue">Product One</h2>

<h2 appHighlight="lightgreen">Product Two</h2>
```

To support this, use an input property in the directive.

```
import {
  Directive,
  HostBinding,
  HostListener,
  Input
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {

  @Input() appHighlight = 'yellow';

  @HostBinding('style.backgroundColor')
  backgroundColor = '';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.backgroundColor = this.appHighlight;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.backgroundColor = '';
  }
}
```

Here, `@Input() appHighlight` receives the value supplied in the HTML attribute. If no value is supplied, it uses the default color, yellow.

## 5. Summary: Custom directive vs. component

| Component                       | Custom attribute directive                           |
| ------------------------------- | ---------------------------------------------------- |
| Has its own template or view    | Usually has no separate template                     |
| Creates a reusable UI section   | Adds reusable behavior or styling                    |
| Example: `app-product-list`     | Example: `appHighlight`                              |
| Can contain HTML, CSS and logic | Typically focuses on behavior of an existing element |

Remember these three concepts:

- `@Directive` defines the custom directive.
- `@HostListener` responds to events on the host element.
- `@HostBinding` updates properties or attributes of the host element.

These are the foundational concepts for creating custom attribute directives in modern Angular.