These features allow you to apply CSS classes dynamically based on values defined in the component's TypeScript class.

Let's understand each example using your `TestComponent`.

## 1. Component HTML

This contains four `<h2>` elements.

```
<!-- Example 1: Property binding -->
<h2 [class]="successClass">StackRoute</h2>

<!-- Example 2: Multiple CSS classes -->
<h2 class="text-special" [class]="successClass">
  StackRoute
</h2>

<!-- Example 3: Conditional class binding -->
<h2 [class.text-danger]="hasError">
  StackRoute
</h2>

<!-- Example 4: Dynamic multiple classes using ngClass -->
<h2 [ngClass]="messageClasses">
  StackRoute
</h2>
```

## 2. Component TypeScript

```
export class TestComponent implements OnInit {

  public successClass = "text-success";

  public hasError = false;

  public isSpecial = true;

  public messageClasses = {
    "text-success": !this.hasError,
    "text-danger": this.hasError,
    "text-special": this.isSpecial
  };

  constructor() {}

  ngOnInit(): void {}
}
```

The CSS styles defined in the component are:

```
.text-success {
  color: green;
}

.text-danger {
  color: red;
}

.text-special {
  font-style: italic;
}
```

## 3. Explanation of each example

### Example 1: `[class]` — Apply a CSS class dynamically

```
<h2 [class]="successClass">StackRoute</h2>
```

The component contains:

```
public successClass = "text-success";
```

Angular evaluates `successClass` and applies its value as the element's CSS class.

The resulting HTML is effectively:

```
<h2 class="text-success">StackRoute</h2>
```

Output: StackRoute appears in green.

Use `[class]` when you want to bind the element's complete class attribute to a string value. Be careful: it can replace other classes specified in the class attribute.

### Example 2: Combine a static class and `[class]`

```
<h2 class="text-special" [class]="successClass">
  StackRoute
</h2>
```

Here, you are specifying two things:

- `class="text-special"` — a static CSS class.
- `[class]="successClass"` — a dynamically supplied CSS class.

The intention is to apply both italic styling and green text. However, do not rely on combining a static `class` attribute with `[class]` to preserve both classes, because `[class]` can replace the class attribute's value.

A safer approach is:

```
<h2 class="text-special" [class.text-success]="true">
  StackRoute
</h2>
```

Or use `ngClass`:

```
<h2 [ngClass]="['text-special', successClass]">
  StackRoute
</h2>
```

Output: Green, italic text.

### Example 3: `[class.className]` — Conditional class binding

```
<h2 [class.text-danger]="hasError">
  StackRoute
</h2>
```

The important syntax is:

```
[class.CSS_CLASS_NAME]="CONDITION"
```

In this example:

```
public hasError = false;
```

Since `hasError` is `false`, Angular does not apply `text-danger`.

If you change the value:

```
public hasError = true;
```

Angular applies the `text-danger` class, and the text becomes red.

| `hasError` | Class applied    | Text color |
| ---------- | ---------------- | ---------- |
| `false`    | No `text-danger` | Default    |
| `true`     | `text-danger`    | Red        |

This is particularly useful for displaying validation errors, success messages, and warning indicators.

### Example 4: `[ngClass]` — Apply multiple classes dynamically

```
<h2 [ngClass]="messageClasses">
  StackRoute
</h2>
```

The `messageClasses` object is:

```
public messageClasses = {
  "text-success": !this.hasError,
  "text-danger": this.hasError,
  "text-special": this.isSpecial
};
```

Angular interprets the object as CSS class name → condition.

| CSS class      | Condition        | Applied? |
| -------------- | ---------------- | -------- |
| `text-success` | `!this.hasError` | Yes      |
| `text-danger`  | `this.hasError`  | No       |
| `text-special` | `this.isSpecial` | Yes      |

With the initial values:

```
hasError = false;
isSpecial = true;
```

The expression evaluates to:

```
{
  "text-success": true,
  "text-danger": false,
  "text-special": true
}
```

Therefore, Angular applies `text-success` and `text-special`.

Output: Green, italic StackRoute text.

One important detail: the `messageClasses` object is evaluated when the component initializes. If `hasError` or `isSpecial` changes later, the object does not automatically recalculate its boolean values. For a beginner demo, you can update the object when those properties change, or use a computed signal or another reactive approach.

## 4. Quick comparison

| Feature               | Purpose                            | Example                          |
| --------------------- | ---------------------------------- | -------------------------------- |
| `class="..."`         | Apply a static class               | `class="text-success"`           |
| `[class]`             | Bind the complete class value      | `[class]="successClass"`         |
| `[class.text-danger]` | Toggle one class conditionally     | `[class.text-danger]="hasError"` |
| `[ngClass]`           | Apply multiple classes dynamically | `[ngClass]="messageClasses"`     |

## 5. Practical demo: Toggle success and error messages

You can make the example interactive so learners can see the CSS classes change.

test.component.html

```
<h2 [class.text-success]="!hasError"
    [class.text-danger]="hasError"
    [class.text-special]="isSpecial">
  StackRoute
</h2>

<p>Error status: {{ hasError }}</p>

<button (click)="hasError = !hasError">
  Toggle Error
</button>

<button (click)="isSpecial = !isSpecial">
  Toggle Italic
</button>
```

test.component.ts

```
export class TestComponent {
  public hasError = false;
  public isSpecial = true;
}
```

Keep the same CSS styles shown earlier.

When you click Toggle Error, the text switches between green and red. When you click Toggle Italic, the italic styling is switched on or off.

This example uses property-based class bindings, so Angular responds directly when the component properties change.

