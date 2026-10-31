In Angular 22, the main difference between a normal class variable and a signal is how Angular knows when a value changes and updates the UI.

A normal variable stores a value. A signal stores a value and notifies Angular when that value changes, allowing Angular to update the parts of the UI that depend on it.

Let's understand this using a simple counter demo.

## 1. Normal class variable vs `signal()`

| Feature                        | Normal variable                                               | Signal                                                                             |
| ------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Declaration                    | `count = 0;`                                                  | `count = signal(0);`                                                               |
| Read the value                 | `this.count`                                                  | `this.count()`                                                                     |
| Change the value               | `this.count++`                                                | `this.count.set(...)` or `.update(...)`                                            |
| Notifies Angular about changes | No signal-based notification                                  | Yes                                                                                |
| Template updates               | Depends on Angular change detection and how the change occurs | Angular tracks signal dependencies and updates affected UI when the signal changes |

Important: A normal variable can still update the UI when Angular runs change detection. Signals provide explicit, reactive change notification; they are not the only way to update an Angular template.

## 2. Small demo: Counter using both approaches

We will create two counters in the same Angular component and compare them.

## Counter demonstration

Normal variable

# 2

IncrementReset

Signal

# 0

IncrementReset

This is an interactive illustration of the two counters. The code below shows how to implement them in Angular.

### Step 1: Create the component

In `app.ts` (or your component's TypeScript file):

```
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h2>Normal Variable</h2>
    <p>Count: {{ normalCount }}</p>
    <button (click)="incrementNormal()">
      Increment Normal
    </button>

    <hr>

    <h2>Signal</h2>
    <p>Count: {{ signalCount() }}</p>
    <button (click)="incrementSignal()">
      Increment Signal
    </button>
  `
})
export class App {
  // Normal class variable
  normalCount = 0;

  // Signal
  signalCount = signal(0);

  incrementNormal() {
    this.normalCount++;
  }

  incrementSignal() {
    this.signalCount.update(value => value + 1);
  }
}
```

This example uses an inline template, so you do not need a separate HTML file for this demo.

### Step 2: Understand how the values change

Normal variable

```
normalCount = 0;

incrementNormal() {
  this.normalCount++;
}
```

- `normalCount` directly stores a number.
- `this.normalCount++` changes its value.
- Angular can update the displayed value when change detection runs, such as after this button click.

Signal

```
signalCount = signal(0);

incrementSignal() {
  this.signalCount.update(value => value + 1);
}
```

- `signal(0)` creates a writable signal with an initial value of `0`.
- `signalCount()` reads its current value.
- `.update()` calculates and stores the next value.
- Angular tracks the signal read by the template and reacts when that signal changes.

## 3. The important difference: How Angular tracks changes

Consider this example:

```
price = 100;
quantity = signal(2);

total = computed(() => 100 * this.quantity());
```

Here, `computed()` creates a derived signal. You must also import it:

```
import { computed, signal } from '@angular/core';
```

Whenever `quantity` changes through its signal API, `total` recalculates when needed.

For example:

```
this.quantity.set(5);
```

The total becomes `500`.

A normal variable does not provide this built-in dependency tracking. You would have to calculate the total yourself or use another mechanism.

## 4. When should you use each one?

| Situation                                         | Recommended approach                                         |
| ------------------------------------------------- | ------------------------------------------------------------ |
| Simple local value that doesn't drive reactive UI | Normal variable                                              |
| Counter or form-related UI state                  | Signal is a good choice                                      |
| Derived values such as total price                | `computed()` with signals                                    |
| Data shared between components                    | Often a service using signals, depending on the requirements |

For your Product Management application, you might use:

```
products = signal<Product[]>([]);
selectedProduct = signal<Product | null>(null);
```

This is useful when the product list or selected product changes and the template depends on those values.

Remember this simple rule:

- Normal variable: `count = 0` → change the value with `count++`.
- Signal: `count = signal(0)` → read with `count()` and change with `count.set()` or `count.update()`.

Signals are a reactive state-management feature built into Angular. They work alongside normal class variables rather than replacing every variable in your application.
------------
--  Real Differencce
You are absolutely right. In the previous counter example, both counters update when you click the button, so you cannot easily see the real difference between a normal variable and a signal.

Let's use a better example that demonstrates two important differences:

1. Change detection: A normal variable changing does not, by itself, notify Angular that the value has changed.
2. Reactivity: Signals notify Angular when their values change and can automatically update dependent values created with `computed()`.

## Demo 1: Change a variable without notifying Angular

Imagine that you have a normal variable and a signal. You change both values using a timer callback outside Angular's normal event-handling flow.

Instead of comparing two counters, let's use a shopping cart total, where the difference becomes much clearer.

## Demo 1: Normal variables vs signals in a shopping cart

Suppose the product price is ₹500 and the quantity is 2.

- With normal variables, you must manually recalculate the total whenever the quantity changes.
- With signals, `computed()` recalculates the total automatically whenever a dependency changes.

### Normal variables

Price: ₹500

# ₹2000

Quantity: 4

−+

Recalculate total

Total is correct.

### Signals + computed

Price: ₹500

# ₹2000

Quantity: 4

−+

Total recalculates automatically.

Try increasing the quantity on both sides. On the normal-variable side, the total remains unchanged until you click Recalculate total. On the signal side, the displayed total changes immediately.

The interactive illustration above demonstrates the behavior. Here is the actual Angular implementation.

### Angular code

`app.ts`

```
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h2>Normal Variables</h2>

    <p>Quantity: {{ quantity }}</p>
    <p>Total: ₹{{ total }}</p>

    <button (click)="increaseQuantity()">
      Increase Quantity
    </button>

    <button (click)="recalculateTotal()">
      Recalculate Total
    </button>

    <hr>

    <h2>Signals</h2>

    <p>Quantity: {{ signalQuantity() }}</p>
    <p>Total: ₹{{ signalTotal() }}</p>

    <button (click)="increaseSignalQuantity()">
      Increase Quantity
    </button>
  `
})
export class App {

  // Normal variables
  price = 500;
  quantity = 2;
  total = 1000;

  increaseQuantity() {
    this.quantity++;
  }

  recalculateTotal() {
    this.total = this.price * this.quantity;
  }

  // Signals
  signalPrice = signal(500);
  signalQuantity = signal(2);

  signalTotal = computed(
    () => this.signalPrice() * this.signalQuantity()
  );

  increaseSignalQuantity() {
    this.signalQuantity.update(q => q + 1);
  }
}
```

### What happens when you click?

Initially, both totals are ₹1,000.

| Action                        | Normal variables                       | Signals                                  |
| ----------------------------- | -------------------------------------- | ---------------------------------------- |
| Increase quantity from 2 to 3 | Quantity becomes 3; total stays ₹1,000 | Quantity becomes 3; total becomes ₹1,500 |
| Increase quantity to 4        | Total stays ₹1,000 until recalculated  | Total becomes ₹2,000                     |
| Recalculate manually          | Total becomes ₹2,000                   | Not required                             |

Why does this happen?

With normal variables, `quantity` and `total` are independent values. Angular does not automatically know that `total` must be recalculated when `quantity` changes.

With signals, `computed()` tracks the signals it reads. When `signalQuantity` changes, Angular's signal system knows that `signalTotal` depends on it, so the derived value updates automatically.

## Demo 2: Does changing a normal variable always update the UI?

Not necessarily. Consider:

```
count = 0;

changeCount() {
  this.count = 10;
}
```

If this method is called by a normal Angular template event, such as `(click)`, Angular's change-detection mechanism will normally update the displayed value.

But if you change `count` from code that does not notify or trigger Angular's change-detection mechanism, the UI may remain stale until another change-detection run occurs. The exact behavior depends on your Angular configuration, including whether it uses zoneless change detection.

A signal provides an explicit notification mechanism:

```
count = signal(0);

changeCount() {
  this.count.set(10);
}
```

When a template reads `count()`, Angular tracks that dependency and schedules the necessary UI update when the signal changes.

## The key takeaway

- Normal variable: stores a value; you manage dependent calculations yourself.
- Signal: stores a value and participates in Angular's reactive notification system.
- `computed()`: automatically derives a value from other signals.

For Angular 22, you do not need to convert every class variable into a signal. Use signals when you want reactive state and automatically derived values.