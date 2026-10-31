 Style binding allows you to dynamically apply CSS styles directly to an HTML element using Angular template syntax.

## 1. Example 1: Binding a CSS color

```
<h2 [style.color]="'blue'">Style Binding</h2>
```

Explanation:

- `[style.color]` tells Angular to bind the element's CSS `color` property.
- `'blue'` is the value assigned to the CSS property. The quotes around `blue` make it a string.
- `Style Binding` is the text displayed inside the heading.

Output: The heading text appears in blue.

You can also use a component property instead of a hardcoded value.

test.component.ts

```
export class TestComponent {
  textColor = 'blue';
}
```

test.component.html

```
<h2 [style.color]="textColor">Style Binding</h2>
```

Now, if you change `textColor` to `'red'`, Angular updates the text color to red automatically.

## 2. Example 2: Binding a CSS property with units

```
<h2 [style.font-size.px]="30">
  Style Binding with units
</h2>
```

Explanation:

- `[style.font-size.px]` binds the CSS `font-size` property.
- `.px` specifies that the numeric value should be interpreted in pixels.
- `30` means the font size is `30px`.

Output: The heading appears with a font size of 30 pixels.

You can also bind the value to a component property:

```
export class TestComponent {
  fontSize = 30;
}
```

```
<h2 [style.font-size.px]="fontSize">
  Style Binding with units
</h2>
```

If `fontSize` changes to `40`, the font size becomes `40px`.

## 3. How does Angular style binding work?

The general syntax is:

```
<element [style.css-property]="value">
  Content
</element>
```

For properties that need units, use:

```
<element [style.css-property.unit]="value">
  Content
</element>
```

Examples:

| Angular style binding                 | Resulting CSS              |
| ------------------------------------- | -------------------------- |
| `[style.color]="'red'"`               | `color: red`               |
| `[style.background-color]="'yellow'"` | `background-color: yellow` |
| `[style.font-size.px]="30"`           | `font-size: 30px`          |
| `[style.width.px]="200"`              | `width: 200px`             |
| `[style.margin-top.px]="10"`          | `margin-top: 10px`         |

## 4. Style binding vs. class binding

| Class binding                    | Style binding                                        |
| -------------------------------- | ---------------------------------------------------- |
| Applies or removes CSS classes   | Sets individual CSS properties                       |
| `[class.text-danger]="hasError"` | `[style.color]="textColor"`                          |
| CSS is defined in a stylesheet   | CSS values can be specified directly in the template |

Trainer's takeaway: Use class binding when you want to apply predefined CSS styles, and use style binding when you want to set individual CSS properties dynamically.

The screenshot demonstrates two Angular concepts: style binding using a component property and `ngStyle` for applying multiple CSS styles dynamically.

## 1. Example 1: `[style.color]`

```
<h2 [style.color]="highlightColor">
  Style Binding 2
</h2>
```

In the component's TypeScript file:

```
export class TestComponent {
  highlightColor = 'blue';
}
```

How it works:

- `[style.color]` binds the CSS `color` property.
- `highlightColor` refers to a property in the component class.
- Its value, `'blue'`, determines the text color.

Output: Style Binding 2 appears in blue.

If you change `highlightColor` to `'red'`, Angular updates the text color to red.

Notice that, unlike the earlier example `[style.color]="'blue'"`, this example uses a component property instead of a hardcoded string.

## 2. Example 2: `[ngStyle]`

```
<h2 [ngStyle]="titleStyles">
  Style Binding 3
</h2>
```

Here, `titleStyles` is an object containing multiple CSS properties and their values.

Component TypeScript:

```
export class TestComponent {
  titleStyles = {
    color: 'green',
    fontSize: '30px',
    fontStyle: 'italic',
    backgroundColor: 'lightyellow'
  };
}
```

Angular applies all the styles specified in the object to the `<h2>` element.

Expected output

# Style Binding 3

Green text · 30px font · Italic · Light-yellow background

### How does `ngStyle` work?

The general syntax is:

```
<element [ngStyle]="styleObject">
  Content
</element>
```

The object maps CSS properties to their values.

| TypeScript property              | CSS effect              |
| -------------------------------- | ----------------------- |
| `color: 'green'`                 | Green text              |
| `fontSize: '30px'`               | Font size of 30 pixels  |
| `fontStyle: 'italic'`            | Italic text             |
| `backgroundColor: 'lightyellow'` | Light-yellow background |

You can use CSS property names in camelCase, such as `fontSize`, or quoted CSS names such as `'font-size'`.

Note: In a standalone Angular component, import `NgStyle` from `@angular/common` or import `CommonModule`. In a module-based component, ensure `CommonModule` is imported.

## 3. Style binding vs. `ngStyle`

| Feature         | `[style.color]`                  | `[ngStyle]`                      |
| --------------- | -------------------------------- | -------------------------------- |
| Purpose         | Set an individual CSS property   | Set multiple CSS properties      |
| Value           | A single value                   | An object of style-value pairs   |
| Example         | `[style.color]="highlightColor"` | `[ngStyle]="titleStyles"`        |
| Best suited for | Changing one style               | Changing several styles together |
