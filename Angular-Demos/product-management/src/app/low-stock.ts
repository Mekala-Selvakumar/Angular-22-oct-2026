import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appLowStock]',
      host: {
        '[class.low-stock]': 'stockQuantity() <= threshold()'
    }

})
export class LowStock {

      stockQuantity = input.required<number>({
        alias: 'appLowStock'
    });

    threshold = input(5);

}
